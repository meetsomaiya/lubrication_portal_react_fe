

// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // For Excel processing
// import Sidebar from './Sidebar/Sidebar';
// import Sidebar_user from './USERS/Sidebar_user/Sidebar_user';
// import Navbar from './Navbarr/Navbarr';
// import Navbar_user from './USERS/Navbarr_user/Navbarr_user';
// import LoginForm from './LoginFrom/LoginFrom';
// import FetchStates from './FetchStates'; // Import the FetchStates component
// import './App.css';

// // Admin Components
// import Home from './Home/Home';
// import WTG_Wise_Planning from './WTG_wise/WTG_Wise_Planning';
// import User_Management from './User_Manegement/User_Manegement';
// import Admin_management from './Admin_manegement/Admin_manegement';
// import Site_Report from './Site_Report/Site_Report';
// import Functional_Loc from './Funtional_Loc/Functional_Loc';
// import Oil from './Site_Report/Oil/Oil';
// import PM from './Site_Report/PM/PM';
// import Lubrication from './Site_Report/Lubrication/Lubrication_table';
// import OilAnalysisTable from './Oil_Analysis/Oil_Analysis';
// import RegisterUser8867 from './Register_User/RegiterUser8867';

// import UploadExcel from './Excel_Upload_Site_Incharge/ExcelUpload';

// import SopConsumptionAnalysis8867 from './SOP_CONSUMPTION_ANALYSIS/SOP_CONSUMPTION_ANALYSIS';

// // User Components
// import Site_Report_user from './USERS/Site_Report/Site_Report_user';
// import WTG_Wise_Planning_user from './USERS/WTG_wise/WTG_Wise_Planning_user';
// import Functional_Loc_user from './USERS/Funtional_Loc/Functional_Loc_user';
// import Home_user from './USERS/Home_user/Home_user';
// import Oil_user from './USERS/Site_Report/Oil/Oil_user';
// import PM_user from './USERS/Site_Report/PM/PM_user';
// import Lubrication_user from './USERS/Site_Report/Lubrication/Lubrication_table_user';
// import OilAnalysisTableUser from './USERS/Oil_Analysis_user/Oil_Analysis_user';


// // Excel Upload Component
// const ExcelUpload = () => {
//   const [excelData8845, setExcelData8845] = useState([]);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet);
//       setExcelData8845(data);
//       console.log('Excel Data:', data);
//     };

//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div className="excel-upload">
//       <h2>Upload Excel File</h2>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//       <div>
//         <h3>Data Preview:</h3>
//         <pre>{JSON.stringify(excelData8845, null, 2)}</pre>
//       </div>
//     </div>
//   );
// };

// // Main App Component
// const MainApp = ({ sidebarOpen8845, toggleSidebar8845 }) => {
//   const isUserRoute = window.location.pathname.endsWith('_user');

//   return (
//     <div className={`app-container ${sidebarOpen8845 ? 'sidebar-open' : 'sidebar-closed'}`}>
//       {isUserRoute ? <Navbar_user /> : <Navbar />}

//       <div className="d-flex w-full">
//         {isUserRoute ? (
//           <Sidebar_user isOpen={sidebarOpen8845} toggleSidebar={toggleSidebar8845} />
//         ) : (
//           <Sidebar isOpen={sidebarOpen8845} toggleSidebar={toggleSidebar8845} />
//         )}

//         <main className="main-content">
//           <Routes>
//             {/* Admin Routes */}
//             <Route path="/Home" element={<Home />} />
//             <Route path="/WTG_Wise_Planning" element={<WTG_Wise_Planning />} />
//             <Route path="/User_Management" element={<User_Management />} />
//             <Route path="/Admin_management" element={<Admin_management />} />
//             <Route path="/Site_Report" element={<Site_Report />} />
//             <Route path="/Functional_Loc" element={<Functional_Loc />} />
//             <Route path="/Oil" element={<Oil />} />
//             <Route path="/PM" element={<PM />} />
//             <Route path="/Lubrication" element={<Lubrication />} />
//             <Route path="/Oil_Analysis" element={<OilAnalysisTable />} />
//             <Route path="/RegisterUsers" element={<RegisterUser8867 />} />
//             <Route path="/upload-excel" element={<ExcelUpload />} />

