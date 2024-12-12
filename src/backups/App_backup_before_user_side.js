import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import WTG_Wise_Planning from './WTG_wise/WTG_Wise_Planning';
import User_Management from './User_Manegement/User_Manegement';
import Admin_manegement from './Admin_manegement/Admin_manegement';
import Site_Report from './Site_Report/Site_Report';
import Functional_Loc from './Funtional_Loc/Functional_Loc';
import Oil from './Site_Report/Oil/Oil';
import PM from './Site_Report/PM/PM';
import Lubrication from './Site_Report/Lubrication/Lubrication_table';
import Home from './Home/Home';
import Navbar from './Navbarr/Navbarr';
import LoginForm from './LoginFrom/LoginFrom';
import './App.css';

/*user side paths */
import Site_Report_user from './USERS/Site_Report/Site_Report_user';
import WTG_Wise_Planning_user from './USERS/WTG_wise/WTG_Wise_Planning_user';
import Functional_Loc_user from './USERS/Funtional_Loc/Functional_Loc_user';
import Home_user from './USERS/Home_user/Home_user';
import Sidebar_user from './USERS/Sidebar_user/Sidebar_user';
import Navbar_user from './USERS/Navbarr_user/Navbarr_user';

import Oil_user from './USERS/Site_Report/Oil/Oil';
import PM_user from './USERS/Site_Report/PM/PM';
import Lubrication_user from './USERS/Site_Report/Lubrication/Lubrication_table';

const MainApp = ({ sidebarOpen, toggleSidebar }) => (
  <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Navbar />
    <div className="d-flex w-full">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/WTG_Wise_Planning" element={<WTG_Wise_Planning />} />
          <Route path="/User_Management" element={<User_Management />} />
          <Route path="/Admin_management" element={<Admin_manegement />} />
          <Route path="/Site_Report" element={<Site_Report />} />
          <Route path="/Functional_Loc" element={<Functional_Loc />} />
          <Route path="/Oil" element={<Oil />} />
          <Route path="/PM" element={<PM />} />
          <Route path="/Lubrication" element={<Lubrication />} />

          
          user side
          <Route path="/Site_Report_user" element={<Site_Report_user />} />
          <Route path="/WTG_Wise_Planning_user" element={<WTG_Wise_Planning_user />} />
          <Route path="/Functional_Loc_user" element={<Functional_Loc_user />} />
          <Route path="/Home_user" element={<Home_user />} />
          <Route path="/Oil_user" element={<Oil_user />} />
          <Route path="/PM_user" element={<PM_user />} />
          <Route path="/Lubrication_user" element={<Lubrication_user />} />
        </Routes>
      </main>
    </div>
  </div>
);

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/*" element={<MainApp sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />} />
      </Routes>
    </Router>
  );
};

export default App;
