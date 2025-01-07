import React, { useEffect } from 'react';
import './Home.css';

function Home() {
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
