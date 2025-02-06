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
import toggleIcon from '../assets/toggle.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

import { BASE_URL } from '../config';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate hook to programmatically navigate

  // Helper function to get cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Function to handle API call on link click
  const handleToggleAdmin = async () => {
    const adminId = getCookie('adminId'); // Retrieve adminId from cookies
    const name = getCookie('name'); // Retrieve name from cookies
    const email = getCookie('adminEmail'); // Retrieve email from cookies

    if (adminId && name && email) {
      console.log('Sending adminId, name, and email:', adminId, name, email);
      try {
        const response = await fetch(`${BASE_URL}/api/toggle_admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adminId, name, email }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);

          // Set cookies with respective values
          const { domainId, access, area, email, name, sessionId, site, state } = result;

          document.cookie = `domain_id=${domainId};path=/`;
          document.cookie = `access=${access};path=/`;
          document.cookie = `area=${area};path=/`;
          document.cookie = `email=${email};path=/`;
          document.cookie = `name=${name};path=/`;
          document.cookie = `userId=${sessionId};path=/`;
          document.cookie = `site=${site};path=/`;
          document.cookie = `state=${state};path=/`;

          console.log('Cookies set successfully!');

          // Navigate to Oil_Analysis page
          navigate('/Oil_Analysis_user');
         // navigate('/Home_user');
        } else {
          console.error('Failed to toggle admin:', response.status);
        }
      } catch (error) {
        console.error('Error during API call:', error);
      }
    } else {
      console.error('adminId, name, or email not found in cookies.');
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('Site_Report')) setActiveIndex('Site_Report');
    else if (path.includes('Functional_Loc')) setActiveIndex('Functional_Loc');
    else if (path.includes('WTG_Wise_Planning')) setActiveIndex('WTG_Wise_Planning');
    else if (path.includes('User_Management')) setActiveIndex('User_Management');
    else if (path.includes('Admin_management')) setActiveIndex('Admin_management');
    else if (path.includes('Oil_Analysis')) setActiveIndex('Oil_Analysis');
    else if (path.includes('corrective-action')) setActiveIndex('corrective-action');
    else if (path.includes('sop-consumption')) setActiveIndex('sop-consumption');
    else if (path.includes('upload-excel')) setActiveIndex('upload-excel');
    else if (path.includes('register-users')) setActiveIndex('register-users');
    else setActiveIndex('Home');
  }, [location]);

  // Function to handle link clicks
  const handleLinkClick = () => {
    if (toggleSidebar) toggleSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">
        <Link onClick={() => { handleToggleAdmin(); handleLinkClick(); }}>
          <div style={{ backgroundColor: '#009F89', border: '1px bold #009F89' }}>
            <li>
              <img src={mainIcon} alt="Home" className="icon-WTG icon_S" />
              {isOpen && <span style={{ color: '#ffffff' }}>Main Application</span>}
            </li>
          </div>
        </Link>
        {/* <Link to="/Home" onClick={handleLinkClick}>
          <li className={activeIndex === 'Home' ? 'active' : ''}>
            <img src={homeIcon} alt="Home" className="icon-Home icon_S" />
            {isOpen && <span>Home</span>}
          </li>
        </Link> */}
        <Link to="/Site_Report" onClick={handleLinkClick}>
          <li className={activeIndex === 'Site_Report' ? 'active' : ''}>
            <img src={siteReportIcon} alt="Site Report" className="icon-Site icon_S" />
            {isOpen && <span>Site Report</span>}
          </li>
        </Link>
        <Link to="/WTG_Wise_Planning" onClick={handleLinkClick}>
          <li className={activeIndex === 'WTG_Wise_Planning' ? 'active' : ''}>
            <img src={planningIcon} alt="WTG-Wise Planning" className="icon-WTG icon_S" />
            {isOpen && <span>WTG-Wise Planning</span>}
          </li>
        </Link>
        <Link to="/Functional_Loc" onClick={handleLinkClick}>
          <li className={activeIndex === 'Functional_Loc' ? 'active' : ''}>
            <img src={locationIcon} alt="Functional Location Wise Planning" className="icon-Fun icon_S" />
            {isOpen && <span>Functional Location Wise Planning</span>}
          </li>
        </Link>
        <Link to="/Oil_Analysis" onClick={handleLinkClick}>
          <li className={activeIndex === 'Oil_Analysis' ? 'active' : ''}>
            <img src={locationIcon} alt="Oil_Analysis" className="icon-Fun icon_S" />
            {isOpen && <span>Oil Analysis</span>}
          </li>
        </Link>
        <Link to="/corrective-action" onClick={handleLinkClick}>
          <li className={activeIndex === 'corrective-action' ? 'active' : ''}>
            <img src={locationIcon} alt="corrective-action" className="icon-Fun icon_S" />
            {/* {isOpen && <span>Corrective Action</span>} */}
            {isOpen && <span>Site Corrective Action</span>}
          </li>
        </Link>
        <Link to="/sop-consumption" onClick={handleLinkClick}>
          <li className={activeIndex === 'sop-consumption' ? 'active' : ''}>
            <img src={locationIcon} alt="sop-consumption" className="icon-Fun icon_S" />
            {isOpen && <span>SOP Consumption</span>}
          </li>
        </Link>
        <Link to="/User_Management" onClick={handleLinkClick}>
          <li className={activeIndex === 'User_Management' ? 'active' : ''}>
            <img src={usersIcon} alt="User Management" className="icon-user icon_S" />
            {isOpen && <span>User Management</span>}
          </li>
        </Link>
        <Link to="/Admin_management" onClick={handleLinkClick}>
          <li className={activeIndex === 'Admin_management' ? 'active' : ''}>
            <img src={adminIcon} alt="Admin Management" className="icon-admin icon_S" />
            {isOpen && <span>Admin Management</span>}
          </li>
        </Link>
        <Link to="/upload-excel" onClick={handleLinkClick}>
          <li className={activeIndex === 'upload-excel' ? 'active' : ''}>
            <img src={adminIcon} alt="upload-excel" className="icon-admin icon_S" />
            {isOpen && <span>Upload Excel</span>}
          </li>
        </Link>
        <Link to="/register-users" onClick={handleLinkClick}>
          <li className={activeIndex === 'register-users' ? 'active' : ''}>
            <img src={adminIcon} alt="register-users" className="icon-admin icon_S" />
            {isOpen && <span>Register Users via Upload Excel</span>}
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
