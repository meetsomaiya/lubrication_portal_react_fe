import React, { useEffect, useState } from 'react';
import './Oil_Analysis_user.css';

const OilAnalysisTableUser = () => {
  const orderData = [
    { type: "YD OIL CHG ORDER", Karnataka: { issue: 2245.00, return: 1835.00, percent: "81.74%" }, AP: { issue: 14242.00, return: 13171.50, percent: "92.48%" }, Maharashtra: { issue: 14478.72, return: 13440.00, percent: "92.83%" }, GJ: { issue: 11839.70, return: 10544.50, percent: "89.06%" } },
    { type: "PD OIL CHG ORDER", Karnataka: { issue: 77.00, return: 65.70, percent: "85.32%" }, AP: { issue: 3037.00, return: 2671.00, percent: "87.95%" }, Maharashtra: { issue: 4133.44, return: 3590.00, percent: "86.85%" }, GJ: { issue: 2958.25, return: 2622.70, percent: "88.66%" } },
    { type: "GB OIL CHANGE ORDER", Karnataka: { issue: 9237.00, return: 8625.00, percent: "93.37%" }, AP: { issue: 20503.00, return: 18383.00, percent: "89.66%" }, Maharashtra: { issue: 45374.00, return: 42313.00, percent: "93.25%" }, GJ: { issue: 16973.00, return: 15655.90, percent: "92.24%" } },
    { type: "FC OIL CHANGE ORDER", Karnataka: { issue: 305.00, return: 264.00, percent: "86.56%" }, AP: { issue: 0, return: 0, percent: "0.00%" }, Maharashtra: { issue: 1470.00, return: 1336.00, percent: "90.88%" }, GJ: { issue: 82.00, return: 66.00, percent: "80.49%" } },
    { type: "GB TOPUP", Karnataka: { issue: 3588.36, return: 340.00, percent: "9.47%" }, AP: { issue: 1198.80, return: 245.00, percent: "20.44%" }, Maharashtra: { issue: 2765.50, return: 100.00, percent: "3.62%" }, GJ: { issue: 3984.00, return: 0, percent: "0.00%" } },
    { type: "FC TOPUP", Karnataka: { issue: 146.31, return: 0, percent: "0.00%" }, AP: { issue: 0, return: 0, percent: "0.00%" }, Maharashtra: { issue: 1470.00, return: 22.00, percent: "1.50%" }, GJ: { issue: 137.94, return: 0, percent: "0.00%" } },
    { type: "YDPD TOPUP", Karnataka: { issue: 115.00, return: 0, percent: "0.00%" }, AP: { issue: 0.00, return: 0, percent: "0.00%" }, Maharashtra: { issue: 649.50, return: 0, percent: "0.00%" }, GJ: { issue: 0, return: 0, percent: "0.00%" } },
    { type: "DISPUTE", Karnataka: { issue: 14035.99, return: 6466.00, percent: "46.07%" }, AP: { issue: 9680.00, return: 6453.50, percent: "66.67%" }, Maharashtra: { issue: 9994.77, return: 3978.00, percent: "39.80%" }, GJ: { issue: 4886.80, return: 2331.30, percent: "47.71%" } },
    { type: "PENDING TECO", Karnataka: { issue: 3377.00, return: 1410.00, percent: "41.75%" }, AP: { issue: 844.00, return: 321.00, percent: "38.03%" }, Maharashtra: { issue: 70.00, return: 0, percent: "0.00%" }, GJ: { issue: 20.00, return: 13.00, percent: "65.00%" } }
  ];

  const [stateValue, setStateValue] = useState("");

  // Function to retrieve a specific cookie value by name
  const getCookieValue = (name) => {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  useEffect(() => {
    // Retrieve 'state' value from the cookie and set it in the state
    const state = getCookieValue("state");
    if (state) {
      setStateValue(state);
    }
  }, []);

  return (
    <div className="container997">
      <div className="buttonContainer997">
        <button id="downloadSegregatedFile997">Download Segregated File</button>
        <button id="downloadConsolidatedFile997">Download Consolidated File</button>
      </div>

      <div className="dropdownContainer997">
        <label htmlFor="financialYear997">Select Financial Year:</label>
        <select id="financialYear997">
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
        </select>
      </div>

      <div className="tableContainer997">
        <table className="oilAnalysisTable997">
          <thead>
            <tr>
              <th className="orderTypeHeader997">Order Type</th>
              <th colSpan="3">{stateValue}</th>
            </tr>
            <tr>
              <th></th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order, index) => (
              <tr key={index}>
                <td className="orderTypeLink997">
                  <a href="#">{order.type}</a>
                </td>
                <td>{order.Karnataka.issue}</td>
                <td>{order.Karnataka.return}</td>
                <td>{order.Karnataka.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OilAnalysisTableUser;