//             <Route path="/sop-consumption" element={<SopConsumptionAnalysis8867 />} />

//             {/* User Routes */}
//             <Route path="/Home_user" element={<Home_user />} />
//             <Route path="/WTG_Wise_Planning_user" element={<WTG_Wise_Planning_user />} />
//             <Route path="/Site_Report_user" element={<Site_Report_user />} />
//             <Route path="/Functional_Loc_user" element={<Functional_Loc_user />} />
//             <Route path="/Oil_user" element={<Oil_user />} />
//             <Route path="/PM_user" element={<PM_user />} />
//             <Route path="/Lubrication_user" element={<Lubrication_user />} />
//             <Route path="/Oil_Analysis_user" element={<OilAnalysisTableUser />} />

//             {/* FetchStates Route */}
//             <Route path="/fetch-states" element={<FetchStates />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// // App Component with Router
// const App = () => {
//   const [sidebarOpen8845, setSidebarOpen8845] = useState(true);

//   const toggleSidebar8845 = () => {
//     setSidebarOpen8845(!sidebarOpen8845);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginForm />} />
//         <Route
//           path="/*"
//           element={<MainApp sidebarOpen8845={sidebarOpen8845} toggleSidebar8845={toggleSidebar8845} />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // For Excel processing
// import Sidebar from './Sidebar/Sidebar';
// import Sidebar_user from './USERS/Sidebar_user/Sidebar_user';
// import Navbar from './Navbarr/Navbarr';
// import Navbar_user from './USERS/Navbarr_user/Navbarr_user';
// import LoginForm from './LoginFrom/LoginFrom';
// import FetchStates from './FetchStates'; // FetchStates component
// import './App.css';

// // Admin Components
// import Home from './Home/Home';
// import WTG_Wise_Planning from './WTG_wise/WTG_Wise_Planning';
// import User_Management from './User_Manegement/User_Manegement';
// import Admin_management from './Admin_manegement/Admin_manegement';
// import Site_Report from './Site_Report/Site_Report';
// import Functional_Loc from './Funtional_Loc/Functional_Loc';
// import Oil from './Site_Report/Oil/Oil';
// import PM from './Site_Report/PM/PM';
// import Lubrication from './Site_Report/Lubrication/Lubrication_table';
// import OilAnalysisTable from './Oil_Analysis/Oil_Analysis';
// import RegisterUser from './Register_User/RegiterUser8867';

// import SopConsumptionAnalysis from './SOP_CONSUMPTION_ANALYSIS/SOP_CONSUMPTION_ANALYSIS';
// import UploadExcel from './Excel_Upload_Site_Incharge/ExcelUpload';


// // User Components
// import Home_user from './USERS/Home_user/Home_user';
// import Site_Report_user from './USERS/Site_Report/Site_Report_user';
// import WTG_Wise_Planning_user from './USERS/WTG_wise/WTG_Wise_Planning_user';
// import Functional_Loc_user from './USERS/Funtional_Loc/Functional_Loc_user';
// import Oil_user from './USERS/Site_Report/Oil/Oil_user';
// import PM_user from './USERS/Site_Report/PM/PM_user';
// import Lubrication_user from './USERS/Site_Report/Lubrication/Lubrication_table_user';
// import OilAnalysisTableUser from './USERS/Oil_Analysis_user/Oil_Analysis_user';

