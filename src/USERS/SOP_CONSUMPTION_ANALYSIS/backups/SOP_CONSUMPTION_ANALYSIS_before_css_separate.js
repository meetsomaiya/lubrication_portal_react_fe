import React, { useState } from "react";
import step1 from "../sop_image/1.png";
import step2 from "../sop_image/2.png";
import step3 from "../sop_image/3.png";
import step4 from "../sop_image/4.png";
import step5 from "../sop_image/5.png";
import step6 from "../sop_image/6.png";
import step7 from "../sop_image/7.png";
import { FaTimes } from "react-icons/fa";

// Steps array with images assigned to variables
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
  const [fullImageSrc8867, setFullImageSrc8867] = useState(""); // State for full image modal
  const [isModalActive8867, setIsModalActive8867] = useState(false); // State to show/hide modal

  // Function to open modal with selected image
  const openImageModal8867 = (imgSrc) => {
    setFullImageSrc8867(imgSrc);
    setIsModalActive8867(true);
  };

  // Function to close the modal
  const closeImageModal8867 = () => {
    setIsModalActive8867(false);
    setFullImageSrc8867("");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f9",
        margin: "0",
        padding: "0",
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <div style={{ padding: "2vh 5vw" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "3vw",
            color: "#2d3748",
            marginBottom: "3vh",
          }}
        >
          SOP for Consumption Analysis
        </h1>

        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => openImageModal8867(step.imgSrc)}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5vh",
              cursor: "pointer",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0, 0, 0, 0.2)")
            }
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ flex: 2, padding: "2vw", backgroundColor: "#fff" }}>
              <p style={{ margin: 0 }}>{step.text}</p>
            </div>
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <img
                src={step.imgSrc}
                alt={`Step ${step.id}`}
                style={{
                  width: "100%",
                  maxHeight: "30vh",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FaTimes
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  fontSize: "1.5em",
                  color: "#2d3748",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "none",
                }}
              />
            </div>
          </div>
        ))}

        {/* Full Image Modal */}
        {isModalActive8867 && (
          <div
            style={{
              display: "flex",
              position: "fixed",
              top: "0",
              left: "0",
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.8)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "1000",
            }}
            onClick={closeImageModal8867}
          >
            <img
              src={fullImageSrc8867}
              alt="Expanded View"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "10px",
              }}
            />
            <FaTimes
              onClick={closeImageModal8867}
              style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                fontSize: "2em",
                color: "white",
                cursor: "pointer",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SopConsumptionAnalysis8867;
