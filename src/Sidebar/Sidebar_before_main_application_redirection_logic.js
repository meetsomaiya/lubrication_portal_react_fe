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

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('Site_Report')) setActiveIndex('Site_Report');
    else if (path.includes('Functional_Loc')) setActiveIndex('Functional_Loc');
    else if (path.includes('WTG_Wise_Planning')) setActiveIndex('WTG_Wise_Planning');
    else if (path.includes('User_Management')) setActiveIndex('User_Management');
    else if (path.includes('Admin_management')) setActiveIndex('Admin_management');
    else if (path.includes('Oil_Analysis')) setActiveIndex('Oil_Analysis');
    else setActiveIndex('Home');
  }, [location]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">

      <Link to="/Home_user">
        <div style={{backgroundColor:'#009F89', border:'1px bold #009F89'}}>
          <li>
            <img src={mainIcon} alt="Home" className="icon-WTG icon_S" />
            {isOpen && <span style={{color:'#ffffff'}}>Main Application</span>}
          </li>
          </div>
        </Link>
        <Link to="/Home">
          <li className={activeIndex === 'Home' ? 'active' : ''} >
            <img src={homeIcon} alt="Home" className="icon-Home icon_S" />
            {isOpen && <span>Home</span>}
          </li>
        </Link>
        <Link to="/Site_Report">
          <li className={activeIndex === 'Site_Report' ? 'active' : ''}>
            <img src={siteReportIcon} alt="Site Report" className="icon-Site icon_S" />
            {isOpen && <span>Site Report</span>}
          </li>
        </Link>
        <Link to="/WTG_Wise_Planning">
          <li className={activeIndex === 'WTG_Wise_Planning' ? 'active' : ''}>
            <img src={planningIcon} alt="WTG-Wise Planning" className="icon-WTG icon_S" />
            {isOpen && <span>WTG-Wise Planning</span>}
          </li>
        </Link>
        <Link to="/Functional_Loc">
          <li className={activeIndex === 'Functional_Loc' ? 'active' : ''}>
            <img src={locationIcon} alt="Functional Location Wise Planning" className="icon-Fun icon_S" />
            {isOpen && <span>Functional Location Wise Planning</span>}
          </li>
        </Link>
        <Link to="/Oil_Analysis">
          <li className={activeIndex === 'Oil_Analysis' ? 'active' : ''}>
            <img src={locationIcon} alt="Oil_Analysis" className="icon-Fun icon_S" />
            {isOpen && <span>Oil Analysis</span>}
          </li>
        </Link>
        <Link to="/User_Management">
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
        </Link>
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

export default Sidebar;
