import React, { useState, useEffect } from "react";
import "./RegisterUsers3394.css";
import moment from 'moment-timezone';
import { BASE_URL } from '../config'

const RegisterUsers3394 = () => {
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
                      // const response = await fetch('http://localhost:224/api/heartbeat', {
                        const response = await fetch(`${BASE_URL}/api/heartbeat`, {
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

                                             const checkAdminIdAndRedirect = () => {
                                                                          const getCookie = (name) => {
                                                                            const value = `; ${document.cookie}`;
                                                                            const parts = value.split(`; ${name}=`);
                                                                            if (parts.length === 2) return parts.pop().split(';').shift();
                                                                          };
                                                                        
                                                                          const adminId = getCookie('adminId'); // Retrieve the adminId from cookies
                                                                        
                                                                          if (!adminId) {
                                                                            // If adminId is not found, redirect to the default route
                                                                            window.location.href = '/'; // Redirect to the home page or default route
                                                                          }
                                                                        };
                                                          
                                                                        useEffect(() => {
                                                                          checkAdminIdAndRedirect(); // Check adminId and redirect if not found
                                                                        }, []); // Empty dependency array to ensure this runs only once on mount
                
  const [file3394, setFile3394] = useState(null);

  // Handle file selection
  const handleFileChange3394 = (e) => {
    setFile3394(e.target.files[0]);
  };

  const handleDownloadFormat = () => {
    // Trigger the download by requesting the file from the backend
    // fetch('http://localhost:224/api/user-registration-excel-format') 
    fetch(`${BASE_URL}/api/user-registration-excel-format`)
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
        link.download = 'excel_download_user_registration.xlsx'; // The file name to be downloaded
        link.click(); // Simulate a click to start the download
      })
      .catch((error) => {
        console.error('Error downloading format:', error);
        alert('Failed to download the format. Please try again later.');
      });
  };

  // Handle form submission
  const handleSubmit3394 = async (e) => {
    e.preventDefault();

    if (file3394) {
      // Create FormData object
      const formData = new FormData();
      formData.append("file", file3394);

      // Log the file being sent
      console.log("File being sent to the backend:", file3394);

      try {
        // Make POST request using fetch
        // const response = await fetch(
        //   "http://localhost:224/api/register-users-via-excel",
        const response = await fetch(`${BASE_URL}/api/register-users-via-excel`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        alert(`File uploaded successfully: ${data.message}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      }
    } else {
      alert("No file selected");
    }
  };

  return (
    <div className="register-users-container-3394">
      <h2 className="register-users-title-3394">Register Users via Excel Upload</h2>
      <form className="register-users-form-3394" onSubmit={handleSubmit3394}>
        <div className="file-input-container-3394">
          <label htmlFor="file-upload-3394" className="file-label-3394">
            Upload Excel File:
          </label>
          <input
            type="file"
            id="file-upload-3394"
            onChange={handleFileChange3394}
            className="file-input-3394"
          />
        </div>
        <button
  type="button"
  className="format-button-3394"
  onClick={handleDownloadFormat}
>
  Format of uploading users
</button>

        <button type="submit" className="upload-button-3394">
          Upload and Register Users
        </button>
      </form>
    </div>
  );
};

export default RegisterUsers3394;
