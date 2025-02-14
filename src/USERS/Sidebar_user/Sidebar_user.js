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

import { BASE_URL } from '../../config'

const Sidebar_user = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState('');
    const [adminIdFound, setAdminIdFound] = useState(false); // Track if adminId cookie is found

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('Site_Report_user')) setActiveIndex('Site_Report_user');
        else if (path.includes('Functional_Loc_user')) setActiveIndex('Functional_Loc_user');
        else if (path.includes('WTG_Wise_Planning_user')) setActiveIndex('WTG_Wise_Planning_user');
        else if (path.includes('User_Management_user')) setActiveIndex('User_Management_user');
        else if (path.includes('Admin_management_user')) setActiveIndex('Admin_management_user');
        else if (path.includes('Oil_Analysis_user')) setActiveIndex('Oil_Analysis_user');
        else if (path.includes('corrective-action-user')) setActiveIndex('corrective-action-user');
        else if (path.includes('sop-consumption-user')) setActiveIndex('sop-consumption-user');
        else setActiveIndex('Home');
    }, [location]);

    // Function to log and set the adminId cookie state
    const logAdminIdCookie = () => {
        const adminId = getCookie('adminId');
        if (adminId) {
            console.log(`Admin ID found on sidebaruser: ${adminId}`);
            setAdminIdFound(true);  // Set state to true if adminId is found
        } else {
            console.log('Admin ID cookie not found.');
            setAdminIdFound(false); // Set state to false if adminId is not found
        }
    };

    // UseEffect to log the cookie value on component load
    useEffect(() => {
        logAdminIdCookie();
    }, []); // Empty dependency array to run only once on component mount

    // Function to retrieve a cookie by name
    const getCookie = (cookieName) => {
        const cookieString = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`));
        return cookieString ? decodeURIComponent(cookieString.split('=')[1]) : null;
    };

      // Retrieve isadmin value from cookies
  const isAdmin = getCookie('isadmin') === 'true';

    // Retrieve userId and name from cookies
    const userName = getCookie('name') || "Guest";
    const userId = getCookie('userId') || "Unknown User";

    // Logout function
    const handleLogout = async () => {
        try {
            // List of cookies to clear
            const cookiesToClear = [
                'name',
                'adminId',
                'access',
                'adminEmail',
                'userId',
                'domain_id',
                'state',
                'area',
                'site',
                'email'
            ];

            // Expire each cookie
            cookiesToClear.forEach(cookieName => {
                document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            });

            console.log('Specified cookies have been cleared.');

            // Call the logout API
            // const response = await fetch('http://localhost:224/api/logout_user', {
                const response = await fetch(`${BASE_URL}/api/logout_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, name: userName }),
            });

            if (response.ok) {
                console.log('Logout successful');
               // navigate('/'); // Redirect to login page

               //window.location.href = 'https://suzomsuatapps.suzlon.com/LubricationPortal/index.html#/'; // Redirect to login page
             //  window.location.href = 'https://suzomsuatapps.suzlon.com/apps/fleetmanager_fe/index.html#/signin'; // Redirect to login page
             window.location.href = 'https://suzoms.suzlon.com/FleetM/#/signin'; // Redirect to the home page or default route        
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // const handleMainApplicationClick = () => {
    //     toggleSidebar(); // Close sidebar when clicked
    //     navigate('/Home');
    // };

    // const handleMainApplicationClick = () => {
    //     toggleSidebar(); // Close sidebar when clicked
    
    //     // Retrieve cookies
    //     const name = getCookie('name');
    //     const domainId = getCookie('domain_id');
    
    //     // Prepare data to send
    //     const requestData = {
    //         name,
    //         domainId
    //     };
    
    //     // Log the data being sent
    //     console.log('Sending data to fleet manager login api:', requestData);
    
    //     // Send data to API (example using fetch)
    //     fetch('http://localhost:224/api/fleet_manager_login', {  // Corrected URL format
    //   // fetch('http://localhost:3001/api/fleet_manager_login', {  // Corrected URL format
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(requestData)
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('Success:', data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    
    //    // navigate('/Home');
    // };

    const handleMainApplicationClick = () => {
        toggleSidebar(); // Close sidebar when clicked
    
        // Retrieve cookies
        const name = getCookie('name');
        const domainId = getCookie('domain_id');
    
        // Prepare data to send
        const requestData = {
            name,
            domainId
        };
    
        // Log the data being sent
        console.log('Sending data to fleet manager login API:', requestData);
    
        // Send data to API
        fetch(`${BASE_URL}/api/fleet_manager_login`, {  // Ensure the correct API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
    
            if (data.success) {
                // Set cookies with the correct values
                document.cookie = `name=${encodeURIComponent(data.data.name)}; path=/`;
                document.cookie = `adminId=${encodeURIComponent(data.data.sessionId)}; path=/`;
                document.cookie = `access=${encodeURIComponent(data.data.access)}; path=/`;
                document.cookie = `adminEmail=${encodeURIComponent(data.data.email)}; path=/`;
                document.cookie = `domain_id=${encodeURIComponent(data.data.domainId)}; path=/`;
    
                // Wait for 2 seconds before redirecting
                setTimeout(() => {
                    navigate('/Oil_Analysis');
                }, 1000);
            } else {
                console.error('API response error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    
    
    
    

    const handleLinkClick = () => {
        toggleSidebar(); // Close sidebar automatically on any link click
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <ul className="sidebar-menu">
                {/* Conditionally render Main Application button */}
                {(adminIdFound || isAdmin) && (
    <div
        style={{ backgroundColor: '#009F89', border: '1px solid #009F89' }}
        onClick={handleMainApplicationClick}
    >
        <li>
            <img src={mainIcon} alt="Home" className="icon-WTG icon_S" />
            {isOpen && <span style={{ color: '#ffffff' }}>Main Application</span>}
        </li>
    </div>
)}

                {/* Other Links */}
                {/* <Link to="/Home_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'Home' ? 'active' : ''}>
                        <img src={homeIcon} alt="Home" className="icon-Home icon_S" />
                        {isOpen && <span>Home</span>}
                    </li>
                </Link> */}
                <Link to="/Site_Report_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'Site_Report_user' ? 'active' : ''}>
                        <img src={siteReportIcon} alt="Site Report" className="icon-Site icon_S" />
                        {isOpen && <span>Site Report</span>}
                    </li>
                </Link>
                <Link to="/WTG_Wise_Planning_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'WTG_Wise_Planning_user' ? 'active' : ''}>
                        <img src={planningIcon} alt="WTG-Wise Planning" className="icon-WTG icon_S" />
                        {isOpen && <span>WTG-Wise Planning</span>}
                    </li>
                </Link>
                <Link to="/Functional_Loc_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'Functional_Loc_user' ? 'active' : ''}>
                        <img src={locationIcon} alt="Functional Location Wise Planning" className="icon-Fun icon_S" />
                        {isOpen && <span>Functional Location Wise Planning</span>}
                    </li>
                </Link>
                <Link to="/Oil_Analysis_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'Oil_Analysis_user' ? 'active' : ''}>
                        <img src={locationIcon} alt="Oil Analysis" className="icon-Fun icon_S" />
                        {isOpen && <span>Oil Analysis</span>}
                    </li>
                </Link>

                {/* <Link to="/corrective-action-user" onClick={handleLinkClick}> */}
                <Link to="/corrective-action_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'corrective-action-user' ? 'active' : ''}>
                        <img src={locationIcon} alt="corrective-action-user" className="icon-Fun icon_S" />
                        {/* {isOpen && <span>Corrective Action</span>} */}
                        {isOpen && <span>Site Corrective Action</span>}
                    </li>
                </Link>

                {/* <Link to="/sop-consumption-user" onClick={handleLinkClick}> */}
                <Link to="/sop-consumption_user" onClick={handleLinkClick}>
                    <li className={activeIndex === 'sop-consumption-user' ? 'active' : ''}>
                        <img src={locationIcon} alt="sop-consumption-user" className="icon-Fun icon_S" />
                        {isOpen && <span>SOP Consumption</span>}
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
