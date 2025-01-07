import React, { useState, useEffect } from "react";
import "./Corrective_Action.css";
import * as XLSX from "xlsx";  // Import the XLSX library

const TableComponent9976 = () => {
  // Define state to hold the fetched data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Retrieve email from cookies
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const email = cookies.email;

    if (email) {
      const apiUrl = `http://localhost:224/api/fetch_oil_under_supervision?loginUser=${email}`;
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
    } else {
      console.warn("Email cookie not found.");
    }
  }, []);

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

export default TableComponent9976;
