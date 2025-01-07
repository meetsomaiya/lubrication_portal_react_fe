import React, { useEffect } from 'react';
import './Home.css';
import moment from 'moment-timezone';

function Home_user() {

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
                    userId: cookies.userId || 'Not Set',
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

  // Polling function to check user-specific cookies every 5 seconds
function pollUserCookies() {
  setInterval(() => {
      // Parse cookies into an object
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = decodeURIComponent(value);
          return acc;
      }, {});

      // Log the fetched data
      console.log('Polling User Cookie Data:');
      console.log(`Name: ${cookies.name || 'Not Set'}`);
      console.log(`User ID: ${cookies.userId || 'Not Set'}`);
      console.log(`Access: ${cookies.access || 'Not Set'}`);
      console.log(`Domain ID: ${cookies.domain_id || 'Not Set'}`);
      console.log(`State: ${cookies.state || 'Not Set'}`);
      console.log(`Area: ${cookies.area || 'Not Set'}`);
      console.log(`Site: ${cookies.site || 'Not Set'}`);
      console.log(`Email: ${cookies.email || 'Not Set'}`);
  }, 5000); // Poll every 5 seconds
}

// Start polling for user cookies
pollUserCookies();


  useEffect(() => {
    // Check if the URL already contains the reload query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('reload')) {
      // Add the query parameter and reload the page once
      window.location.search = '?reload=true';
    }
  }, []);

  return (
    <div className="home_container">
      <h1 className='home_title'>Welcome to the Lubrication Portal</h1>
    </div>
  );
}

export default Home_user;
