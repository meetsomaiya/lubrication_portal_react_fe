import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Lubrication from './Lubrication/Lubrication_table_user';
import Oil from './Oil/Oil_user';
import PM from './PM/PM_user';
import './Site_Report.css';

import { BASE_URL } from '../../config'

function Site_Report_user() {
    const [selectedArea, setSelectedArea] = useState('Select');
    const [selectedSite1, setSelectedSite1] = useState('Select');
    const [selectedSite2, setSelectedSite2] = useState('Select');
    const [currentTab, setCurrentTab] = useState('Lubrication');

    const [userAccessDetails, setUserAccessDetails] = useState(null); // Step 2: Initialize state

    const [areas, setAreas] = useState([]);
    const [states, setStates] = useState([]);
    const [sites, setSites] = useState([]);

    const [reportData, setReportData] = useState(null); // State for fetched report data

    // const handleSelectChangeArea = (event) => {
    //     setSelectedArea(event.target.value);
    // };

    
    const handleSelectChangeArea = (event) => {
        const selectedArea = event.target.value;
        setSelectedArea(selectedArea);
        generateReport(selectedSite1, selectedArea, selectedSite2); // Call generateReport with the current selections
    };

    // const handleSelectChangeSite1 = (event) => {
    //     setSelectedSite1(event.target.value);
    // };

        const handleSelectChangeSite1 = (event) => {
            const selectedState = event.target.value;
            setSelectedSite1(selectedState);
            setSelectedArea('Select');
            generateReport(selectedState, selectedArea, selectedSite2);
    };

    

    // const handleSelectChangeSite2 = (event) => {
    //     setSelectedSite2(event.target.value);
    // };

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

    useEffect(() => {
        // Function to get cookie by name
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        // Retrieve and parse cookies
        const areaCookie = getCookie('area');
        const stateCookie = getCookie('state');
        const siteCookie = getCookie('site');

        // Split cookie values by comma
        setAreas(areaCookie ? areaCookie.split(',') : []);
        setStates(stateCookie ? stateCookie.split(',') : []);
        setSites(siteCookie ? siteCookie.split(',') : []);
    }, []);


    // const renderContent = () => {
    //     switch (currentTab) {
    //         case 'Lubrication':
    //             return <Lubrication />;
    //         case 'Oil':
    //             return <Oil />;
    //         case 'PM':
    //             return <PM />;
    //         default:
    //             return <Lubrication />;
    //     }
    // };

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
                    {states.map((state, index) => (
                        <option key={index} value={state.trim()}>{state.trim()}</option>
                    ))}
                </select>
            </div>

            <div className="sitereport-dropdown">
                <select onChange={handleSelectChangeArea} value={selectedArea} className="searchsite_dropicon">
                    <option value="Select">Area</option>
                    {areas.map((area, index) => (
                        <option key={index} value={area.trim()}>{area.trim()}</option>
                    ))}
                </select>
            </div>

            <div className="sitereport-dropdown">
                <select onChange={handleSelectChangeSite2} value={selectedSite2} className="searchsite_dropicon">
                    <option value="Select">Site</option>
                    {sites.map((site, index) => (
                        <option key={index} value={site.trim()}>{site.trim()}</option>
                    ))}
                </select>
            </div>
        </div>
            
            <div className="tabs">
                <button onClick={() => setCurrentTab('Lubrication')} className={`site-report_tab ${currentTab === 'Lubrication' ? 'active' : ''}`}>Lubrication</button>
                <button onClick={() => setCurrentTab('Oil')} className={`site-report_tab ${currentTab === 'Oil' ? 'active' : ''}`}>Oil</button>
                <button onClick={() => setCurrentTab('PM')} className={`site-report_tab ${currentTab === 'PM' ? 'active' : ''}`}>PM</button>
            </div>
            {/* <div >
                {renderContent()}
            </div> */}

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

export default Site_Report_user;
