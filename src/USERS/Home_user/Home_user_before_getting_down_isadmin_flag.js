import React, { useEffect, useState } from 'react';
import './Home.css';
import moment from 'moment-timezone';
import { BASE_URL } from '../../config'

function Home_user() {
  const [domainId, setDomainId] = useState(null);  // State to store the domain_id

  let entryTime = null;  // Store the entry time (when user stepped into the page)
  let exitTime = null;   // Store the exit time (when user left the page)

   // Function to extract domain_id from URL and decode it
   const extractDomainIdFromUrl = () => {
    try {
      const hash = window.location.hash;
      console.log('Window location hash:', hash);

      // Split the hash to get query string after the first '?'
      const [path, queryString] = hash.split('?');
      if (!queryString) {
        console.error('Hash does not contain query parameters');
        return null;
      }

      console.log('Query string:', queryString);

      // Parse the query string using URLSearchParams
      const urlParams = new URLSearchParams(queryString);

      // Get the domain_id from the query string
      const domainIdFromUrl = urlParams.get('domain_id');
      console.log('Encoded Domain ID from URL:', domainIdFromUrl);

      if (domainIdFromUrl) {
        // Decode the Base64 encoded domain_id
        const decodedDomainId = atob(domainIdFromUrl);
        console.log('Decoded Domain ID:', decodedDomainId);

        // Set the decoded domain_id to the state
        setDomainId(decodedDomainId);

        // Set the domain_id as a cookie
        document.cookie = `domain_id=${decodedDomainId}; path=/`;

        // Send the AJAX request to the API for auto login
        sendAutoLoginRequest(decodedDomainId);

        return decodedDomainId;
      } else {
        console.error('domain_id not found in URL');
        return null;
      }
    } catch (error) {
      console.error('Error extracting or decoding domain_id:', error);
      return null;
    }
  };

  // Function to send the AJAX request to api_for_auto_login
  const sendAutoLoginRequest = async (domainId) => {
    try {
      // Log the data being sent
      console.log('Sending data to auto login API:', { domain_id: domainId });
  
     const response = await fetch('http://localhost:224/api/api_for_auto_login', {
        // const response = await fetch('http://localhost:3001/api/api_for_auto_login', {
        // const response = await fetch(`${BASE_URL}/api/api_for_auto_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain_id: domainId }),
      });
  
      if (response.ok) {
        const userData = await response.json();  // Assuming the response is in JSON format
        console.log('Auto login API request successful', userData);
  
        // Encode each field properly before storing in cookies to handle special characters (like commas)
        document.cookie = `userId=${encodeURIComponent(userData.id)}; path=/`;
        document.cookie = `domain_id=${encodeURIComponent(userData.domain_id)}; path=/`;
        document.cookie = `name=${encodeURIComponent(userData.name)}; path=/`;
        document.cookie = `email=${encodeURIComponent(userData.email)}; path=/`;
        document.cookie = `state=${encodeURIComponent(userData.state)}; path=/`;
        document.cookie = `area=${encodeURIComponent(userData.area)}; path=/`;
        document.cookie = `site=${encodeURIComponent(userData.site)}; path=/`;
        document.cookie = `access=${encodeURIComponent(userData.access)}; path=/`;
  
      } else {
        console.error('Error sending auto login request:', response.status);
      }
    } catch (error) {
      console.error('Failed to send auto login request:', error);
    }
  };
  
  // Function to retrieve and decode cookie values
  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  };
  


  // Function to send cookies to the backend
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
      userId: cookies.userId || 'Not Set',
      access: cookies.access || 'Not Set',
      adminEmail: cookies.adminEmail || 'Not Set',
      domain_id: cookies.domain_id || 'Not Set',  // Use the state for domain_id
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

    // Call the function to extract domain_id from URL
    extractDomainIdFromUrl();

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
  }, [domainId]); // Dependency array to re-run on domainId change

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
    // Use setTimeout to delay the execution by 2 seconds
    const timer = setTimeout(() => {
      // Extract the query parameters from the hash
      const hashParams = window.location.hash.split('?')[1];
    
      // Check if the reload query parameter is present
      if (!hashParams || !hashParams.includes('reload=true')) {
        // Append the reload query parameter to the hash
        const baseHash = window.location.hash.split('?')[0]; // Get the base part of the hash
        const updatedHash = `${baseHash}?reload=true`;
    
        // Update the hash and reload the page
        window.location.hash = updatedHash;
        window.location.reload(); // Reload the page
      }
    }, 2000); // 2000ms = 2 seconds
    
    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  
  }, []);

  return (
    <div className="home_container">
      <h1 className='home_title'>Welcome to the Lubrication Portal</h1>
      {/* Display decoded domain_id on the page */}
      {/* <p>Decoded Domain ID from URL: {domainId}</p>  */}
    </div>
  );
}

export default Home_user;
