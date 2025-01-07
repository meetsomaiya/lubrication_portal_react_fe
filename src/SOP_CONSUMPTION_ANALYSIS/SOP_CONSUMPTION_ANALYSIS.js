import React, { useState } from "react";
import "./SopConsumptionAnalysis8867.css";
import step1 from "../sop_image/1.png";
import step2 from "../sop_image/2.png";
import step3 from "../sop_image/3.png";
import step4 from "../sop_image/4.png";
import step5 from "../sop_image/5.png";
import step6 from "../sop_image/6.png";
import step7 from "../sop_image/7.png";
import { FaTimes } from "react-icons/fa";

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

const SopConsumptionAnalysis8867 = () => {
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

export default SopConsumptionAnalysis8867;
