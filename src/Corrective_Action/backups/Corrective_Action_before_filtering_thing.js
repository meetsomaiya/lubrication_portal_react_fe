import React, { useState, useEffect } from "react";
import "./Corrective_Action.css";
import * as XLSX from "xlsx";  // Import the XLSX library

import moment from 'moment-timezone';

const TableComponent9976_admin = () => {

      let entryTime = null;  // Store the entry time (when user stepped into the page)
      let exitTime = null;   // Store the exit time (when user left the page)
      
      const sendCookiesToBackend = async () => {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});
      
  // Get the current pathname when using HashRouter
  const pathname = window.location.hash.replace(/^#/, '');
      
        // Get the current time in IST format
        const currentTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      
        // Prepare the data to send to the backend
        const cookieData = {
          name: cookies.name || 'Not Set',
          adminId: cookies.adminId || 'Not Set',
          access: cookies.access || 'Not Set',
          adminEmail: cookies.adminEmail || 'Not Set',
          userId: cookies.userId || 'Not Set',
          domain_id: cookies.adminDomain || 'Not Set',
          state: cookies.state || 'Not Set',
          area: cookies.area || 'Not Set',
          site: cookies.site || 'Not Set',
          email: cookies.email || 'Not Set',
          pathname: pathname,  // Add the pathname to the data
          entryTime: entryTime, // Include entry time (when user stepped in)
          exitTime: exitTime,   // Include exit time (when user leaves)
        };
      
        console.log('Sending the following cookie data to backend:', cookieData);
      
        try {
          // Send data to the backend's heartbeat API
          const response = await fetch('http://localhost:224/api/heartbeat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cookieData),
          });
      
          if (response.ok) {
            console.log('Cookie data sent to backend successfully.');
          } else {
            console.error('Error sending cookie data to backend:', response.status);
          }
        } catch (error) {
          console.error('Failed to send cookie data:', error);
        }
      };
      
      useEffect(() => {
        // Set entry time when the page loads
        entryTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log(`Entry Time (IST): ${entryTime}`);
      
        // Add event listener for beforeunload (browser close / tab close)
        const handleBeforeUnload = () => {
          exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
          console.log(`Exit Time (IST): ${exitTime}`);
          sendCookiesToBackend();
        };
      
        window.addEventListener('beforeunload', handleBeforeUnload);
      
        return () => {
          // Clean up the event listener when the component unmounts
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);
      
      useEffect(() => {
        const handlePathChange = () => {
          // Capture exit time and send cookies when pathname changes
          exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
          console.log(`Exit Time (IST): ${exitTime}`);
          sendCookiesToBackend();
        };
      
        // Listen for changes in the pathname using window.history
        const windowHistoryPushState = window.history.pushState;
        window.history.pushState = function (...args) {
          handlePathChange();
          return windowHistoryPushState.apply(this, args);
        };
      
        const windowHistoryReplaceState = window.history.replaceState;
        window.history.replaceState = function (...args) {
          handlePathChange();
          return windowHistoryReplaceState.apply(this, args);
        };
      
        return () => {
          // Reset window.history methods when component unmounts
          window.history.pushState = windowHistoryPushState;
          window.history.replaceState = windowHistoryReplaceState;
        };
      }, []);
    
    // Call the polling function on mount
    useEffect(() => {
      // Send cookies on page unload and capture exit time
      const handleBeforeUnload = (event) => {
        exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log(`Exit Time (IST): ${exitTime}`);
    
        // Send cookies and exit time to backend when user is leaving the page
        sendCookiesToBackend();
      };
    
      // Attach event listener for beforeunload
      window.addEventListener('beforeunload', handleBeforeUnload);
    
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
    
  // Define state to hold the fetched data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Directly call the API without needing to send email from cookies
    const apiUrl = `http://localhost:224/api/fetch_oil_under_supervision_admin`;

    console.log("Sending GET request to:", apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Response from API:", responseData);
        // Set the response data into state
        setData(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);  // No dependencies needed since we don't need to fetch based on email anymore

  // Get the table headers from the first row of the data (assuming data is not empty)
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  // Function to handle Excel download
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);  // Convert JSON data to worksheet
    const wb = XLSX.utils.book_new();  // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Oil Supervision Data");  // Append the worksheet to the workbook
    XLSX.writeFile(wb, "oil_supervision_data.xlsx");  // Trigger the download of the Excel file
  };

  return (
    <div className="table-container-9976">
      {/* Button to trigger Excel download */}
      <button className="download-btn" onClick={downloadExcel}>
        Download Excel
      </button>

      <table className="data-table-9976">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.replace(/_/g, " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, idx) => (
                <td key={idx}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent9976_admin;
