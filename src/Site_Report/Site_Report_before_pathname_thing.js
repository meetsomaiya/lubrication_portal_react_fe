import React, { useState, useEffect } from 'react';
import Lubrication from './Lubrication/Lubrication_table';
import Oil from './Oil/Oil';
import PM from './PM/PM';
import './Site_Report.css';

import { BASE_URL } from '../config'

import moment from 'moment-timezone';


function Site_Report() {

    let entryTime = null;  // Store the entry time (when user stepped into the page)
    let exitTime = null;   // Store the exit time (when user left the page)
  
  
    // Function to send the latest cookie data along with entry and exit times to backend
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
        domain_id: cookies.domain_id || 'Not Set',
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

      }, []);
  
      // Call the polling function on mount
      useEffect(() => {
       // pollCookies();
    
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

    const [selectedArea, setSelectedArea] = useState('Select');
    const [selectedSite1, setSelectedSite1] = useState('Select');
    const [selectedSite2, setSelectedSite2] = useState('Select');
    const [currentTab, setCurrentTab] = useState('Lubrication');
    const [states, setStates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [sites, setSites] = useState([]);
    const [reportData, setReportData] = useState(null); // State for fetched report data

    useEffect(() => {
        const fetchStates = async () => {
            try {
                // const response = await fetch('http://localhost:224/api/get_states');
                const response = await fetch(`${BASE_URL}/api/get_states`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setStates(data);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        fetchStates();
    }, []);

    const handleSelectChangeArea = (event) => {
        const selectedArea = event.target.value;
        setSelectedArea(selectedArea);
        fetchSites(selectedSite1, selectedArea);
        generateReport(selectedSite1, selectedArea, selectedSite2); // Call generateReport with the current selections
    };

    const handleSelectChangeSite1 = async (event) => {
        const selectedState = event.target.value;
        setSelectedSite1(selectedState);
        setSelectedArea('Select');

        if (selectedState !== "Select") {
            try {
                // const response = await fetch(`http://localhost:224/api/get_areas?state=${selectedState}`);
                const response = await fetch(`${BASE_URL}/api/get_areas?state=${selectedState}`);
                if (!response.ok) throw new Error('Failed to fetch areas');
                const areasData = await response.json();
                setAreas(areasData.map(item => item.area));
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        } else {
            setAreas([]);
        }
        generateReport(selectedState, selectedArea, selectedSite2);
    };

    const fetchSites = async (state, area) => {
        if (state !== "Select" && area !== "Select") {
            try {
                // const response = await fetch(`http://localhost:224/api/get_sites?state=${state}&area=${area}`);
                const response = await fetch(`${BASE_URL}/api/get_sites?state=${state}&area=${area}`);
                if (!response.ok) throw new Error('Failed to fetch sites');
                const sitesData = await response.json();
                setSites(sitesData);
            } catch (error) {
                console.error('Error fetching sites:', error);
            }
        } else {
            setSites([]);
        }
    };

    const handleSelectChangeSite2 = (event) => {
        setSelectedSite2(event.target.value);
        generateReport(selectedSite1, selectedArea, event.target.value); // Update report with new site selection
    };

    // Function to fetch and generate the report
    const generateReport = async (state, area, site) => {
        if (state !== 'Select' || area !== 'Select' || site !== 'Select') {
            const queryParams = new URLSearchParams({
                ...(state !== 'Select' && { state }),
                ...(area !== 'Select' && { area }),
                ...(site !== 'Select' && { site })
            }).toString();

            try {
                // const response = await fetch(`http://localhost:224/api/generate_site_report?${queryParams}`);
                const response = await fetch(`${BASE_URL}/api/generate_site_report?${queryParams}`);
                if (!response.ok) throw new Error('Failed to generate report');
                const data = await response.json();
                setReportData(data); // Set the report data state
                console.log("Fetched report data:", data); // Log the fetched data
            } catch (error) {
                console.error('Error generating report:', error);
            }
        } else {
            setReportData(null); // Reset if no valid selection
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'Lubrication':
                console.log("Passing data to Lubrication:", reportData); // Log the report data being passed
                return <Lubrication reportData={reportData} />;
            case 'Oil':
                return <Oil reportData={reportData} />;
            case 'PM':
                // return <PM />;
                return <PM reportData={reportData}/>;
            default:
                return <Lubrication reportData={reportData} />;
        }
    };

    return (
        <div className='site_container'>
            <div className='flex mt-1.4' style={{ justifyContent: 'space-between' }}>
                <div className="sitereport-dropdown">
                    <select onChange={handleSelectChangeSite1} value={selectedSite1} className="searchsite_dropicon">
                        <option value="Select">State</option>
                        {states.map(state => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                </div>
                <div className="sitereport-dropdown">
                    <select onChange={handleSelectChangeArea} value={selectedArea} className="searchsite_dropicon">
                        <option value="Select">Area</option>
                        {areas.length > 0 ? (
                            areas.map((area, index) => (
                                <option key={index} value={area}>{area}</option>
                            ))
                        ) : (
                            <option value="No Areas" disabled>No Areas Available</option>
                        )}
                    </select>
                </div>
                <div className="sitereport-dropdown">
                    <select onChange={handleSelectChangeSite2} value={selectedSite2} className="searchsite_dropicon">
                        <option value="Select">Site</option>
                        {sites.length > 0 ? (
                            sites.map((site, index) => (
                                <option key={index} value={site.site}>{site.site}</option>
                            ))
                        ) : (
                            <option value="No Sites" disabled>No Sites Available</option>
                        )}
                    </select>
                </div>
            </div>
            
            <div className="tabs">
                <button onClick={() => setCurrentTab('Lubrication')} className={`site-report_tab ${currentTab === 'Lubrication' ? 'active' : ''}`}>Lubrication</button>
                <button onClick={() => setCurrentTab('Oil')} className={`site-report_tab ${currentTab === 'Oil' ? 'active' : ''}`}>Oil</button>
                <button onClick={() => setCurrentTab('PM')} className={`site-report_tab ${currentTab === 'PM' ? 'active' : ''}`}>PM</button>
            </div>

            <div>
                {renderContent()}
                {/* Display the report data if available */}
                {reportData && (
                    <div className="report-section">
                        {/* <h3>Site Report</h3> */}
                        {/* <pre>{JSON.stringify(reportData, null, 2)}</pre> */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Site_Report;
