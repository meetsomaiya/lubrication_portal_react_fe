
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import './Sidebar.css';

// import mainIcon from '../assets/main-grid.png';
// import homeIcon from '../assets/home.png';
// import siteReportIcon from '../assets/Sitereport.png';
// import planningIcon from '../assets/WTG.png';
// import locationIcon from '../assets/location.png';
// import usersIcon from '../assets/user.png';
// import adminIcon from '../assets/admin.png';
// import logoutIcon from '../assets/log-out (2).png';
// import toggleIcon from '../assets/toggle.png'; // Import the toggle button image

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const location = useLocation();
//   const [activeIndex, setActiveIndex] = useState('');

//   useEffect(() => {
//     const path = location.pathname;
//     if (path.includes('Site_Report')) setActiveIndex('Site_Report');
//     else if (path.includes('Functional_Loc')) setActiveIndex('Functional_Loc');
//     else if (path.includes('WTG_Wise_Planning')) setActiveIndex('WTG_Wise_Planning');
//     else if (path.includes('User_Management')) setActiveIndex('User_Management');
//     else if (path.includes('Admin_management')) setActiveIndex('Admin_management');
//     else if (path.includes('Oil_Analysis')) setActiveIndex('Oil_Analysis');
//     else setActiveIndex('Home');
//   }, [location]);

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
//       <ul className="sidebar-menu">
//         <Link to="/Home_user">
//           <li style={{ backgroundColor: '#009F89', border: '1px solid #009F89' }}>
//             <img src={mainIcon} alt="Home" className="icon_S" />
//             {isOpen && <span style={{ color: '#ffffff' }}>Main Application</span>}
//           </li>
//         </Link>
//         <Link to="/Home">
//           <li className={activeIndex === 'Home' ? 'active' : ''}>
//             <img src={homeIcon} alt="Home" className="icon_S" />
//             {isOpen && <span>Home</span>}
//           </li>
//         </Link>
//         <Link to="/Site_Report">
//           <li className={activeIndex === 'Site_Report' ? 'active' : ''}>
//             <img src={siteReportIcon} alt="Site Report" className="icon_S" />
//             {isOpen && <span>Site Report</span>}
//           </li>
//         </Link>
//         <Link to="/WTG_Wise_Planning">
//           <li className={activeIndex === 'WTG_Wise_Planning' ? 'active' : ''}>
//             <img src={planningIcon} alt="WTG-Wise Planning" className="icon_S" />
//             {isOpen && <span>WTG-Wise Planning</span>}
//           </li>
//         </Link>
//         <Link to="/Functional_Loc">
//           <li className={activeIndex === 'Functional_Loc' ? 'active' : ''}>
//             <img src={locationIcon} alt="Functional Location Wise Planning" className="icon_S" />
//             {isOpen && <span>Functional Location Wise Planning</span>}
//           </li>
//         </Link>
//         <Link to="/Oil_Analysis">
//           <li className={activeIndex === 'Oil_Analysis' ? 'active' : ''}>
//             <img src={locationIcon} alt="Oil Analysis" className="icon_S" />
//             {isOpen && <span>Oil Analysis</span>}
//           </li>
//         </Link>
//         <Link to="/User_Management">
//           <li className={activeIndex === 'User_Management' ? 'active' : ''}>
//             <img src={usersIcon} alt="User Management" className="icon_S" />
//             {isOpen && <span>User Management</span>}
//           </li>
//         </Link>
//         <Link to="/Admin_management">
//           <li className={activeIndex === 'Admin_management' ? 'active' : ''}>
//             <img src={adminIcon} alt="Admin Management" className="icon_S" />
//             {isOpen && <span>Admin Management</span>}
//           </li>
//         </Link>

//         {/* Separator and additional cards */}
//         <hr className="separator" />
//         <Link to="/sop-consumption">
//           <li className={activeIndex === 'Consumption_Analysis' ? 'active' : ''}>
//             <img src={siteReportIcon} alt="SOP" className="icon_S" />
//             {isOpen && <span>SOP For Consumption Analysis</span>}
//           </li>
//         </Link>
//         <Link to="/Excel_Upload">
//           <li className={activeIndex === 'Excel_Upload' ? 'active' : ''}>
//             <img src={siteReportIcon} alt="Excel Upload" className="icon_S" />
//             {isOpen && <span>Excel Upload Site Incharge</span>}
//           </li>
//         </Link>
//         <Link to="/Register_Users">
//           <li className={activeIndex === 'Register_Users' ? 'active' : ''}>
//             <img src={usersIcon} alt="Register Users by Excel" className="icon_S" />
//             {isOpen && <span>Register Users</span>}
//           </li>
//         </Link>

//         {/* Logout */}
//         <div className="logout-container">
//           <Link to="/Logout">
//             <li>
//               <img src={logoutIcon} alt="Logout" className="icon_S" />
//               {isOpen && <span>Logout</span>}
//             </li>
//           </Link>
//         </div>
//       </ul>

//       {/* Toggle Button */}
//       <div className="secBtn">
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           <img src={toggleIcon} alt="Toggle" className="toggle-icon" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
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
    const activeRoute = [
      'Site_Report',
      'Functional_Loc',
      'WTG_Wise_Planning',
      'User_Management',
      'Admin_management',
      'Oil_Analysis',
      'sop-consumption',
      'Excel_Upload',
      'Register_Users',
      'Home'
    ].find(route => path.includes(route)) || 'Home';
    setActiveIndex(activeRoute);
  }, [location]);

  const menuItems = [
    { path: '/Home_user', label: 'Main Application', icon: mainIcon, specialStyle: true },
    { path: '/Home', label: 'Home', icon: homeIcon },
    { path: '/Site_Report', label: 'Site Report', icon: siteReportIcon },
    { path: '/WTG_Wise_Planning', label: 'WTG-Wise Planning', icon: planningIcon },
    { path: '/Functional_Loc', label: 'Functional Location Wise Planning', icon: locationIcon },
    { path: '/Oil_Analysis', label: 'Oil Analysis', icon: locationIcon },
    { path: '/User_Management', label: 'User Management', icon: usersIcon },
    { path: '/Admin_management', label: 'Admin Management', icon: adminIcon },
    { path: '/sop-consumption', label: 'SOP For Consumption Analysis', icon: siteReportIcon },
    { path: '/upload-excel', label: 'upload-excel Site Incharge', icon: siteReportIcon },
    { path: '/Register_Users', label: 'Register Users', icon: usersIcon }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <li
              className={
                activeIndex === item.path.split('/')[1] ? 'active' : ''
              }
              style={item.specialStyle ? { backgroundColor: '#009F89', border: '1px solid #009F89' } : {}}
            >
              <img src={item.icon} alt={item.label} className="icon_S" />
              {isOpen && (
                <span style={item.specialStyle ? { color: '#ffffff' } : {}}>
                  {item.label}
                </span>
              )}
            </li>
          </Link>
        ))}

        {/* Logout */}
        <div className="logout-container">
          <Link to="/Logout">
            <li>
              <img src={logoutIcon} alt="Logout" className="icon_S" />
              {isOpen && <span>Logout</span>}
            </li>
          </Link>
        </div>
      </ul>

      {/* Toggle Button */}
      <div className="secBtn">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <img src={toggleIcon} alt="Toggle" className="toggle-icon" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
