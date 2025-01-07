import React, { useState, useEffect } from 'react';
import './ExcelUpload7756.css';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';

const UploadExcel = () => {

       let entryTime = null;  // Store the entry time (when user stepped into the page)
                let exitTime = null;   // Store the exit time (when user left the page)
                
                const sendCookiesToBackend = async () => {
                  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = decodeURIComponent(value);
                    return acc;
                  }, {});
                
                  // Get the current pathname
                  const pathname = window.location.pathname;
                
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

  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (['xlsx', 'xls'].includes(fileExtension)) {
        setFileName(file.name);
        setSelectedFile(file); // Store the file for backend upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
          setExcelData(data);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('suzoms.suzlon.com says\n\nPlease select a valid Excel file.');
      }
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      alert('suzoms.suzlon.com says\n\nPlease select a file first.');
      return;
    }
  
    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    // Log the contents of FormData by iterating through entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);  // Logs the file name and data
    }
  
    // Send the file to the backend
    fetch('http://localhost:224/api/site_incharge_format_upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('File uploaded successfully!');
        } else {
          alert('File upload failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
      });
  };
  

  const handleDownloadFormat = () => {
    // Trigger the download by requesting the file from the backend
    fetch('http://localhost:224/api/site-incharge-excel-format') // Update with your actual API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download the file');
        }
        return response.blob(); // Get the file as a Blob
      })
      .then((blob) => {
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create an object URL for the blob
        link.download = 'excel_download.xlsx'; // The file name to be downloaded
        link.click(); // Simulate a click to start the download
      })
      .catch((error) => {
        console.error('Error downloading format:', error);
        alert('Failed to download the format. Please try again later.');
      });
  };
  

  return (
    <div className="upload-excel-container7756">
      <h2 className="upload-header7756">Excel Upload - Site Incharge Mapping</h2>
      <div className="upload-horizontal7756">
        <label htmlFor="file-upload" className="choose-file7756">
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden-input7756"
        />
        <button className="download-format7756" onClick={handleDownloadFormat}>
          Download Format
        </button>
        <button className="upload-button7756" onClick={handleUploadClick}>
          Upload Excel
        </button>
      </div>
      {fileName && <p className="file-name7756">Selected file: {fileName}</p>}
      {/* {excelData && (
        <div className="excel-preview7756">
          <h3>Excel Data Preview</h3>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default UploadExcel;
