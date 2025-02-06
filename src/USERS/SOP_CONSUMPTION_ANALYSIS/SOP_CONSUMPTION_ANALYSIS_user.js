import React, { useState, useEffect } from "react";
import "./SopConsumptionAnalysis8867.css";
import photo1 from "../../sop_image/photo1.PNG";
import photo2 from "../../sop_image/photo2.PNG";
import photo3 from "../../sop_image/photo3.PNG";
import photo4 from "../../sop_image/photo4.png";
import { FaTimes } from "react-icons/fa";
import moment from 'moment-timezone';
import { BASE_URL } from '../../config';

const steps = [
  {
    id: 1,
    text: "1. After logging into the Fleet Manager, hover over the 'Applications' section on the navigation bar. From the dropdown menu, click on 'Lubrication Portal'.",
    imgSrc: photo1,
  },
  {
    id: 2,
    text: "2. You will be redirected to a new page. Here, a table will display the order types and their respective state information assigned to you.",
    imgSrc: photo2,
  },
  {
    id: 3,
    text: "3. Locate the 'Dispute' order type in the table. Clicking on it will open a separate overlay box containing detailed information about the specific state.",
    imgSrc: photo3,
  },
  {
    id: 4,
    text: "4. Scroll to the far right side of the overlay box, where you'll find a column labeled 'Reason.' Select a reason from the dropdown menu. To enter a custom reason, click on 'Other', which will prompt an input box. After entering your custom reason, click 'OK' to save. Finally, click 'Save' under the 'Action' column to confirm the selected reason for that order.",
    imgSrc: photo4,
  },
];

const SopConsumptionAnalysis8867_user = () => {

  let entryTime = null;
  let exitTime = null;

  const sendCookiesToBackend = async () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

    const pathname = window.location.hash.replace(/^#/, '');
    const currentTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    const cookieData = {
      name: cookies.name || 'Not Set',
      userId: cookies.userId || 'Not Set',
      access: cookies.access || 'Not Set',
      adminEmail: cookies.adminEmail || 'Not Set',
      domain_id: cookies.domain_id || 'Not Set',
      state: cookies.state || 'Not Set',
      area: cookies.area || 'Not Set',
      site: cookies.site || 'Not Set',
      adminEmail: cookies.email || 'Not Set',
      pathname: pathname,
      entryTime: entryTime,
      exitTime: exitTime,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/heartbeat`, {
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
    entryTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    console.log(`Entry Time (IST): ${entryTime}`);

    const handleBeforeUnload = () => {
      exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      console.log(`Exit Time (IST): ${exitTime}`);
      sendCookiesToBackend();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

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
        <h1 className="sop-title">SOP for Lubrication Portal - Order Dispute</h1>

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
