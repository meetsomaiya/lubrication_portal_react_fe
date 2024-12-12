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
    const [areas, setAreas] = useState([]); // State to hold fetched areas
    const [sites, setSites] = useState([]); // State to hold fetched sites

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
        const selectedArea = event.target.value;
        setSelectedArea(selectedArea);
        fetchSites(selectedSite1, selectedArea); // Fetch sites when area is selected
    };

    const handleSelectChangeSite1 = async (event) => {
        const selectedState = event.target.value;
        setSelectedSite1(selectedState);
        setSelectedArea('Select'); // Reset the area selection when the state changes

        // Send the selected state to the get_areas API
        if (selectedState !== "Select") {
            try {
                const response = await fetch(`http://localhost:224/api/get_areas?state=${selectedState}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch areas');
                }
                const areasData = await response.json();
                console.log('Fetched areas:', areasData);

                // Extract the area values from the response
                const areasList = areasData.map(item => item.area); // Get the area names

                setAreas(areasList); // Set the areas data as an array of area names
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        } else {
            setAreas([]); // Clear areas if "Select" is chosen
        }
    };

    const fetchSites = async (state, area) => {
        if (state !== "Select" && area !== "Select") {
            try {
                const response = await fetch(`http://localhost:224/api/get_sites?state=${state}&area=${area}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sites');
                }
                const sitesData = await response.json();
                console.log('Fetched sites:', sitesData);
                
                // Assuming sitesData is an array of site objects
                setSites(sitesData); // Set the sites data
            } catch (error) {
                console.error('Error fetching sites:', error);
            }
        } else {
            setSites([]); // Clear sites if either selection is not valid
        }
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
                        {areas.length > 0 ? (
                            areas.map((area, index) => (  // Correctly map areas
                                <option key={index} value={area}>{area}</option>
                            ))
                        ) : (
                            <option value="No Areas" disabled>No Areas Available</option> // Placeholder if no areas are fetched
                        )}
                    </select>
                </div>
                <div className="sitereport-dropdown">
                    <select onChange={handleSelectChangeSite2} value={selectedSite2} className="searchsite_dropicon">
                        <option value="Select">Site</option>
                        {sites.length > 0 ? (
                            sites.map((site, index) => (  // Correctly map sites
                                <option key={index} value={site.site}>{site.site}</option> // Use site.site based on your response
                            ))
                        ) : (
                            <option value="No Sites" disabled>No Sites Available</option> // Placeholder if no sites are fetched
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
            </div>
        </div>
    );
}

export default Site_Report;
