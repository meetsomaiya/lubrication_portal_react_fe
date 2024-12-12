import React, { useEffect, useState } from 'react';
import './Oil_Analysis.css';

const OilAnalysisTable = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [orderData, setOrderData] = useState([]);

  // Fetch financial years on component mount
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const response = await fetch('http://localhost:224/api/fetch_fy_year');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFinancialYears(data.financial_years);
      } catch (error) {
        console.error('Error fetching financial years:', error);
      }
    };

    // Fetch order types on component mount
    const fetchOrderTypes = async () => {
      try {
        const response = await fetch('http://localhost:224/api/fetch_order_type');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const orderTypes = data.order_types.map(type => ({
          type,
          Karnataka: { issue: 0, return: 0, percent: "0%" },
          AP: { issue: 0, return: 0, percent: "0%" },
          Maharashtra: { issue: 0, return: 0, percent: "0%" },
          GJ: { issue: 0, return: 0, percent: "0%" },
          Rajasthan: { issue: 0, return: 0, percent: "0%" },
          TamilNadu: { issue: 0, return: 0, percent: "0%" },
          GJ2: { issue: 0, return: 0, percent: "0%" },
        }));
        setOrderData(orderTypes);
      } catch (error) {
        console.error('Error fetching order types:', error);
      }
    };

    fetchFinancialYears();
    fetchOrderTypes();
  }, []);

  const fetchDataForYDOilChange = async (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  
    if (year) {
      // Construct the URL with encoded year
      const url = `http://localhost:224/api/fetch_yd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
      
      // Log the encoded URL
      console.log("Request URL:", url);
  
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const statewiseData = await response.json();
        
        // Console log the fetched data
        console.log("Fetched statewise data:", statewiseData);
  
        // Update YD_OIL_CHG_ORDER data with fetched statewise data
        setOrderData(prevOrderData =>
          prevOrderData.map(order => {
            if (order.type === 'YD_OIL_CHG_ORDER') {
              return {
                ...order,
                Karnataka: {
                  issue: formatValue(statewiseData['Karnataka']?.issue_quantity),
                  return: formatValue(statewiseData['Karnataka']?.return_quantity),
                  percent: `${formatValue(statewiseData['Karnataka']?.return_percentage)}%`
                },
                AP: {
                  issue: formatValue(statewiseData['Andhra Pradesh']?.issue_quantity),
                  return: formatValue(statewiseData['Andhra Pradesh']?.return_quantity),
                  percent: `${formatValue(statewiseData['Andhra Pradesh']?.return_percentage)}%`
                },
                Maharashtra: {
                  issue: formatValue(statewiseData['Maharashtra']?.issue_quantity),
                  return: formatValue(statewiseData['Maharashtra']?.return_quantity),
                  percent: `${formatValue(statewiseData['Maharashtra']?.return_percentage)}%`
                },
                GJ: {
                  issue: formatValue(statewiseData['GJ - Saurashtra']?.issue_quantity),
                  return: formatValue(statewiseData['GJ - Saurashtra']?.return_quantity),
                  percent: `${formatValue(statewiseData['GJ - Saurashtra']?.return_percentage)}%`
                },
                Rajasthan: {
                  issue: formatValue(statewiseData['Rajasthan']?.issue_quantity),
                  return: formatValue(statewiseData['Rajasthan']?.return_quantity),
                  percent: `${formatValue(statewiseData['Rajasthan']?.return_percentage)}%`
                },
                TamilNadu: {
                  issue: formatValue(statewiseData['Tamil nadu']?.issue_quantity),
                  return: formatValue(statewiseData['Tamil nadu']?.return_quantity),
                  percent: `${formatValue(statewiseData['Tamil nadu']?.return_percentage)}%`
                },
                GJ2: {
                  issue: formatValue(statewiseData['GJ - Kutch']?.issue_quantity),
                  return: formatValue(statewiseData['GJ - Kutch']?.return_quantity),
                  percent: `${formatValue(statewiseData['GJ - Kutch']?.return_percentage)}%`
                }
              };
            }
            return order;
          })
        );
      } catch (error) {
        console.error('Error fetching statewise data:', error);
      }
    }
  };
  
  // Helper function to format values to 2 decimal places
  const formatValue = (value) => {
    const number = parseFloat(value);
    return Number.isNaN(number) ? "0.00" : number.toFixed(2);
  };
  
  

  return (
    <div className="container997">
      <div className="buttonContainer997">
        <button id="downloadSegregatedFile997">Download Segregated File</button>
        <button id="downloadConsolidatedFile997">Download Consolidated File</button>
      </div>

      <div className="dropdownContainer997">
        <label htmlFor="financialYear997">Select Financial Year:</label>
        <select
          id="financialYear997"
          value={selectedYear}
          // onChange={handleYearChange}
          onChange={fetchDataForYDOilChange}
        >
          <option value="">Select Financial Year</option>
          {financialYears.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="tableContainer997">
        <table className="oilAnalysisTable997">
          <thead>
            <tr>
              <th className="orderTypeHeader997">Order Type</th>
              <th colSpan="3">Karnataka</th>
              <th colSpan="3">Andhra Pradesh</th>
              <th colSpan="3">Maharashtra</th>
              <th colSpan="3">GJ - Saurashtra</th>
              <th colSpan="3">Rajasthan</th>
              <th colSpan="3">Tamil Nadu</th>
              <th colSpan="3">GJ - Kutch</th>
            </tr>
            <tr>
              <th></th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
              <th>Issue</th>
              <th>Return</th>
              <th>Percentage</th>
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
                <td>{order.AP.issue}</td>
                <td>{order.AP.return}</td>
                <td>{order.AP.percent}</td>
                <td>{order.Maharashtra.issue}</td>
                <td>{order.Maharashtra.return}</td>
                <td>{order.Maharashtra.percent}</td>
                <td>{order.GJ.issue}</td>
                <td>{order.GJ.return}</td>
                <td>{order.GJ.percent}</td>
                <td>{order.Rajasthan.issue}</td>
                <td>{order.Rajasthan.return}</td>
                <td>{order.Rajasthan.percent}</td>
                <td>{order.TamilNadu.issue}</td>
                <td>{order.TamilNadu.return}</td>
                <td>{order.TamilNadu.percent}</td>
                <td>{order.GJ2.issue}</td>
                <td>{order.GJ2.return}</td>
                <td>{order.GJ2.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OilAnalysisTable;