// // // Excel Upload Component
// // const ExcelUpload = () => {
// //   const [excelData, setExcelData] = useState([]);
// //   const [errorMessage, setErrorMessage] = useState('');

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) {
// //       setErrorMessage('No file selected');
// //       return;
// //     }

// //     if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
// //       setErrorMessage('Unsupported file format. Please upload an Excel file.');
// //       return;
// //     }

// //     const reader = new FileReader();

// //     reader.onload = (event) => {
// //       try {
// //         const binaryStr = event.target.result;
// //         const workbook = XLSX.read(binaryStr, { type: 'binary' });
// //         const sheetName = workbook.SheetNames[0];
// //         const sheet = workbook.Sheets[sheetName];
// //         const data = XLSX.utils.sheet_to_json(sheet);
// //         if (data.length === 0) {
// //           setErrorMessage('Uploaded file is empty.');
// //         } else {
// //           setExcelData(data);
// //           setErrorMessage('');
// //           console.log('Excel Data:', data);
// //         }
// //       } catch (error) {
// //         setErrorMessage('An error occurred while reading the file.');
// //         console.error(error);
// //       }
// //     };

// //     reader.readAsBinaryString(file);
// //   };

// //   return (
// //     <div className="excel-upload">
// //       <h2>Upload Excel File</h2>
// //       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
// //       {errorMessage && <p className="error-message">{errorMessage}</p>}
// //       <div>
// //         <h3>Data Preview:</h3>
// //         <pre>{JSON.stringify(excelData, null, 2)}</pre>
// //       </div>
// //     </div>
// //   );
// // };

// // Main App Component
// const MainApp = ({ isSidebarOpen, toggleSidebar }) => {
//   const isUserRoute = window.location.pathname.includes('_user');

//   return (
//     <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       {isUserRoute ? <Navbar_user /> : <Navbar />}
//       <div className="d-flex w-full">
//         {isUserRoute ? (
//           <Sidebar_user isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         ) : (
//           <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         )}
//         <main className="main-content">
//           <Routes>
//             {/* Admin Routes */}
//             <Route path="/Home" element={<Home />} />
//             <Route path="/WTG_Wise_Planning" element={<WTG_Wise_Planning />} />
//             <Route path="/User_Management" element={<User_Management />} />
//             <Route path="/Admin_management" element={<Admin_management />} />
//             <Route path="/Site_Report" element={<Site_Report />} />
//             <Route path="/Functional_Loc" element={<Functional_Loc />} />
//             <Route path="/Oil" element={<Oil />} />
//             <Route path="/PM" element={<PM />} />
//             <Route path="/Lubrication" element={<Lubrication />} />
//             <Route path="/Oil_Analysis" element={<OilAnalysisTable />} />
//             <Route path="/RegisterUsers" element={<RegisterUser />} />
//             <Route path="/sop-consumption" element={<SopConsumptionAnalysis />} />
//             <Route path="/fetch-states" element={<FetchStates />} />
//             <Route path="/upload-excel" element={<ExcelUpload />} />

//             {/* User Routes */}
//             <Route path="/Home_user" element={<Home_user />} />
//             <Route path="/WTG_Wise_Planning_user" element={<WTG_Wise_Planning_user />} />
//             <Route path="/Site_Report_user" element={<Site_Report_user />} />
//             <Route path="/Functional_Loc_user" element={<Functional_Loc_user />} />
//             <Route path="/Oil_user" element={<Oil_user />} />
//             <Route path="/PM_user" element={<PM_user />} />
//             <Route path="/Lubrication_user" element={<Lubrication_user />} />
//             <Route path="/Oil_Analysis_user" element={<OilAnalysisTableUser />} />
//             <Route path="./path/to/ExcelUpload';"elment={<UploadExcel />}/>
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// // App Component with Router
// const App = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginForm />} />
//         <Route
//           path="/*"
//           element={<MainApp isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as XLSX from 'xlsx'; // For Excel processing
import './App.css';

// Lazy Loaded Components
const Sidebar = React.lazy(() => import('./Sidebar/Sidebar'));
const Sidebar_user = React.lazy(() => import('./USERS/Sidebar_user/Sidebar_user'));
const Navbar = React.lazy(() => import('./Navbarr/Navbarr'));
const Navbar_user = React.lazy(() => import('./USERS/Navbarr_user/Navbarr_user'));
const LoginForm = React.lazy(() => import('./LoginFrom/LoginFrom'));
const Home = React.lazy(() => import('./Home/Home'));
const WTG_Wise_Planning = React.lazy(() => import('./WTG_wise/WTG_Wise_Planning'));
const User_Management = React.lazy(() => import('./User_Manegement/User_Manegement'));
const Admin_management = React.lazy(() => import('./Admin_manegement/Admin_manegement'));
const Site_Report = React.lazy(() => import('./Site_Report/Site_Report'));
const Functional_Loc = React.lazy(() => import('./Funtional_Loc/Functional_Loc'));
const Oil = React.lazy(() => import('./Site_Report/Oil/Oil'));
const PM = React.lazy(() => import('./Site_Report/PM/PM'));
const Lubrication = React.lazy(() => import('./Site_Report/Lubrication/Lubrication_table'));
const OilAnalysisTable = React.lazy(() => import('./Oil_Analysis/Oil_Analysis'));
const RegisterUser = React.lazy(() => import('./Register_User/RegisterUser8867'));
const SopConsumptionAnalysis = React.lazy(() =>
  import('./SOP_CONSUMPTION_ANALYSIS/SOP_CONSUMPTION_ANALYSIS')
);
const UploadExcel = React.lazy(() =>
  import('./Excel_Upload_Site_Incharge/ExcelUpload')
);
const NotFound = React.lazy(() => import('./NotFound'));

// User Components
const Home_user = React.lazy(() => import('./USERS/Home_user/Home_user'));
const Site_Report_user = React.lazy(() => import('./USERS/Site_Report/Site_Report_user'));
const WTG_Wise_Planning_user = React.lazy(() =>
  import('./USERS/WTG_wise/WTG_Wise_Planning_user')
);
const Functional_Loc_user = React.lazy(() =>
  import('./USERS/Funtional_Loc/Functional_Loc_user')
);
const Oil_user = React.lazy(() => import('./USERS/Site_Report/Oil/Oil_user'));
const PM_user = React.lazy(() => import('./USERS/Site_Report/PM/PM_user'));
const Lubrication_user = React.lazy(() =>
  import('./USERS/Site_Report/Lubrication/Lubrication_table_user')
);
const OilAnalysisTableUser = React.lazy(() =>
  import('./USERS/Oil_Analysis_user/Oil_Analysis_user')
);

// Main App Component
const MainApp = ({ isSidebarOpen, toggleSidebar }) => {
  const isUserRoute = window.location.pathname.includes('_user');

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {isUserRoute ? <Navbar_user /> : <Navbar />}
      <div className="d-flex w-full">
        {isUserRoute ? (
          <Sidebar_user isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        ) : (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
            <Route path="/RegisterUsers" element={<RegisterUser />} />
            <Route path="/sop-consumption" element={<SopConsumptionAnalysis />} />
            <Route path="/upload-excel" element={<UploadExcel />} />

            {/* User Routes */}
            <Route path="/Home_user" element={<Home_user />} />
            <Route path="/WTG_Wise_Planning_user" element={<WTG_Wise_Planning_user />} />
            <Route path="/Site_Report_user" element={<Site_Report_user />} />
            <Route path="/Functional_Loc_user" element={<Functional_Loc_user />} />
            <Route path="/Oil_user" element={<Oil_user />} />
            <Route path="/PM_user" element={<PM_user />} />
            <Route path="/Lubrication_user" element={<Lubrication_user />} />
            <Route path="/Oil_Analysis_user" element={<OilAnalysisTableUser />} />

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// App Component with Router
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/*"
            element={<MainApp isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
