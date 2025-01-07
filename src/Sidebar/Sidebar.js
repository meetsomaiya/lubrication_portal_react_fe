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
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

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
        const response = await fetch('http://localhost:224/api/toggle_admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adminId, name, email }), // Include name and email in the request
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);
  
          // Now set cookies using the document.cookie method
          const { domainId, access, area, email, name, sessionId, site, state } = result;
  
          // Set cookies with respective values
          document.cookie = `domain_id=${domainId};path=/`;
          document.cookie = `access=${access};path=/`;
          document.cookie = `area=${area};path=/`;
          document.cookie = `email=${email};path=/`;
          document.cookie = `name=${name};path=/`;
          document.cookie = `userId=${sessionId};path=/`;
          document.cookie = `site=${site};path=/`;
          document.cookie = `state=${state};path=/`;
  
          // You can also add an optional message cookie if needed
          document.cookie = `message=Session ID and name updated successfully;path=/`;
  
          console.log('Cookies set successfully!');

          // Navigate to Home_user page using useNavigate
          navigate('/Home_user');  // This will navigate to Home_user without reloading the page
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
    else setActiveIndex('Home');
  }, [location]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">
        {/* <Link to="/Home_user" onClick={handleToggleAdmin}> */}
        <Link onClick={handleToggleAdmin}>
          <div style={{ backgroundColor: '#009F89', border: '1px bold #009F89' }}>
            <li>
              <img src={mainIcon} alt="Home" className="icon-WTG icon_S" />
              {isOpen && <span style={{ color: '#ffffff' }}>Main Application</span>}
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
        <Link to="/corrective-action">
          <li className={activeIndex === 'corrective-action' ? 'active' : ''}>
            <img src={locationIcon} alt="corrective-action" className="icon-Fun icon_S" />
            {isOpen && <span>Corrective Action</span>}
          </li>
        </Link>
        <Link to="/sop-consumption">
          <li className={activeIndex === 'sop-consumption' ? 'active' : ''}>
            <img src={locationIcon} alt="sop-consumption" className="icon-Fun icon_S" />
            {isOpen && <span>SOP consumption</span>}
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
        <Link to="/upload-excel">
          <li className={activeIndex === 'upload-excel' ? 'active' : ''}>
            <img src={adminIcon} alt="upload-excel" className="icon-admin icon_S" />
            {isOpen && <span>Upload Excel</span>}
          </li>
        </Link>
        <Link to="/register-users">
          <li className={activeIndex === 'upload-excel' ? 'active' : ''}>
            <img src={adminIcon} alt="register-users" className="icon-admin icon_S" />
            {isOpen && <span>Register Users via uplaod excel</span>}
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
