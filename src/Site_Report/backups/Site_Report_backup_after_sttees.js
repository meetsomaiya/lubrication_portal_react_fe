import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Lubrication from './Lubrication/Lubrication_table';
import Oil from './Oil/Oil';
import PM from './PM/PM';
import './Site_Report.css';

function Site_Report() {
    const [selectedArea, setSelectedArea] = useState('Select');
    const [selectedSite1, setSelectedSite1] = useState('Select');
    const [selectedSite2, setSelectedSite2] = useState('Select');
    const [currentTab, setCurrentTab] = useState('Lubrication');
    const [states, setStates] = useState([]); // State to hold fetched states

    // Fetch states from the API on component mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch('http://localhost:224/api/get_states'); // Adjust the path if necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStates(data); // Set the states data
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        fetchStates();
    }, []); // Empty dependency array ensures this runs once on mount

    const handleSelectChangeArea = (event) => {
        setSelectedArea(event.target.value);
    };

    const handleSelectChangeSite1 = (event) => {
        setSelectedSite1(event.target.value);
    };

    const handleSelectChangeSite2 = (event) => {
        setSelectedSite2(event.target.value);
    };

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
                        {states.map(state => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                </div>
                <div className="sitereport-dropdown">
                    <select onChange={handleSelectChangeArea} value={selectedArea} className="searchsite_dropicon">
                        <option value="Select">Area</option>
                        <option value="12345">12345</option>
                        <option value="23456">23456</option>
                        <option value="34567">34567</option>
                    </select>
                </div>
                <div className="sitereport-dropdown">
                    <select onChange={handleSelectChangeSite2} value={selectedSite2} className="searchsite_dropicon">
                        <option value="Select">Site</option>
                        <option value="12345">12345</option>
                        <option value="23456">23456</option>
                        <option value="34567">34567</option>
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
            </div>
        </div>
    );
}

export default Site_Report;
