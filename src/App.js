import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Sidebar_user from './USERS/Sidebar_user/Sidebar_user';
import Navbar from './Navbarr/Navbarr';
import Navbar_user from './USERS/Navbarr_user/Navbarr_user';
import LoginForm from './LoginFrom/LoginFrom';
import './App.css';
 
// Admin Components
import Home from './Home/Home';
import WTG_Wise_Planning from './WTG_wise/WTG_Wise_Planning';
import User_Management from './User_Manegement/User_Manegement';
import Admin_management from './Admin_manegement/Admin_manegement';
import Site_Report from './Site_Report/Site_Report';
import Functional_Loc from './Funtional_Loc/Functional_Loc';
import Oil from './Site_Report/Oil/Oil';
import PM from './Site_Report/PM/PM';
import Lubrication from './Site_Report/Lubrication/Lubrication_table';
 
import OilAnalysisTable from './Oil_Analysis/Oil_Analysis';

import UploadExcel from './Excel_Upload_Site_Incharge/ExcelUpload';
import RegisterUser from './Register_User/RegiterUser8867';
import SopConsumptionAnalysis8867 from './SOP_CONSUMPTION_ANALYSIS/SOP_CONSUMPTION_ANALYSIS';

import TableComponent9976 from './Corrective_Action/TableComponent9976';


// User Components
import Site_Report_user from './USERS/Site_Report/Site_Report_user';
import WTG_Wise_Planning_user from './USERS/WTG_wise/WTG_Wise_Planning_user';
import Functional_Loc_user from './USERS/Funtional_Loc/Functional_Loc_user';
import Home_user from './USERS/Home_user/Home_user';
import Oil_user from './USERS/Site_Report/Oil/Oil_user';
import PM_user from './USERS/Site_Report/PM/PM_user';
import Lubrication_user from './USERS/Site_Report/Lubrication/Lubrication_table_user';
import OilAnalysisTableUser from './USERS/Oil_Analysis_user/Oil_Analysis_user';


 
const MainApp = ({ sidebarOpen, toggleSidebar }) => {
  // Check if the current route is a user route by looking for `_user` at the end
  const isUserRoute = window.location.pathname.endsWith('_user');
 
  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Render Navbar based on Admin or User */}
      {isUserRoute ? <Navbar_user /> : <Navbar />}
     
      <div className="d-flex w-full">
        {/* Render Sidebar based on Admin or User */}
        {isUserRoute ? (
          <Sidebar_user isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        ) : (
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        )}
       
        <main className="main-content">
          <Routes>
            {/* Admin Routes */}
            <Route path="/Home" element={<Home />} />
            <Route path="/WTG_Wise_Planning" element={<WTG_Wise_Planning />} />
            <Route path="/User_Management" element={<User_Management />} />
            <Route path="/Admin_management" element={<Admin_management />} />
            <Route path="/Site_Report" element={<Site_Report />} />
            <Route path="/Functional_Loc" element={<Functional_Loc />} />
            <Route path="/Oil" element={<Oil />} />
            <Route path="/PM" element={<PM />} />
            <Route path="/Lubrication" element={<Lubrication />} />
            <Route path="/Oil_Analysis" element={<OilAnalysisTable />} />

            <Route path="/upload-excel" element={<UploadExcel />} />
            <Route path="/Register_Users" element={<RegisterUser />} />
            <Route path="/Corrective_Action" element={<TableComponent9976 />} />
 
            {/* User Routes */}
            <Route path="/Home_user" element={<Home_user />} />
            <Route path="/WTG_Wise_Planning_user" element={<WTG_Wise_Planning_user />} />
            <Route path="/Site_Report_user" element={<Site_Report_user />} />
            <Route path="/Functional_Loc_user" element={<Functional_Loc_user />} />
            <Route path="/Oil_user" element={<Oil_user />} />
            <Route path="/PM_user" element={<PM_user />} />
            <Route path="/Lubrication_user" element={<Lubrication_user />} />
            <Route path="/Oil_Analysis_user" element={<OilAnalysisTableUser />} />
            <Route path="/sop-consumption" element={<SopConsumptionAnalysis8867 />} />

          </Routes>
        </main>
      </div>
    </div>
  );
};
 
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
 