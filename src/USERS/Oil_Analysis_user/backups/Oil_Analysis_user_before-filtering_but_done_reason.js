import React, { useEffect, useState } from 'react';
import './Oil_Analysis_user.css';
import { BASE_URL } from '../../config'

const OilAnalysisTableUser = () => {
  // const orderData = [
  //   { type: "YD OIL CHG ORDER", Karnataka: { issue: 2245.00, return: 1835.00, percent: "81.74%" }, AP: { issue: 14242.00, return: 13171.50, percent: "92.48%" }, Maharashtra: { issue: 14478.72, return: 13440.00, percent: "92.83%" }, GJ: { issue: 11839.70, return: 10544.50, percent: "89.06%" } },
  //   { type: "PD OIL CHG ORDER", Karnataka: { issue: 77.00, return: 65.70, percent: "85.32%" }, AP: { issue: 3037.00, return: 2671.00, percent: "87.95%" }, Maharashtra: { issue: 4133.44, return: 3590.00, percent: "86.85%" }, GJ: { issue: 2958.25, return: 2622.70, percent: "88.66%" } },
  //   { type: "GB OIL CHANGE ORDER", Karnataka: { issue: 9237.00, return: 8625.00, percent: "93.37%" }, AP: { issue: 20503.00, return: 18383.00, percent: "89.66%" }, Maharashtra: { issue: 45374.00, return: 42313.00, percent: "93.25%" }, GJ: { issue: 16973.00, return: 15655.90, percent: "92.24%" } },
  //   { type: "FC OIL CHANGE ORDER", Karnataka: { issue: 305.00, return: 264.00, percent: "86.56%" }, AP: { issue: 0, return: 0, percent: "0.00%" }, Maharashtra: { issue: 1470.00, return: 1336.00, percent: "90.88%" }, GJ: { issue: 82.00, return: 66.00, percent: "80.49%" } },
  //   { type: "GB TOPUP", Karnataka: { issue: 3588.36, return: 340.00, percent: "9.47%" }, AP: { issue: 1198.80, return: 245.00, percent: "20.44%" }, Maharashtra: { issue: 2765.50, return: 100.00, percent: "3.62%" }, GJ: { issue: 3984.00, return: 0, percent: "0.00%" } },
  //   { type: "FC TOPUP", Karnataka: { issue: 146.31, return: 0, percent: "0.00%" }, AP: { issue: 0, return: 0, percent: "0.00%" }, Maharashtra: { issue: 1470.00, return: 22.00, percent: "1.50%" }, GJ: { issue: 137.94, return: 0, percent: "0.00%" } },
  //   { type: "YDPD TOPUP", Karnataka: { issue: 115.00, return: 0, percent: "0.00%" }, AP: { issue: 0.00, return: 0, percent: "0.00%" }, Maharashtra: { issue: 649.50, return: 0, percent: "0.00%" }, GJ: { issue: 0, return: 0, percent: "0.00%" } },
  //   { type: "DISPUTE", Karnataka: { issue: 14035.99, return: 6466.00, percent: "46.07%" }, AP: { issue: 9680.00, return: 6453.50, percent: "66.67%" }, Maharashtra: { issue: 9994.77, return: 3978.00, percent: "39.80%" }, GJ: { issue: 4886.80, return: 2331.30, percent: "47.71%" } },
  //   { type: "PENDING TECO", Karnataka: { issue: 3377.00, return: 1410.00, percent: "41.75%" }, AP: { issue: 844.00, return: 321.00, percent: "38.03%" }, Maharashtra: { issue: 70.00, return: 0, percent: "0.00%" }, GJ: { issue: 20.00, return: 13.00, percent: "65.00%" } }
  // ];

  const [stateValue, setStateValue] = useState("");

  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [orderData, setOrderData] = useState([]);

  const [loading, setLoading] = useState(false); // To track loading state
  const [modalData, setModalData] = useState(null); // To store the fetched data
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const [clickedOrderType, setClickedOrderType] = useState('');

  const [customReasons, setCustomReasons] = React.useState([]); // Holds custom reason input values

  const [dropdownOptions, setDropdownOptions] = React.useState([
    "Select",
    "FLUSHING OIL ISSUE",
    "OIL CHANGE SPILLAGE",
    "OIL LEAKAG FLUID COUPLING CRACK",
    "OIL LEAKAG GEAR BOX CRACK",
    "OIL LEAKAG HOSE PIPE",
    "OIL LEAKAGE EQUIPMENT REPLACEMENT",
    "OIL LEAKAGE FUSIBLE PLUG",
    "OIL LEAKAGE RADIATOR ISSUE",
    "OIL LEAKAGE SEAL DAMAGE",
    "OIL LEAKAGE SHAFT REPLACEMENT",
    "OIL LEAKAGE TOP UP DONE",
    "OIL LEVEL LOW",
    "SAP TRANSACTION",
    "SAP TRANSACTION CANCEL",
    "SPILLAGE ISSUE",
    "TOP UP FC OIL",
    "TOP UP GB OIL",
    "TOP UP PD OIL",
    "TOP UP YD OIL",
    "WRONG TRANSACTION",
    "Other",
  ]);
  

    // Helper function to format values to 2 decimal places
    // const formatValue = (value) => {
    //   const number = parseFloat(value);
    //   return Number.isNaN(number) ? "0.00" : number.toFixed(2);
    // };

    // Helper function to format values to 2 decimal places and return absolute value
const formatValue = (value) => {
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return "0.00";
  }
  const absoluteValue = Math.abs(number);
  return absoluteValue.toFixed(2);
};


