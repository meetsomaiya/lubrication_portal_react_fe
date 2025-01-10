import React, { useState,useEffect } from "react";
import "./SopConsumptionAnalysis8867.css";
import step1 from "../../sop_image/1.png";
import step2 from "../../sop_image/2.png";
import step3 from "../../sop_image/3.png";
import step4 from "../../sop_image/4.png";
import step5 from "../../sop_image/5.png";
import step6 from "../../sop_image/6.png";
import step7 from "../../sop_image/7.png";
import { FaTimes } from "react-icons/fa";

import moment from 'moment-timezone';


const steps = [
  {
    id: 1,
    text: "1. Access the application by visiting the link provided. On the login page, enter your domain ID and password to sign in.",
    imgSrc: step1,
  },
  {
    id: 2,
    text: "2. After logging in, move your cursor over your name located on the right-hand side of the screen. A menu will appear—select the option labeled 'Oil Analysis' by clicking on it.",
    imgSrc: step2,
  },
  {
    id: 3,
    text: "3. On this screen, choose the financial year from the dropdown menu. You will then see a list of all orders, along with their issue quantity, return quantity, and percentage, based on the assigned state.",
    imgSrc: step3,
  },
  {
    id: 4,
    text: "4. To provide justification of oil change orders where the oil return is less than 80% or more than 100%, click on dispute.",
    imgSrc: step4,
  },
  {
    id: 5,
    text: "5. To search for or filter a specific order or functional location, click on the filter icon.",
    imgSrc: step5,
  },
  {
    id: 6,
    text: "6. Scroll to the right side of the table until you see the column titled 'Update Reasoning.' Here, you can either choose a reason from the dropdown menu or, if needed, select 'Other' to manually enter your reason. Once done click on Save.",
    imgSrc: step6,
  },
  {
    id: 7,
    text: "7. To update the reasoning for TECO pending orders, click on 'Pending Teco' and follow the same procedure as described earlier.",
    imgSrc: step7,
  },
];

const SopConsumptionAnalysis8867_user = () => {

  let entryTime = null;  // Store the entry time (when user stepped into the page)
                       let exitTime = null;   // Store the exit time (when user left the page)
                       
                       const sendCookiesToBackend = async () => {
                         const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                           const [key, value] = cookie.trim().split('=');
                           acc[key] = decodeURIComponent(value);
                           return acc;
                         }, {});
                       
   // Get the current pathname when using HashRouter
   const pathname = window.location.hash.replace(/^#/, '');
                       
                         // Get the current time in IST format
                         const currentTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                       
                         // Prepare the data to send to the backend
                         const cookieData = {
                           name: cookies.name || 'Not Set',
                           userId: cookies.userId || 'Not Set',
                           access: cookies.access || 'Not Set',
                           adminEmail: cookies.adminEmail || 'Not Set',
                           userId: cookies.userId || 'Not Set',
                        //   domain_id: cookies.adminDomain || 'Not Set',
                        domain_id: cookies.domain_id || 'Not Set',  // Use the state for domain_id
                           state: cookies.state || 'Not Set',
                           area: cookies.area || 'Not Set',
                           site: cookies.site || 'Not Set',
                          // email: cookies.email || 'Not Set',
                          adminEmail: cookies.email || 'Not Set',
                           pathname: pathname,  // Add the pathname to the data
                           entryTime: entryTime, // Include entry time (when user stepped in)
                           exitTime: exitTime,   // Include exit time (when user leaves)
                         };
                       
                         console.log('Sending the following cookie data to backend:', cookieData);
                       
                         try {
                           // Send data to the backend's heartbeat API
                           const response = await fetch('http://localhost:224/api/heartbeat', {
                             method: 'POST',
                             headers: {
                               'Content-Type': 'application/json',
                             },
                             body: JSON.stringify(cookieData),
                           });
                       
                           if (response.ok) {
                             console.log('Cookie data sent to backend successfully.');
                           } else {
                             console.error('Error sending cookie data to backend:', response.status);
                           }
                         } catch (error) {
                           console.error('Failed to send cookie data:', error);
                         }
                       };
                       
                       useEffect(() => {
                         // Set entry time when the page loads
                         entryTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                         console.log(`Entry Time (IST): ${entryTime}`);
                       
                         // Add event listener for beforeunload (browser close / tab close)
                         const handleBeforeUnload = () => {
                           exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                           console.log(`Exit Time (IST): ${exitTime}`);
                           sendCookiesToBackend();
                         };
                       
                         window.addEventListener('beforeunload', handleBeforeUnload);
                       
                         return () => {
                           // Clean up the event listener when the component unmounts
                           window.removeEventListener('beforeunload', handleBeforeUnload);
                         };
                       }, []);
                       
                       useEffect(() => {
                         const handlePathChange = () => {
                           // Capture exit time and send cookies when pathname changes
                           exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                           console.log(`Exit Time (IST): ${exitTime}`);
                           sendCookiesToBackend();
                         };
                       
                         // Listen for changes in the pathname using window.history
                         const windowHistoryPushState = window.history.pushState;
                         window.history.pushState = function (...args) {
                           handlePathChange();
                           return windowHistoryPushState.apply(this, args);
                         };
                       
                         const windowHistoryReplaceState = window.history.replaceState;
                         window.history.replaceState = function (...args) {
                           handlePathChange();
                           return windowHistoryReplaceState.apply(this, args);
                         };
                       
                         return () => {
                           // Reset window.history methods when component unmounts
                           window.history.pushState = windowHistoryPushState;
                           window.history.replaceState = windowHistoryReplaceState;
                         };
                       }, []);
                     
                     // Call the polling function on mount
                     useEffect(() => {
                       // Send cookies on page unload and capture exit time
                       const handleBeforeUnload = (event) => {
                         exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                         console.log(`Exit Time (IST): ${exitTime}`);
                     
                         // Send cookies and exit time to backend when user is leaving the page
                         sendCookiesToBackend();
                       };
                     
                       // Attach event listener for beforeunload
                       window.addEventListener('beforeunload', handleBeforeUnload);
                     
                       // Clean up the event listener on component unmount
                       return () => {
                         window.removeEventListener('beforeunload', handleBeforeUnload);
                       };
                     }, []);

  const [fullImageSrc8867, setFullImageSrc8867] = useState("");
  const [isModalActive8867, setIsModalActive8867] = useState(false);

  const openImageModal8867 = (imgSrc) => {
    setFullImageSrc8867(imgSrc);
    setIsModalActive8867(true);
  };

  const closeImageModal8867 = () => {
    setIsModalActive8867(false);
    setFullImageSrc8867("");
  };

  return (
    <div className="sop-container">
      <div className="sop-content">
        <h1 className="sop-title">SOP for Consumption Analysis</h1>

        {steps.map((step) => (
          <div
            key={step.id}
            className="sop-step-card"
            onClick={() => openImageModal8867(step.imgSrc)}
          >
            <div className="sop-step-text">
              <p>{step.text}</p>
            </div>
            <div className="sop-step-image">
              <img src={step.imgSrc} alt={`Step ${step.id}`} />
              <FaTimes className="sop-close-icon" />
            </div>
          </div>
        ))}

        {isModalActive8867 && (
          <div className="sop-modal" onClick={closeImageModal8867}>
            <img src={fullImageSrc8867} alt="Expanded View" />
            <FaTimes className="sop-modal-close" onClick={closeImageModal8867} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SopConsumptionAnalysis8867_user;
