import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import mainIcon from '../assets/main-grid.png';

import homeIcon from '../assets/home.png';
import siteReportIcon from '../assets/Sitereport.png';
import planningIcon from '../assets/WTG.png';
import locationIcon from '../assets/location.png';
import usersIcon from '../assets/user.png';
import adminIcon from '../assets/admin.png';
import logoutIcon from '../assets/log-out (2).png';
import toggleIcon from '../assets/toggle.png';

const Sidebar_user = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState('');

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('Site_Report_user')) setActiveIndex('Site_Report_user');
        else if (path.includes('Functional_Loc_user')) setActiveIndex('Functional_Loc_user');
        else if (path.includes('WTG_Wise_Planning_user')) setActiveIndex('WTG_Wise_Planning_user');
        else if (path.includes('User_Management_user')) setActiveIndex('User_Management_user');
        else if (path.includes('Admin_management_user')) setActiveIndex('Admin_management_user');
        else if (path.includes('Oil_Analysis_user')) setActiveIndex('Oil_Analysis_user');
        else if (path.includes('corrective-action-user')) setActiveIndex('corrective-action-user');
        else setActiveIndex('Home');
    }, [location]);

    // Function to retrieve a cookie by name
    const getCookie = (cookieName) => {
        const cookieString = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`));
        return cookieString ? decodeURIComponent(cookieString.split('=')[1]) : null;
    };

    // Retrieve userId and name from cookies
    const userName = getCookie('name') || "Guest";
    const userId = getCookie('userId') || "Unknown User";

    // Logout function
    const handleLogout = async () => {
        try {
            // Set cookies to send to the API
            document.cookie = `userId=${userId}; path=/`;
            document.cookie = `name=${encodeURIComponent(userName)}; path=/`;

            console.log({ userId, name: userName });

            // Call the logout API
            const response = await fetch('http://localhost:224/api/logout_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, name: userName }),
            });

            if (response.ok) {
                console.log('Logout successful');
                navigate('/'); // Redirect to login page
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleMainApplicationClick = () => {
        navigate('/Home');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <ul className="sidebar-menu">
                {/* Main Application */}
                <div 
                    style={{ backgroundColor: '#009F89', border: '1px solid #009F89' }}
                    onClick={handleMainApplicationClick}
                >
                    <li>
                        <img src={mainIcon} alt="Home" className="icon-WTG icon_S" />
                        {isOpen && <span style={{ color: '#ffffff' }}>Main Application</span>}
                    </li>
                </div>

                {/* Other Links */}
                <Link to="/Home_user">
                    <li className={activeIndex === 'Home' ? 'active' : ''}>
                        <img src={homeIcon} alt="Home" className="icon-Home icon_S" />
                        {isOpen && <span>Home</span>}
                    </li>
                </Link>
                <Link to="/Site_Report_user">
                    <li className={activeIndex === 'Site_Report_user' ? 'active' : ''}>
                        <img src={siteReportIcon} alt="Site Report" className="icon-Site icon_S" />
                        {isOpen && <span>Site Report</span>}
                    </li>
                </Link>
                <Link to="/WTG_Wise_Planning_user">
                    <li className={activeIndex === 'WTG_Wise_Planning_user' ? 'active' : ''}>
                        <img src={planningIcon} alt="WTG-Wise Planning" className="icon-WTG icon_S" />
                        {isOpen && <span>WTG-Wise Planning</span>}
                    </li>
                </Link>
                <Link to="/Functional_Loc_user">
                    <li className={activeIndex === 'Functional_Loc_user' ? 'active' : ''}>
                        <img src={locationIcon} alt="Functional Location Wise Planning" className="icon-Fun icon_S" />
                        {isOpen && <span>Functional Location Wise Planning</span>}
                    </li>
                </Link>
                <Link to="/Oil_Analysis_user">
                    <li className={activeIndex === 'Oil_Analysis_user' ? 'active' : ''}>
                        <img src={locationIcon} alt="Oil Analysis" className="icon-Fun icon_S" />
                        {isOpen && <span>Oil Analysis</span>}
                    </li>
                </Link>

                <Link to="/corrective-action-user">
                    <li className={activeIndex === 'corrective-action-user' ? 'active' : ''}>
                        <img src={locationIcon} alt="corrective-action-user" className="icon-Fun icon_S" />
                        {isOpen && <span>Corrective Action</span>}
                    </li>
                </Link>

                {/* Logout */}
                <div className="logout-container" onClick={handleLogout}>
                    <li>
                        <img src={logoutIcon} alt="Logout" className="icon_logout icon_S" />
                        {isOpen && <span>Logout</span>}
                    </li>
                </div>
            </ul>
            <div className="secBtn">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <img src={toggleIcon} alt="Toggle" className="toggle-icon" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar_user;
