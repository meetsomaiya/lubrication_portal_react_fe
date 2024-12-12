import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import mainIcon from '../assets/main-grid.png';

import homeIcon from '../assets/home.png';
import siteReportIcon from '../assets/Sitereport.png';
import planningIcon from '../assets/WTG.png';
import locationIcon from '../assets/location.png';
import usersIcon from '../assets/user.png';
import adminIcon from '../assets/admin.png';
import logoutIcon from '../assets/log-out (2).png';
import toggleIcon from '../assets/toggle.png'; // Import the toggle button image

const Sidebar_user = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('Site_Report_user')) setActiveIndex('Site_Report_user');
    else if (path.includes('Functional_Loc_user')) setActiveIndex('Functional_Loc_user');
    else if (path.includes('WTG_Wise_Planning_user')) setActiveIndex('WTG_Wise_Planning_user');
    else if (path.includes('User_Management_user')) setActiveIndex('User_Management_user');
    else if (path.includes('Admin_management_user')) setActiveIndex('Admin_management_user');
    else if (path.includes('Oil_Analysis_user')) setActiveIndex('Oil_Analysis_user');
    else setActiveIndex('Home');
  }, [location]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">

      <Link to="/Home">
        <div style={{backgroundColor:'#009F89', border:'1px bold #009F89'}}>
          <li>
            <img src={mainIcon} alt="Home" className="icon-WTG icon_S" />
            {isOpen && <span style={{color:'#ffffff'}}>Main Application</span>}
          </li>
          </div>
        </Link>
        <Link to="/Home_user">
          <li className={activeIndex === 'Home' ? 'active' : ''} >
            <img src={homeIcon} alt="Home" className="icon-Home icon_S" />
            {isOpen && <span>Home</span>}
          </li>
        </Link>
        <Link to="/Site_Report_user">
          <li className={activeIndex === 'Site_Report' ? 'active' : ''}>
            <img src={siteReportIcon} alt="Site Report" className="icon-Site icon_S" />
            {isOpen && <span>Site Report</span>}
          </li>
        </Link>
        <Link to="/WTG_Wise_Planning_user">
          <li className={activeIndex === 'WTG_Wise_Planning' ? 'active' : ''}>
            <img src={planningIcon} alt="WTG-Wise Planning" className="icon-WTG icon_S" />
            {isOpen && <span>WTG-Wise Planning</span>}
          </li>
        </Link>
        <Link to="/Functional_Loc_user">
          <li className={activeIndex === 'Functional_Loc' ? 'active' : ''}>
            <img src={locationIcon} alt="Functional Location Wise Planning" className="icon-Fun icon_S" />
            {isOpen && <span>Functional Location Wise Planning</span>}
          </li>
        </Link>
        <Link to="/Oil_Analysis_user">
          <li className={activeIndex === 'Functional_Loc' ? 'active' : ''}>
            <img src={locationIcon} alt="Functional Location Wise Planning" className="icon-Fun icon_S" />
            {isOpen && <span>Oil Analysis</span>}
          </li>
        </Link>
        {/* <Link to="/User_Management">
          <li className={activeIndex === 'User_Management' ? 'active' : ''}>
            <img src={usersIcon} alt="User Management" className="icon-user icon_S" />
            {isOpen && <span>User Management</span>}
          </li>
        </Link>
        <Link to="/Admin_management">
          <li className={activeIndex === 'Admin_management' ? 'active' : ''}>
            <img src={adminIcon} alt="Admin Management" className="icon-admin icon_S" />
            {isOpen && <span>Admin Management</span>}
          </li>
        </Link> */}
        <div className="logout-container">
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
