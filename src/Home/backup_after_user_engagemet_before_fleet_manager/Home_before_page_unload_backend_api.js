import React, { useEffect } from 'react';
import './Home.css';

function Home() {

  // Polling function to check cookies every 5 seconds
function pollCookies() {
  setInterval(() => {
      // Parse cookies into an object
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = decodeURIComponent(value);
          return acc;
      }, {});

      // Log the fetched data
      console.log('Polling Cookie Data:');
      console.log(`Name: ${cookies.name || 'Not Set'}`);
      console.log(`Admin ID: ${cookies.adminId || 'Not Set'}`);
      console.log(`Access: ${cookies.access || 'Not Set'}`);
      console.log(`Admin Email: ${cookies.adminEmail || 'Not Set'}`);
  }, 5000); // Poll every 5 seconds
}

// Start polling
pollCookies();

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

export default Home;
