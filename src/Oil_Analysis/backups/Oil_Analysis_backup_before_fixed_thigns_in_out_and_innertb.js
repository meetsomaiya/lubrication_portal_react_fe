import React, { useEffect, useState } from 'react';
import './Oil_Analysis.css';

const OilAnalysisTable = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [orderData, setOrderData] = useState([]);

  const [loading, setLoading] = useState(false); // To track loading state
  const [modalData, setModalData] = useState(null); // To store the fetched data
  const [showModal, setShowModal] = useState(false); // To control modal visibility


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
  
  const fetchDataForPDOilChange = async (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  
    if (year) {
      // Construct the URL with encoded year
      const url = `http://localhost:224/api/fetch_pd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
      const url = `http://localhost:224/api/fetch_gb_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
      const url = `http://localhost:224/api/fetch_fc_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
      const url = `http://localhost:224/api/fetch_gb_topup_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
      const url = `http://localhost:224/api/fetch_fc_topup_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
      const url = `http://localhost:224/api/fetch_ydpd_topup_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
      const url = `http://localhost:224/api/fetch_dispute_state_wise_data?year=${encodeURIComponent(year)}`;
      
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
  // Helper function to format values to 2 decimal places
  const formatValue = (value) => {
    const number = parseFloat(value);
    return Number.isNaN(number) ? "0.00" : number.toFixed(2);
  };
  

  const fetchDataForPendingTeco = async (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  
    if (year) {
      // Construct the URL with encoded year
      const url = `http://localhost:224/api/fetch_pending_teco_state_wise_data?year=${encodeURIComponent(year)}`;
      
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

// Mapping of order types to their respective API endpoints
const orderTypeApiMap = {
  'FC_OIL_CHANGE ORDER': 'fetch_fc_oil_chg_data',
  'GB_OIL_CHANGE ORDER': 'fetch_gb_oil_chg_data',
  'YD_OIL_CHG_ORDER': 'fetch_yd_oil_chg_data',
  'PD_OIL_CHG_ORDER': 'fetch_pd_oil_chg_data',
  'gb_topup': 'fetch_gb_topup_data',
  'fc_topup': 'fetch_fc_topup_data',
  'ydpd_topup': 'fetch_ydpd_topup_data',
  'dispute': 'fetch_dispute_data',
  'Pending Teco': 'fetch_pending_teco_data',
  // Add more order types and their corresponding endpoints as needed
};

const handleOrderTypeClick = async (orderType) => {
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
  const url = `http://localhost:224/api/${apiEndpoint}?order_type=${encodeURIComponent(orderType)}&financial_year=${encodeURIComponent(selectedYear)}`;

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


        // useEffect to log the modalData whenever it changes
  useEffect(() => {
    if (modalData) {
      console.log('Updated modalData:', modalData);
    }
  }, [modalData]); // This effect will run every time modalData changes
  

  return (
    <div className="container997">
      <div className="buttonContainer997">
        {/* <button id="downloadSegregatedFile997">Download Segregated File</button>
        <button id="downloadConsolidatedFile997">Download Consolidated File</button> */}
      </div>

      <div className="dropdownContainer997">
        {/* <label htmlFor="financialYear997">Select Financial Year:</label> */}
 <select
  id="financialYear997"
  value={selectedYear}
  onChange={(event) => {
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

<button id="downloadSegregatedFile997">Download Segregated File</button>
<button id="downloadConsolidatedFile997">Download Consolidated File</button>

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
                {/* <td className="orderTypeLink997">
                  <a href="#">{order.type}</a>
                </td> */}
                              <td className="orderTypeLink997">
                {/* Order Type Link that calls handleOrderTypeClick when clicked */}
                <a href="#" onClick={() => handleOrderTypeClick(order.type)}>
                  {order.type}
                </a>
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

              {/* Preloader */}
      {loading && (
        <div className="preloader">
          <div className="circle"></div>
        </div>
      )}

{/* Modal */}
{showModal && (
  <div className="modal-7997">
    <div className="modal-content-7997">
      <button onClick={() => setShowModal(false)}>Close</button>
      {modalData && (
        <div className="data-table-wrapper-7997">
         <table className="data-table-7997" id='tbl7997'>
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
      </tr>
    </thead>
    <tbody>
      {modalData && modalData.map((item, index) => (
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

export default OilAnalysisTable;
