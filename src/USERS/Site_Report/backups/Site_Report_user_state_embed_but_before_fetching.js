import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Lubrication from './Lubrication/Lubrication_table_user';
import Oil from './Oil/Oil_user';
import PM from './PM/PM_user';
import './Site_Report.css';

function Site_Report_user() {
    const [selectedArea, setSelectedArea] = useState('Select');
    const [selectedSite1, setSelectedSite1] = useState('Select');
    const [selectedSite2, setSelectedSite2] = useState('Select');
    const [currentTab, setCurrentTab] = useState('Lubrication');

    const [userAccessDetails, setUserAccessDetails] = useState(null); // Step 2: Initialize state

    const [areas, setAreas] = useState([]);
    const [states, setStates] = useState([]);
    const [sites, setSites] = useState([]);

    const handleSelectChangeArea = (event) => {
        setSelectedArea(event.target.value);
    };

    const handleSelectChangeSite1 = (event) => {
        setSelectedSite1(event.target.value);
    };

    const handleSelectChangeSite2 = (event) => {
        setSelectedSite2(event.target.value);
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


    const renderContent = () => {
        switch (currentTab) {
            case 'Lubrication':
                return <Lubrication />;
            case 'Oil':
                return <Oil />;
            case 'PM':
                return <PM />;
            default:
                return <Lubrication />;
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
            <div >
                {renderContent()}
            </div>
        </div>
    );
}

export default Site_Report_user;
