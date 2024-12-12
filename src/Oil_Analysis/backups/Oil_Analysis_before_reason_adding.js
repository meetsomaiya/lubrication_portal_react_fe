import React, { useEffect, useState } from 'react';
import './Oil_Analysis.css';
import { BASE_URL } from '../config'
 
// Import the FontAwesome library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import specific icons from the solid icon set
import { faFilter } from "@fortawesome/free-solid-svg-icons";
 
const OilAnalysisTable = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [orderData, setOrderData] = useState([]);
 
  const [originalData, setOriginalData] = useState(null); // To store the fetched data
 
  const [loading, setLoading] = useState(false); // To track loading state
  const [modalData, setModalData] = useState(null); // To store the fetched data
  const [showModal, setShowModal] = useState(false); // To control modal visibility
 
  const [clickedOrderType, setClickedOrderType] = useState('');
 
  const [isFilterModalOpen9963, setFilterModalOpen9963] = useState(false);
  const [filterColumn9963, setFilterColumn9963] = useState("");
  const [filterOptions9963, setFilterOptions9963] = useState([]);
  const [selectedFilters9963, setSelectedFilters9963] = useState({});
  const [originalFilterOptions9963, setOriginalFilterOptions9963] = useState([]);
 
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
 
  const [searchQuery9963, setSearchQuery9963] = useState('');
 
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
 
  const handleOpenFilterModal9963 = (column) => {
    const uniqueValues = [...new Set(modalData.map((row) => row[column]))].sort();
    setFilterColumn9963(column);
    setFilterOptions9963(uniqueValues);
    setOriginalFilterOptions9963(uniqueValues); // Save the original values for reset
    setSelectedFilters9963((prev) => ({
      ...prev,
      [column]: selectedFilters9963[column] || [],
    }));
    setFilterModalOpen9963(true);
  };

  const formatToTwoDecimals = (value) => {
    return Number(value).toFixed(2);
  };
 
 
  const handleSearchChange9963 = (event) => {
    const query = event.target.value;
    setSearchQuery9963(query);
 
    if (query === '') {
      // If search is cleared, reset to the original options
      setFilterOptions9963(originalFilterOptions9963);
    } else {
      // Filter the options based on the search query
      const filteredOptions = originalFilterOptions9963.filter(option =>
        option.toLowerCase().includes(query.toLowerCase())
      );
      setFilterOptions9963(filteredOptions);
    }
  };
 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
 
  const filteredOptions = searchQuery9963
    ? filterOptions9963.filter((option) =>
        option.toLowerCase().includes(searchQuery9963.toLowerCase())
      )
    : filterOptions9963;
 
  const handleCheckboxChange9963 = (option) => {
    setSelectedFilters9963((prev) => ({
      ...prev,
      [filterColumn9963]: prev[filterColumn9963]?.includes(option)
        ? prev[filterColumn9963].filter((item) => item !== option)
        : [...(prev[filterColumn9963] || []), option],
    }));
  };
 
  const applyFilters9963 = () => {
    let filteredData = modalData;
    Object.keys(selectedFilters9963).forEach((column) => {
      if (selectedFilters9963[column].length > 0) {
        filteredData = filteredData.filter((row) =>
          selectedFilters9963[column].includes(row[column])
        );
      }
    });
    setModalData(filteredData);
    setFilterModalOpen9963(false);
  };
 
  const resetFilters9963 = () => {
    setSelectedFilters9963({});
    setSearchQuery9963(''); // Clear the search query
    setFilterOptions9963(originalFilterOptions9963); // Reset options to original
    setModalData(originalData); // Reset the data to original if needed
    setFilterModalOpen9963(false);
  };
 
 
    // // Helper function to format values to 2 decimal places
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
  setClickedOrderType(orderType); // Track the clicked order type
 
  if (!orderTypeApiMap[orderType]) {
    console.log(`No API endpoint configured for order type: ${orderType}`);
    return;
  }
 
  if (!selectedYear) {
    alert('Please select a financial year.');
    return;
  }
 
  const apiEndpoint = orderTypeApiMap[orderType];
  const url = `${BASE_URL}/api/${apiEndpoint}?order_type=${encodeURIComponent(orderType)}&financial_year=${encodeURIComponent(selectedYear)}`;
 
  setLoading(true);
 
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setModalData(data);
      setOriginalData(data); // Save data to state
      setShowModal(true);
    } else {
      console.error('API request failed');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
 
const handleSegregatedFileDownload = async () => {
 
  // Check if a financial year is selected
  if (!selectedFinancialYear) {
      alert("Please select a financial year.");
      return;
  }
 
  setLoading(true);  // Show preloader
 
  try {
      // Prepare query parameters with the selected financial year
      const queryParams = new URLSearchParams({ financialYear: selectedFinancialYear }).toString();
 
      // Fetch the file from the backend API
      // const response = await fetch(`http://localhost:224/api/download_segregated_oil_analysis_file?${queryParams}`, {
        const response = await fetch(`${BASE_URL}/api/download_segregated_oil_analysis_file?${queryParams}`, {
          method: 'GET',
      });
 
      // Check if the response is successful
      if (!response.ok) {
          throw new Error('Failed to fetch the file');
      }
 
      // Convert the response to a blob
      const blob = await response.blob();
 
      // Create an object URL for the blob
      const url = window.URL.createObjectURL(blob);
 
      // Create an anchor element for the download link
      const a = document.createElement('a');
      a.href = url;
 
      // Set the default filename for the downloaded file
      a.download = `segregated_file_${selectedFinancialYear}.xlsx`;
 
      // Append the anchor element to the document body and simulate a click to trigger download
      document.body.appendChild(a);
      a.click();
 
      // Clean up: remove the anchor and revoke the object URL
      a.remove();
      window.URL.revokeObjectURL(url);
  } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again later.');
  } finally {
      setLoading(false);  // Hide preloader when download finishes (success or failure)
  }
};
 
 
// The function to handle the download request with selected financial year
const handleConsolidatedFileDownload = () => {
  // Check if a financial year is selected
  if (!selectedFinancialYear) {
      alert("Please select a financial year.");
      return;
  }
 
  // Show preloader
  setLoading(true);
 
  try {
      // Prepare query parameters with the selected financial year
      const queryParams = new URLSearchParams({ financialYear: selectedFinancialYear }).toString();
     
      // Make the AJAX request
      // fetch(`http://localhost:224/api/download_consolidated_file?${queryParams}`, {
        fetch(`${BASE_URL}/api/download_consolidated_file?${queryParams}`, {
          method: 'GET', // or 'POST' depending on the server's requirement
          headers: {
              'Content-Type': 'application/json',
              // Include any necessary headers like authorization, if needed
              // 'Authorization': 'Bearer token_here',
          },
      })
      .then(response => {
          if (response.ok) {
              return response.blob(); // Process the file blob
          } else {
              throw new Error('Failed to download the file');
          }
      })
      .then(blob => {
          // Create a link element to trigger file download
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob); // Create an object URL for the file blob
          link.download = 'consolidated_file.xlsx'; // Set default file name
          document.body.appendChild(link);
          link.click(); // Trigger download
          document.body.removeChild(link); // Clean up the link element
      })
      .catch(error => {
          // Handle errors
          console.error('Error downloading the file:', error);
      })
      .finally(() => {
          // Hide preloader once the request is finished
          setLoading(false);
      });
  } catch (error) {
      // Handle any unexpected errors
      console.error('Error:', error);
      setLoading(false);
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
                    value={selectedFinancialYear}
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
                        setSelectedFinancialYear(event.target.value);
                    }}
                >
      <option value="">Select Financial Year</option>
      {financialYears.map((year, index) => (
        <option key={index} value={year}>{year}</option>
      ))}
    </select>
     
    <button id="downloadSegregatedFile997" onClick={handleSegregatedFileDownload}>
                    Download Segregated File
                </button>
    <button id="downloadConsolidatedFile997"onClick={handleConsolidatedFileDownload}>Download Consolidated File</button>
     
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
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
                  <th>Issue L</th>
                  <th>Return L</th>
                  <th>Percentage %</th>
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
                {[
                  "Order No",
                  "Function Loc",
                  "Issue",
                  "Return",
                  "Return Percentage",
                  "Plant",
                  "State",
                  "Area",
                  "Site",
                  "Material",
                  "Storage Location",
                  "Move Type",
                  "Material Document",
                  "Description",
                  "Val Type",
                  "Posting Date",
                  "Entry Date",
                  "Quantity",
                  "Order",
                  "Order Type",
                  "Component",
                  "WTG Model",
                  "Current Oil Change Date",
                  "State Engineering Head",
                  "Area Incharge",
                  "Site Incharge",
                  "State PMO",
                  "Order Status",
                ].map((header, index) => (
                  <th key={index}>
                    {header}{" "}
                    <FontAwesomeIcon
                      icon={faFilter}
                      className="filter-icon-9963"
                      onClick={() => handleOpenFilterModal9963(header)}
                    />
                  </th>
                ))}
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
              {/* <td>{item["Return Percentage"]}</td> */}
              <td>{formatToTwoDecimals(item["Return Percentage"])}</td>
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
     
    {isFilterModalOpen9963 && (
            <div className="filter-modal-9963">
              <div className="filter-modal-content-9963">
                <h3>Filter by {filterColumn9963}</h3>
     
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search options..."
              value={searchQuery9963}
              onChange={handleSearchChange9963}
              className="search-bar"
            />
                <div className="filter-options-9963">
                  {filterOptions9963.map((option, index) => (
                    <div key={index} className="filter-option-9963">
                      <input
                        type="checkbox"
                        id={`filter-checkbox-9963-${index}`}
                        checked={
                          selectedFilters9963[filterColumn9963]?.includes(option) ||
                          false
                        }
                        onChange={() => handleCheckboxChange9963(option)}
                      />
                      <label htmlFor={`filter-checkbox-9963-${index}`}>
                        {option || "(Empty)"}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="filter-buttons-9963">
                  <button onClick={applyFilters9963} className="apply-button-9963">
                    Apply Filters
                  </button>
                  <button onClick={resetFilters9963} className="reset-button-9963">
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
     
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
     