const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");
  const targetCookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
  return targetCookie ? decodeURIComponent(targetCookie.split("=")[1]) : null;
};

// Usage Example
const domainId = getCookie("domain_id");
const userName = getCookie("name");

console.log("Retrieved Cookies:");
console.log("Domain ID:", domainId);
console.log("User Name:", userName);




    // Fetch financial years on component mount
    useEffect(() => {
      const fetchFinancialYears = async () => {
        try {
          // const response = await fetch('http://localhost:224/api/fetch_fy_year');
          const response = await fetch(`${BASE_URL}/api/fetch_fy_year`);
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
          // const response = await fetch('http://localhost:224/api/fetch_order_type');
          const response = await fetch(`${BASE_URL}/api/fetch_order_type`);
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
        // const url = `http://localhost:224/api/fetch_yd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
        const url = `${BASE_URL}/api/fetch_yd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
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

    const fetchDataForPDOilChange = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_pd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
        const url = `${BASE_URL}/api/fetch_pd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'PD_OIL_CHG_ORDER') {
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
  
    const fetchDataForGBOilChange = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_gb_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
        const url = `${BASE_URL}/api/fetch_gb_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
  
        
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
              if (order.type === 'GB_OIL_CHANGE ORDER') {
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
  
    const fetchDataForFCOilChange = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_fc_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
        const url = `${BASE_URL}/api/fetch_fc_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'FC_OIL_CHANGE ORDER') {
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
  
    const fetchDataForGbTopup = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_gb_topup_state_wise_data?year=${encodeURIComponent(year)}`;
  
        const url = `${BASE_URL}/api/fetch_gb_topup_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'gb_topup') {
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
  
    const fetchDataForFCTopup = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_fc_topup_state_wise_data?year=${encodeURIComponent(year)}`;
  
        const url = `${BASE_URL}/api/fetch_fc_topup_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'fc_topup') {
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
  
    const fetchDataForYDPDTopUp = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_ydpd_topup_state_wise_data?year=${encodeURIComponent(year)}`;
  
        const url = `${BASE_URL}/api/fetch_ydpd_topup_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'ydpd_topup') {
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
  
    const fetchDataForDispute = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_dispute_state_wise_data?year=${encodeURIComponent(year)}`;
  
        const url = `${BASE_URL}/api/fetch_dispute_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'dispute') {
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
  
    
  
    const fetchDataForPendingTeco = async (event) => {
      const year = event.target.value;
      setSelectedYear(year);
    
      if (year) {
        // Construct the URL with encoded year
        // const url = `http://localhost:224/api/fetch_pending_teco_state_wise_data?year=${encodeURIComponent(year)}`;
  
        const url = `${BASE_URL}/api/fetch_pending_teco_state_wise_data?year=${encodeURIComponent(year)}`;
        
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
              if (order.type === 'Pending Teco') {
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

    const handleReasonChange = (e, index) => {
      const newModalData = [...modalData];
      newModalData[index].reason = e.target.value;
      setModalData(newModalData);
    };
  
    const handleCustomReasonChange = (e, index) => {
      const newCustomReasons = [...customReasons];
      newCustomReasons[index] = e.target.value;
      setCustomReasons(newCustomReasons);
    };
  
    const handleAddCustomReason = (index) => {
      const newReason = customReasons[index]?.trim();
      if (newReason) {
        // Add to dropdown options if not already present
        if (!dropdownOptions.includes(newReason)) {
          setDropdownOptions((prevOptions) => [...prevOptions, newReason]);
        }
    
        // Update selected value for the specific row
        const updatedData = [...modalData];
        updatedData[index]["reason"] = newReason; // Set the reason for the current row
        setModalData(updatedData);
    
        // Clear custom reason input
        const updatedCustomReasons = [...customReasons];
        updatedCustomReasons[index] = "";
        setCustomReasons(updatedCustomReasons);
      }
    };
  
    // const handleSaveReason = (index) => {
    //   console.log("Saving reason for row:", index, modalData[index].reason);
    // };

    const handleSaveReason = (index) => {
      const currentItem = modalData[index];
    
      // Retrieve cookies
      const domainId = getCookie("domain_id");
      const userName = getCookie("name");
    
      // Prepare data to send
      const dataToSend = {
        orderNo: currentItem["Order No"],
        reason: currentItem["reason"],
        domain_id: domainId,
        name: userName,
      };
    
      // Log data being sent
      console.log("Data being sent to API:", dataToSend);
    
      // Example API call (uncomment to use)
      fetch("http://localhost:224/api/insert_reason_for_dispute_and_pending_teco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          // Log the response from API
          console.log("Response from API:", data);
          
          // Alert the response to the user
          if (data.error) {
            alert(`Error: ${data.error}`);
          } else {
            alert(`Success: Data successfully inserted for Order No: ${data.writtenData.reasons.orderNo}`);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while processing your request.");
        });
    };
    
    


    // Mapping of order types to their respective API endpoints
const orderTypeApiMap = {
  'FC_OIL_CHANGE ORDER': 'fetch_fc_oil_chg_data_user',
  'GB_OIL_CHANGE ORDER': 'fetch_gb_oil_chg_data_user',
  'YD_OIL_CHG_ORDER': 'fetch_yd_oil_chg_data_user',
  'PD_OIL_CHG_ORDER': 'fetch_pd_oil_chg_data_user',
  'gb_topup': 'fetch_gb_topup_data_user',
  'fc_topup': 'fetch_fc_topup_data_user',
  'ydpd_topup': 'fetch_ydpd_topup_data_user',
  'dispute': 'fetch_dispute_data_user',
  'Pending Teco': 'fetch_pending_teco_data_user',
  // Add more order types and their corresponding endpoints as needed
};

const handleOrderTypeClick = async (orderType) => {

  setClickedOrderType(orderType); // Track the clicked order type

  if (!orderTypeApiMap[orderType]) {
    console.log(`No API endpoint configured for order type: ${orderType}`);
    return;
  }

  if (!selectedYear) {
    alert('Please select a financial year.');
    return;
  }

  // Construct the URL based on the selected order type
  const apiEndpoint = orderTypeApiMap[orderType];
  // const url = `http://localhost:224/api/${apiEndpoint}?order_type=${encodeURIComponent(orderType)}&financial_year=${encodeURIComponent(selectedYear)}`;

  const url = `${BASE_URL}/api/${apiEndpoint}?order_type=${encodeURIComponent(orderType)}&financial_year=${encodeURIComponent(selectedYear)}&state=${encodeURIComponent(stateValue)}`;

  setLoading(true); // Show loader

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setModalData(data); // Save data to state
      setShowModal(true); // Show modal
    } else {
      console.error('API request failed');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false); // Hide loader
  }
};

  
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
    <div className="container997user">
      <div className="buttonContainer997user">
        <button id="downloadSegregatedFile997user">Download Segregated File</button>
        <button id="downloadConsolidatedFile997user">Download Consolidated File</button>
      </div>

      <div className="dropdownContainer997user">
        <label htmlFor="financialYear997">Select Financial Year:</label>
        {/* <select id="financialYear997">
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
        </select> */}

<select
      id="financialYear997user"
      value={selectedYear}
      onChange={(event) => {
        const newSelectedYear = event.target.value;
        setSelectedYear(newSelectedYear);
        
        // Uncomment and call your fetchData functions if needed:
        fetchDataForYDOilChange(event);
        fetchDataForPDOilChange(event);
        fetchDataForGBOilChange(event);
        fetchDataForFCOilChange(event);
        fetchDataForGbTopup(event);
        fetchDataForFCTopup(event);
        fetchDataForYDPDTopUp(event);
        fetchDataForDispute(event);
        fetchDataForPendingTeco(event);
      }}
    >
      <option value="">Select Financial Year</option>
      {financialYears.map((year, index) => (
        <option key={index} value={year}>{year}</option>
      ))}
    </select>


      </div>



      <div className="tableContainer997user">
        <table className="oilAnalysisTable997user">
          <thead>
            <tr>
              <th className="orderTypeHeader997user">Order Type</th>
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
      {/* <td className="orderTypeLink997user">
        <a href="#">{order.type}</a>
      </td> */}
                                    <td className="orderTypeLink997user">
                {/* Order Type Link that calls handleOrderTypeClick when clicked */}
                <a href="#" onClick={() => handleOrderTypeClick(order.type)}>
                  {order.type}
                </a>
              </td>
      {/* Conditionally display the state data based on the state from the cookie */}
      {stateValue && order[stateValue] ? (
        <>
          <td>{order[stateValue]?.issue}</td>
          <td>{order[stateValue]?.return}</td>
          <td>{order[stateValue]?.percent}</td>
        </>
      ) : (
        <>
          <td>N/A</td>
          <td>N/A</td>
          <td>N/A</td>
        </>
      )}
    </tr>
  ))}
</tbody>

        </table>

                      {/* Preloader */}
      {loading && (
        <div className="preloaderuser">
          <div className="circleuser"></div>
        </div>
      )}

      {/* Modal */}
{showModal && (
  <div className="modal-7997">
    <div className="modal-content-7997">
      <button onClick={() => setShowModal(false)}>Close</button>
      {modalData && (
        <div className="data-table-wrapper-7997">
<table className="data-table-7997" id="tbl7997">
  <thead>
    <tr>
      <th>Order No</th>
      <th>Function Loc</th>
      <th>Issue</th>
      <th>Return</th>
      <th>Return Percentage</th>
      <th>Plant</th>
      <th>State</th>
      <th>Area</th>
      <th>Site</th>
      <th>Material</th>
      <th>Storage Location</th>
      <th>Move Type</th>
      <th>Material Document</th>
      <th>Description</th>
      <th>Val Type</th>
      <th>Posting Date</th>
      <th>Entry Date</th>
      <th>Quantity</th>
      <th>Order</th>
      <th>Order Type</th>
      <th>Component</th>
      <th>WTG Model</th>
      <th>Current Oil Change Date</th>
      <th>State Engineering Head</th>
      <th>Area Incharge</th>
      <th>Site Incharge</th>
      <th>State PMO</th>
      <th>Order Status</th>
      {clickedOrderType === 'dispute' && <th>Reason</th>}
      {clickedOrderType === 'dispute' && <th>Action</th>}
    </tr>
  </thead>
  <tbody>
    {modalData &&
      modalData.map((item, index) => (
        <tr key={index}>
          <td>{item["Order No"]}</td>
          <td>{item["Function Loc"]}</td>
          <td>{item["Issue"]}</td>
          <td>{item["Return"]}</td>
          <td>{item["Return Percentage"]}</td>
          <td>{item["Plant"]}</td>
          <td>{item["State"]}</td>
          <td>{item["Area"]}</td>
          <td>{item["Site"]}</td>
          <td>{item["Material"]}</td>
          <td>{item["Storage Location"]}</td>
          <td>{item["Move Type"]}</td>
          <td>{item["Material Document"]}</td>
          <td>{item["Description"]}</td>
          <td>{item["Val Type"]}</td>
          <td>{item["Posting Date"]}</td>
          <td>{item["Entry Date"]}</td>
          <td>{item["Quantity"]}</td>
          <td>{item["Order"]}</td>
          <td>{item["Order Type"]}</td>
          <td>{item["Component"]}</td>
          <td>{item["WTG Model"]}</td>
          <td>{item["Current Oil Change Date"]}</td>
          <td>{item["stateEnggHead"]}</td>
          <td>{item["areaIncharge"]}</td>
          <td>{item["siteIncharge"]}</td>
          <td>{item["statePMO"]}</td>
          <td>{item["Order Status"]}</td>
          {clickedOrderType === 'dispute' && (
                    <>
            <td>
            <select
  value={item["reason"] || "Select"}
  onChange={(e) => handleReasonChange(e, index)}
>
  {dropdownOptions.map((option, idx) => (
    <option key={idx} value={option}>
      {option}
    </option>
  ))}
</select>


              {item.reason === "Other" && (
              <div>
                <input
                  type="text"
                  placeholder="Enter custom reason"
                  value={customReasons[index] || ""}
                  onChange={(e) => {
                    const updatedCustomReasons = [...customReasons];
                    updatedCustomReasons[index] = e.target.value;
                    setCustomReasons(updatedCustomReasons);
                  }}
                />
                <button onClick={() => handleAddCustomReason(index)}>
                  OK
                </button>
              </div>
    )}
            </td>
            {/* <td>
                <button
                  // onClick={() => handleSaveReason(index)}
                  className="save-button"
                >
                  Save
                </button>
              </td> */}

                    <button
                      onClick={() => handleSaveReason(index)}
                      className="save-button"
                    >
                      Save
                    </button>

            </>
            
          )}
        </tr>
      ))}
  </tbody>
</table>

        </div>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default OilAnalysisTableUser;
