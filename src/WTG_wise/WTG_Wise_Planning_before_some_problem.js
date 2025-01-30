import React, { useState, useEffect, useRef } from 'react';
import './WTG_Wise_Planning.css';
import filterIcon from '../assets/filter.png';
import cancelIcon from '../assets/close-line-icon.png';
import clearIcon from '../assets/filter-remove-icon.png';
import excel_iconpng from '../assets/excel - Copy.jpg';
// import WTG_Wise_Planning from '../WTG_wise/WTG_Wise_Planning';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';

import { BASE_URL } from '../config'

const createData = (FuntionLoc, plant, orderno, status, startdate, enddate, ordertype, PMstart, delay, reason) => {
  return { FuntionLoc, plant, orderno, status, startdate, enddate, ordertype, PMstart, delay, reason };
};

const initialRows = [
  createData('SWSPAL-SC2-RS102-P112', '4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 100, ''),
  createData('SWSPAL-SC2-RS102-P145', '4447', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 10, ''),
  createData('SWSPAL-SC2-RS102-P167', '4448', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 50, ''),
  createData('SWSPAL-SC2-RS102-P189', '4444', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 44, ''),
  createData('SWSPAL-SC2-RS102-P112', '44498', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 60, ''),
  createData('SWSPAL-SC2-RS102-P112', '44423', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 2, ''),
  createData('SWSPAL-SC2-RS102-P112', '44434', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 14, ''),
  createData('SWSPAL-SC2-RS102-P112', '44434', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 100, ''),
  createData('SWSPAL-SC2-RS102-P112', '44456', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 43, ''),
  // Add more rows as needed...
];

const getDelayChip = (delay) => {
  let chipClass = '';
  if (delay <= 7) {
    chipClass = 'chip-success';
  } else if (delay > 7 && delay <= 30) {
    chipClass = 'chip-warning';
  } else if (delay > 30 && delay <= 60) {
    chipClass = 'chip-warning-light';
  } else if (delay > 60 && delay <= 90) {
    chipClass = 'chip-warning-dark';
  } else {
    chipClass = 'chip-error';
  }
  return <span className={`chip ${chipClass}`}>{delay}</span>;
};

const WTG_Wise_Planning = () => {

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
      adminId: cookies.adminId || 'Not Set',
      access: cookies.access || 'Not Set',
      adminEmail: cookies.adminEmail || 'Not Set',
      userId: cookies.userId || 'Not Set',
      domain_id: cookies.adminDomain || 'Not Set',
      state: cookies.state || 'Not Set',
      area: cookies.area || 'Not Set',
      site: cookies.site || 'Not Set',
      email: cookies.email || 'Not Set',
      pathname: pathname,  // Add the pathname to the data
      entryTime: entryTime, // Include entry time (when user stepped in)
      exitTime: exitTime,   // Include exit time (when user leaves)
    };
  
    console.log('Sending the following cookie data to backend:', cookieData);
  
    try {
      // Send data to the backend's heartbeat API
      // const response = await fetch('http://localhost:224/api/heartbeat', {
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

                const checkAdminIdAndRedirect = () => {
                  const getCookie = (name) => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                  };
                
                  const adminId = getCookie('adminId'); // Retrieve the adminId from cookies
                
                  if (!adminId) {
                    // If adminId is not found, redirect to the default route
                    window.location.href = '/'; // Redirect to the home page or default route
                  }
                };
  
                useEffect(() => {
                  checkAdminIdAndRedirect(); // Check adminId and redirect if not found
                }, []); // Empty dependency array to ensure this runs only once on mount
  
  const [totalRows, setTotalRows] = useState(0);
  
  const [rows, setRows] = useState(initialRows);
  const [selectedFunctionLoc, setSelectedFunctionLoc] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalData, setModalData] = useState({ show: false, orderNo: '', functionLoc: '', reason: '' });
  const [showFunctionLocDropdown, setShowFunctionLocDropdown] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [showOrderNoDropdown, setShowOrderNoDropdown] = useState(false);
  const [filteredCount, setFilteredCount] = useState(rows.length);

  const [options, setOptions] = useState([]); // State to hold dropdown options

  const [selectedOption1, setSelectedOption1] = useState('Select');
  const [selectedOption2, setSelectedOption2] = useState('Select');
  const [selectedOption3, setSelectedOption3] = useState('Select');
  const [selectedOption4, setSelectedOption4] = useState('Select');

  const [states, setStates] = useState([]); // State to hold the fetched states

  const [areas, setAreas] = useState([]); // State to hold the fetched areas

  const [sites, setSites] = useState([]); // State to hold the fetched sites

  // const [totalPercentage, setTotalPercentage] = useState(0); // Initialize state for total percentage
  const [totalCount, setTotalCount] = useState(0); // Initialize state for total count

  const [totalData, setTotalData] = useState([]); // State to hold the fetched sites

    const [totalPercentage, setTotalPercentage] = useState(100);
  const [plannedPercentage, setPlannedPercentage] = useState(100);
  const [openPercentage, setOpenPercentage] = useState(0);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [gracePercentage, setGracePercentage] = useState(0);

  // const [selectedCard, setSelectedCard] = useState(null);

    // Initialize selectedCard state to 'Total'
    const [selectedCard, setSelectedCard] = useState('Total');

     // Define state for planned count
     const [plannedCount, setPlannedCount] = useState(null);

     const [openCount, setOpenCount] = useState(null);

     const [completedCount, setCompletedCount] = useState(null);

     const [outofGraceCount, setOutOfGraceCount] = useState(null);

     const [stateWiseCount, setStateWiseCount] = useState({}); // Ensure it's an empty object

    //  const [plannedData, setPlannedData] = useState(null);

    const [monthRange, setMonthRange] = useState('');


    const [isTotalPlannedCountFetched, setTotalPlannedCountFetched] = useState(false);
const [isTotalWtgCountFetched, setTotalWtgCountFetched] = useState(false);
const [isOpenStatusCountFetched, setOpenStatusCountFetched] = useState(false);
const [isCompletedStatusCountFetched, setCompletedStatusCountFetched] = useState(false);
const [isOutOfGraceCountFetched, setOutOfGraceCountFetched] = useState(false);
const [isTotalStateWiseCountFetched, setTotalStateWiseCountFetched] = useState(false);

  // State to hold selected filter values
  const [selectedFunctionLoc991, setSelectedFunctionLoc991] = useState([]);
  const [selectedPlant991, setSelectedPlant991] = useState([]);
  const [selectedOrderNo991, setSelectedOrderNo991] = useState([]);

  // Search term for each filter
  const [searchTermFunctionLoc991, setSearchTermFunctionLoc991] = useState('');
  const [searchTermPlant991, setSearchTermPlant991] = useState('');
  const [searchTermOrderNo991, setSearchTermOrderNo991] = useState('');

    // Function to handle changes in the search input
    const handleSearchChange = (e, filterType) => {
      const value = e.target.value;
      if (filterType === 'FunctionLoc') {
        setSearchTermFunctionLoc991(value);
      } else if (filterType === 'Plant') {
        setSearchTermPlant991(value);
      } else if (filterType === 'OrderNo') {
        setSearchTermOrderNo991(value);
      }
    };


  
    // Function to handle checkbox changes
    const handleCheckboxChange = (e, filterType) => {
      const value = e.target.value;
      let newSelected = [];
  
      if (filterType === 'FunctionLoc') {
        if (e.target.checked) {
          newSelected = [...selectedFunctionLoc991, value];
        } else {
          newSelected = selectedFunctionLoc991.filter(item => item !== value);
        }
        setSelectedFunctionLoc991(newSelected);
      } else if (filterType === 'Plant') {
        if (e.target.checked) {
          newSelected = [...selectedPlant991, value];
        } else {
          newSelected = selectedPlant991.filter(item => item !== value);
        }
        setSelectedPlant991(newSelected);
      } else if (filterType === 'OrderNo') {
        if (e.target.checked) {
          newSelected = [...selectedOrderNo991, value];
        } else {
          newSelected = selectedOrderNo991.filter(item => item !== value);
        }
        setSelectedOrderNo991(newSelected);
      }
    };
  
    // Filtered data based on selected filters
    const filteredData = totalData.filter(row => {
      const matchesFunctionLoc = selectedFunctionLoc991.length === 0 || selectedFunctionLoc991.includes(row.FUNCT_LOC);
      const matchesPlant = selectedPlant991.length === 0 || selectedPlant991.includes(row.PLANT);
      const matchesOrderNo = selectedOrderNo991.length === 0 || selectedOrderNo991.includes(row.CRM_ORDERH);
  
      return matchesFunctionLoc && matchesPlant && matchesOrderNo;
    });
  
    // Function to fetch unique options for filtering from data
    const getUniqueValues = (key) => {
      return [...new Set(totalData.map(row => row[key]))];
    };

          // Update totalRows whenever filteredData changes
  useEffect(() => {
    setTotalRows(filteredData.length);
  }, [filteredData]);


      // Calculate the dates for two years back and two years ahead
      const [twoYearsBack, setTwoYearsBack] = useState(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 2);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    });

    const [twoYearsAhead, setTwoYearsAhead] = useState(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 2);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    });

    // Initialize state for date inputs with different names
    const [startDate, setStartDate] = useState(twoYearsBack);
    const [endDate, setEndDate] = useState(twoYearsAhead);

        // Handlers for date inputs
        const handleStartDateChange = (event) => {
          setStartDate(event.target.value);
      };
  
      const handleEndDateChange = (event) => {
          setEndDate(event.target.value);
      };

      const handleCardClick = (cardName) => {
        setSelectedCard(cardName); // Set the selected card name on click
      };

          // New function to call both fetch functions
    const handleButtonClick = () => {
      fetchTotalPlannedCount();
      fetchTotalWtgCount();
      fetchOpenStatusCount();
      fetchCompletedStatusCount();
      fetchOutOfGraceCount();
      fetchTotalStateWiseCount();


      handleCardClick('Total');  
  };

       // Function to fetch the total WTG count
       const fetchTotalWtgCount = async () => {
        // const url = new URL('http://localhost:224/api/get_total_wtg_count');
        const url = new URL(`${BASE_URL}/api/get_total_wtg_count`);
        const params = {
            orderType: selectedOption1,
            fromDate: startDate, // Use startDate
            toDate: endDate,     // Use endDate
            state: selectedOption2,
            area: selectedOption3,
            site: selectedOption4,
        };
        
        // Add params to URL
        Object.keys(params).forEach(key => {
            if (params[key] !== 'Select' && params[key] !== '') {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Fetched total WTG count data:', data);

            // Assuming the total count is available in the `total_count` property of the response
            setTotalCount(data.total_count || 0); // Update state with fetched total count
            setTotalPercentage(100); // Set fixed percentage to 100

                  // Update totalData with the fetched data
      setTotalData(data.data || []); // Ensure data is an array

      setTotalWtgCountFetched(true); // Mark as fetched
        } catch (error) {
            console.error('Error fetching total WTG count data:', error);
        }
    };

    // // Call fetchTotalWtgCount twice on page load
    // useEffect(() => {
    //     fetchTotalWtgCount(); // First call with initial values
    //     // Optionally, you can call it again with different parameters or state updates if needed
    //     fetchTotalWtgCount(); // Uncomment if you want to call it again
    // }, [startDate, endDate, selectedOption1, selectedOption2, selectedOption3, selectedOption4]);

  //   useEffect(() => {
  //     fetchTotalWtgCount(); // Call only once on page load
  // }, []); // Empty dependency array to ensure this only runs once

    // Define function to fetch total planned count
    const fetchTotalPlannedCount = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };

      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      // const url = `http://localhost:224/api/get_total_planned_wtg_count?${queryString}`;
      const url = `${BASE_URL}/api/get_total_planned_wtg_count?${queryString}`;

      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          setPlannedCount(data.totalPlannedCount);

          setTotalPlannedCountFetched(true); // Mark as fetched
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };

  const fetchTotalStateWiseCount = async () => {
    const params = {
        orderType: selectedOption1,   // Replace with actual selected option or state variable
        fromDate: startDate,          // Replace with actual startDate variable
        toDate: endDate,              // Replace with actual endDate variable
        state: selectedOption2,       // Replace with actual selected option for state
        area: selectedOption3,        // Replace with actual selected option for area
        site: selectedOption4,        // Replace with actual selected option for site
    };

    // Convert params object to URL search parameters
    const queryString = new URLSearchParams(params).toString();
    // const url = `http://localhost:224/api/get_total_wtg_count_based_on_state?${queryString}`;
    const url = `${BASE_URL}/api/get_total_wtg_count_based_on_state?${queryString}`;


    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data fetched from API:', data); // Log the fetched data
        // Set the planned count from the API response
        setStateWiseCount(data.stateWiseCounts);

        setTotalStateWiseCountFetched(true); // Mark as fetched
    } catch (error) {
        console.error('Error fetching total planned count:', error);
    }
};

const fetchTotalPlannedStateWiseCount = async () => {
  const params = {
      orderType: selectedOption1,   // Replace with actual selected option or state variable
      fromDate: startDate,          // Replace with actual startDate variable
      toDate: endDate,              // Replace with actual endDate variable
      state: selectedOption2,       // Replace with actual selected option for state
      area: selectedOption3,        // Replace with actual selected option for area
      site: selectedOption4,        // Replace with actual selected option for site
  };

  // Convert params object to URL search parameters
  const queryString = new URLSearchParams(params).toString();
  // const url = `http://localhost:224/api/get_total_wtg_count_based_on_state?${queryString}`;
  const url = `${BASE_URL}/api/get_planned_wtg_count_based_on_state?${queryString}`;


  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data fetched from API:', data); // Log the fetched data
      // Set the planned count from the API response
      setStateWiseCount(data.stateWiseCounts);

      setTotalStateWiseCountFetched(true); // Mark as fetched
  } catch (error) {
      console.error('Error fetching total planned count:', error);
  }
};

const fetchPlanStateWiseCount = async () => {
  const params = {
      orderType: selectedOption1,   // Replace with actual selected option or state variable
      fromDate: startDate,          // Replace with actual startDate variable
      toDate: endDate,              // Replace with actual endDate variable
      state: selectedOption2,       // Replace with actual selected option for state
      area: selectedOption3,        // Replace with actual selected option for area
      site: selectedOption4,        // Replace with actual selected option for site
  };

  // Convert params object to URL search parameters
  const queryString = new URLSearchParams(params).toString();
  // const url = `http://localhost:224/api/get_total_planned_wtg_count?${queryString}`;
  const url = `${BASE_URL}/api/get_total_planned_wtg_count?${queryString}`;


  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data fetched from API:', data); // Log the fetched data
      // Set the planned count from the API response
      setStateWiseCount(data.stateWiseCounts);
  } catch (error) {
      console.error('Error fetching total planned count:', error);
  }
};

const fetchTotalOpenStateWiseCount = async () => {
  const params = {
      orderType: selectedOption1,   // Replace with actual selected option or state variable
      fromDate: startDate,          // Replace with actual startDate variable
      toDate: endDate,              // Replace with actual endDate variable
      state: selectedOption2,       // Replace with actual selected option for state
      area: selectedOption3,        // Replace with actual selected option for area
      site: selectedOption4,        // Replace with actual selected option for site
  };

  // Convert params object to URL search parameters
  const queryString = new URLSearchParams(params).toString();
  // const url = `http://localhost:224/api/get_total_wtg_count_based_on_state?${queryString}`;
  const url = `${BASE_URL}/api/get_open_wtg_count_based_on_state?${queryString}`;


  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data fetched from API:', data); // Log the fetched data
      // Set the planned count from the API response
      setStateWiseCount(data.stateWiseCounts);

      setTotalStateWiseCountFetched(true); // Mark as fetched
  } catch (error) {
      console.error('Error fetching total planned count:', error);
  }
};

const fetchTotalCompletedStateWiseCount = async () => {
  const params = {
      orderType: selectedOption1,   // Replace with actual selected option or state variable
      fromDate: startDate,          // Replace with actual startDate variable
      toDate: endDate,              // Replace with actual endDate variable
      state: selectedOption2,       // Replace with actual selected option for state
      area: selectedOption3,        // Replace with actual selected option for area
      site: selectedOption4,        // Replace with actual selected option for site
  };

  // Convert params object to URL search parameters
  const queryString = new URLSearchParams(params).toString();
  // const url = `http://localhost:224/api/get_total_wtg_count_based_on_state?${queryString}`;
  const url = `${BASE_URL}/api/get_completed_wtg_count_based_on_state?${queryString}`;


  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data fetched from API:', data); // Log the fetched data
      // Set the planned count from the API response
      setStateWiseCount(data.stateWiseCounts);

      setTotalStateWiseCountFetched(true); // Mark as fetched
  } catch (error) {
      console.error('Error fetching total planned count:', error);
  }
};

const fetchTotalOutOfGraceStateWiseCount = async () => {
  const params = {
      orderType: selectedOption1,   // Replace with actual selected option or state variable
      fromDate: startDate,          // Replace with actual startDate variable
      toDate: endDate,              // Replace with actual endDate variable
      state: selectedOption2,       // Replace with actual selected option for state
      area: selectedOption3,        // Replace with actual selected option for area
      site: selectedOption4,        // Replace with actual selected option for site
  };

  // Convert params object to URL search parameters
  const queryString = new URLSearchParams(params).toString();
  // const url = `http://localhost:224/api/get_total_wtg_count_based_on_state?${queryString}`;
  const url = `${BASE_URL}/api/get_completed_out_of_grace_wtg_count_based_on_state?${queryString}`;


  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data fetched from API:', data); // Log the fetched data
      // Set the planned count from the API response
      setStateWiseCount(data.stateWiseCounts);

      setTotalStateWiseCountFetched(true); // Mark as fetched
  } catch (error) {
      console.error('Error fetching total planned count:', error);
  }
};

    // Define function to fetch total planned count
    const fetchOpenStatusCount = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };

      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      //const url = `http://localhost:224/api/get_total_open_status_wtg_count?${queryString}`;

      const url = `${BASE_URL}/api/get_total_open_status_wtg_count?${queryString}`;


      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          setOpenCount(data.totalOpenStatusCount);

          setOpenStatusCountFetched(true); // Mark as fetched
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };

  const fetchOpenStateWiseCount = async () => {
    const params = {
        orderType: selectedOption1,   // Replace with actual selected option or state variable
        fromDate: startDate,          // Replace with actual startDate variable
        toDate: endDate,              // Replace with actual endDate variable
        state: selectedOption2,       // Replace with actual selected option for state
        area: selectedOption3,        // Replace with actual selected option for area
        site: selectedOption4,        // Replace with actual selected option for site
    };
  
    // Convert params object to URL search parameters
    const queryString = new URLSearchParams(params).toString();
   // const url = `http://localhost:224/api/get_total_open_status_wtg_count?${queryString}`;

     const url = `${BASE_URL}/api/get_total_open_status_wtg_count?${queryString}`;

  
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        console.log('Data fetched from API:', data); // Log the fetched data
        // Set the planned count from the API response
        setStateWiseCount(data.stateWiseCounts);
    } catch (error) {
        console.error('Error fetching total planned count:', error);
    }
  };


      // Define function to fetch total planned count
      const fetchCompletedStatusCount = async () => {
        const params = {
            orderType: selectedOption1,   // Replace with actual selected option or state variable
            fromDate: startDate,          // Replace with actual startDate variable
            toDate: endDate,              // Replace with actual endDate variable
            state: selectedOption2,       // Replace with actual selected option for state
            area: selectedOption3,        // Replace with actual selected option for area
            site: selectedOption4,        // Replace with actual selected option for site
        };
  
        // Convert params object to URL search parameters
        const queryString = new URLSearchParams(params).toString();
        // const url = `http://localhost:224/api/get_completed_count?${queryString}`;

        const url = `${BASE_URL}/api/get_completed_count?${queryString}`;

  
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
  
            const data = await response.json();
            console.log('Data fetched from API:', data); // Log the fetched data
            // Set the planned count from the API response
            setCompletedCount(data.totalCompletedCount);

            setCompletedStatusCountFetched(true); // Mark as fetched
        } catch (error) {
            console.error('Error fetching total planned count:', error);
        }
    };

    const fetchCompletedStateWiseCount = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };
    
      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      // const url = `http://localhost:224/api/get_completed_count?${queryString}`;
      const url = `${BASE_URL}/api/get_completed_count?${queryString}`;

    
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          console.log('Data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          setStateWiseCount(data.stateWiseCounts);
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
    };

       // Define function to fetch total planned count
       const fetchOutOfGraceCount = async () => {
        const params = {
            orderType: selectedOption1,   // Replace with actual selected option or state variable
            fromDate: startDate,          // Replace with actual startDate variable
            toDate: endDate,              // Replace with actual endDate variable
            state: selectedOption2,       // Replace with actual selected option for state
            area: selectedOption3,        // Replace with actual selected option for area
            site: selectedOption4,        // Replace with actual selected option for site
        };
  
        // Convert params object to URL search parameters
        const queryString = new URLSearchParams(params).toString();
        // const url = `http://localhost:224/api/get_completed_out_of_grace_count?${queryString}`;

        const url = `${BASE_URL}/api/get_completed_out_of_grace_count?${queryString}`;

  
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
  
            const data = await response.json();
            console.log('Data fetched from API:', data); // Log the fetched data
            // Set the planned count from the API response
            setOutOfGraceCount(data.dayDifferenceCount);

            setOutOfGraceCountFetched(true); // Mark as fetched
        } catch (error) {
            console.error('Error fetching total planned count:', error);
        }
    };

    const fetchOutOfGraceStateWiseCount = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };
    
      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      // const url = `http://localhost:224/api/get_completed_out_of_grace_count?${queryString}`;

      const url = `${BASE_URL}/api/get_completed_out_of_grace_count?${queryString}`;

    
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          console.log('Data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          setStateWiseCount(data.stateWiseCounts);
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
    };


    // Define function to fetch total planned count
    const fetchTotalPlannedData = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };

      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      // const url = `http://localhost:224/api/get_total_wtg_planned?${queryString}`;

      const url = `${BASE_URL}/api/get_total_wtg_planned?${queryString}`;


      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data of planned data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          // setPlannedData(data.totalPlannedCount);
          setTotalData(data || []); // Ensure data is an array
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };

     // Define function to fetch total planned count
     const fetchTotalOpenData = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };

      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
     // const url = `http://localhost:224/api/get_open_status_wtg_data?${queryString}`;

      const url = `${BASE_URL}/api/get_open_status_wtg_data?${queryString}`;


      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data of open data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          // setPlannedData(data.totalPlannedCount);
          setTotalData(data || []); // Ensure data is an array
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };

     // Define function to fetch total planned count
     const fetchTotalCompletedData = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };

      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      // const url = `http://localhost:224/api/get_completed_wtg_data?${queryString}`;
      const url = `${BASE_URL}/api/get_completed_wtg_data?${queryString}`;


      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data of planned data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          // setPlannedData(data.totalPlannedCount);
          setTotalData(data || []); // Ensure data is an array
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };

     // Define function to fetch total planned count
     const fetchTotalCompletedOutOfGraceData = async () => {
      const params = {
          orderType: selectedOption1,   // Replace with actual selected option or state variable
          fromDate: startDate,          // Replace with actual startDate variable
          toDate: endDate,              // Replace with actual endDate variable
          state: selectedOption2,       // Replace with actual selected option for state
          area: selectedOption3,        // Replace with actual selected option for area
          site: selectedOption4,        // Replace with actual selected option for site
      };

      // Convert params object to URL search parameters
      const queryString = new URLSearchParams(params).toString();
      // const url = `http://localhost:224/api/get_completed_out_of_grace_data?${queryString}`;

      const url = `${BASE_URL}/api/get_completed_out_of_grace_data?${queryString}`;

      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data of planned data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          // setPlannedData(data.totalPlannedCount);
          setTotalData(data || []); // Ensure data is an array
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };


  




  useEffect(() => {
    // Fetch data from the API on component mount
    const fetchOptions = async () => {
        try {
            // const response = await fetch('http://localhost:224/api/fetch_type_order_for_wtg_wise_planning');
            const response = await fetch(`${BASE_URL}/api/fetch_type_order_for_wtg_wise_planning`);

            const data = await response.json();
            // Assuming the response data is an array of objects with a property 'type' to display
            setOptions(data); 
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchOptions();
}, []);

    // Fetching states data from the API
    const fetchStates = async () => {
      try {
          // const response = await fetch('http://localhost:224/api/get_states');

          const response = await fetch(`${BASE_URL}/api/get_states`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json(); // Parse the JSON response
          setStates(data); // Update state with the fetched states
      } catch (error) {
          console.error('Error fetching states:', error);
      }
  };

  // Use useEffect to fetch states when the component mounts
  useEffect(() => {
      fetchStates(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount


  const handleSelectChangeFunctionLoc = (event) => {
    const value = event.target.value;
    setSelectedFunctionLoc((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleSelectChangePlant = (event) => {
    const value = event.target.value;
    setSelectedPlant((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleSelectChangeOrderNo = (event) => {
    const value = event.target.value;
    setSelectedOrderNo((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleSelectChange1 = (event) => {
    const selectedValue = event.target.value;  // Define the selected value

    setSelectedOption1(selectedValue);  // Update the state for selected option

    // Determine the month range based on the selected option
    if (selectedValue.startsWith("Q1")) {
        setMonthRange("April - June");
    } else if (selectedValue.startsWith("Q2")) {
        setMonthRange("July - September");
    } else if (selectedValue.startsWith("Q3")) {
        setMonthRange("October - December");
    } else if (selectedValue.startsWith("Q4")) {
        setMonthRange("January - March");
    } else if (selectedValue.startsWith("HALF1")) {
        setMonthRange("April - September");
    } else if (selectedValue.startsWith("HALF2")) {
        setMonthRange("October - March");
    } else {
        setMonthRange('');  // Default if none of the above matches
    }

    // Optionally, you can call additional functions here
    // handleCardClick('Total');  // Call the Total card function
    // fetchTotalWtgCount();      // Example fetch function
};



  // const handleSelectChange2 = (event) => {
  //   setSelectedOption2(event.target.value);
  // };

  

      // Function to handle dropdown selection change for states
      const handleSelectChange2 = async (event) => {
        const selectedState = event.target.value;
        setSelectedOption2(selectedState);
        setSites([]); 
        // fetchTotalWtgCount();
        if (selectedState !== 'Select') {
            await fetchAreas(selectedState); // Fetch areas when a state is selected
        } else {
            setAreas([]); // Reset areas if 'Select' is chosen
            setSites([]);  // Reset sites if 'Select' is chosen
        }
    };

     // Fetching areas data based on the selected state
     const fetchAreas = async (state) => {
      try {
          // const response = await fetch(`http://localhost:224/api/get_areas?state=${state}`);
          const response = await fetch(`${BASE_URL}/api/get_areas?state=${state}`);

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json(); // Parse the JSON response
          setAreas(data); // Update state with the fetched areas
      } catch (error) {
          console.error('Error fetching areas:', error);
      }
  };

  // Use useEffect to fetch states when the component mounts
  useEffect(() => {
      fetchStates(); // Call the fetch function for states
  }, []); // Empty dependency array means this effect runs once on mount

      // Fetch sites based on state and area
      const fetchSites = async (state, area) => {
        try {
            // const response = await fetch(`http://localhost:224/api/get_sites?state=${state}&area=${area}`);
            const response = await fetch(`${BASE_URL}/api/get_sites?state=${state}&area=${area}`);

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSites(data);
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };

  // const handleSelectChange3 = (event) => {
  //   setSelectedOption3(event.target.value);
  // };

      // Handle area selection change
      const handleSelectChange3 = async (event) => {
        const selectedArea = event.target.value;
        setSelectedOption3(selectedArea);
        // fetchTotalWtgCount();
        if (selectedOption2 !== 'Select' && selectedArea !== 'Select') {
            await fetchSites(selectedOption2, selectedArea); 
        } else {
            setSites([]); 
        }
    };

  const handleSelectChange4 = (event) => {
    setSelectedOption4(event.target.value);
    // fetchTotalWtgCount();
  };

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
    // fetchTotalWtgCount();
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
    // fetchTotalWtgCount();
  };

  const openModal = (orderNo, functionLoc, reason) => {
    setModalData({ show: true, orderNo, functionLoc, reason });
  };

  const closeModal = () => {
    setModalData({ show: false, orderNo: '', functionLoc: '', reason: '' });
  };

  const handleReasonChange = (event) => {
    setModalData({ ...modalData, reason: event.target.value });
  };

  const handleSubmitReason = () => {
    // Update the reason in the rows array
    const updatedRows = rows.map(row =>
      row.orderno === modalData.orderNo && row.FuntionLoc === modalData.functionLoc
        ? { ...row, reason: modalData.reason }
        : row
    );

    // Update the state with the updated rows
    setRows(updatedRows);

    // Close the modal
    closeModal();
  };

  const filteredRows = rows.filter(row => {
    return (
      (selectedFunctionLoc.length === 0 || selectedFunctionLoc.includes(row.FuntionLoc)) &&
      (selectedPlant.length === 0 || selectedPlant.includes(row.plant)) &&
      (selectedOrderNo.length === 0 || selectedOrderNo.includes(row.orderno)) &&
      (selectedOption1 === 'Select' || row.ordertype.includes(selectedOption1)) &&
      (selectedOption2 === 'Select' || row.status.includes(selectedOption2)) &&
      (selectedOption3 === 'Select' || row.plant.includes(selectedOption3)) &&
      (selectedOption4 === 'Select' || row.site === selectedOption4) &&
      (!dateFrom || new Date(row.startdate) >= new Date(dateFrom)) &&
      (!dateTo || new Date(row.enddate) <= new Date(dateTo))
    );
  });

  useEffect(() => {
    setFilteredCount(filteredRows.length);
  }, [selectedFunctionLoc, selectedPlant, selectedOrderNo, selectedOption1, selectedOption2, selectedOption3, selectedOption4, dateFrom, dateTo]);

//   const handleDownload = () => {
//     // Mapping the filtered data to a format that can be used for Excel download
//     const dataForDownload = filteredData.map((row) => ({
//         FunctionalLocation: row.FUNCT_LOC,
//         Plant: row.PLANT,
//         OrderNo: row.CRM_ORDERH,
//         Status: row.ZTEXT1,
//         StartDate: row.ZACTSTDT,
//         EndDate: row.ZACTENDT,
//         OrderType: row.ZEXT_RNO,
//         PMStartDate: row.ZREQ_SDAT,
//         Reason: row.reason || 'N/A', // If there's no reason, display 'N/A'
//         Delays: getDelayChip(row.delay), // Assuming this function handles delay rendering
//     }));

//     // Convert the data to an Excel sheet
//     const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Lubrication Report");

//     // Write the workbook to a buffer
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

//     // Trigger the download
//     saveAs(dataBlob, "Lubrication_Report.xlsx");
// };

const handleDownload = () => {
  // Create a new worksheet with the data in table rows
  const worksheetData = filteredData.map(row => ({
    'Functional Location': row.FUNCT_LOC,
    'Plant': row.PLANT,
    'Order No.': row.CRM_ORDERH,
    'Status': row.ZTEXT1,
    'Start Date': row.ZACTSTDT,
    'End Date': row.ZACTENDT,
    'Order Type': row.ZEXT_RNO,
    'PM Start Date': row.ZREQ_SDAT,
    'Reason': row.reason || 'Add Reason', // If no reason, put a placeholder
    'Delays': getDelayChip(row.delay) // Make sure getDelayChip function is correctly defined
  }));

  // Create a worksheet from the data
  const ws = XLSX.utils.json_to_sheet(worksheetData);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PM Tracker');

  // Export the workbook as an Excel file
  XLSX.writeFile(wb, 'PM_Tracker.xlsx');
};

  
  const convertArrayOfObjectsToCSV = (data) => {
    const csv = data.map(row => Object.values(row).join(','));
    return ['Functional Location,Plant,Order No.,Status,Start Date,End Date,Order Type,PM Start Date,Reason,Delays'].concat(csv).join('\n');
  };

  const clearFilters = () => {
    setSelectedFunctionLoc([]);
    setSelectedPlant([]);
    setSelectedOrderNo([]);
    setSelectedOption1('Select');
    setSelectedOption2('Select');
    setSelectedOption3('Select');
    setSelectedOption4('Select');
    setDateFrom('');
    setDateTo('');
  };

    // UseEffect to calculate percentages after all counts are updated
    useEffect(() => {
      if (
        isTotalPlannedCountFetched &&
        isTotalWtgCountFetched &&
        isOpenStatusCountFetched &&
        isCompletedStatusCountFetched &&
        isOutOfGraceCountFetched &&
        isTotalStateWiseCountFetched
      ) {
        if (totalCount > 0 && plannedCount > 0 && completedCount >= 0 && openCount >= 0) {
          const plannedPerc = 100;
          const openPerc = (openCount / plannedCount) * 100;
          const completedPerc = (completedCount / plannedCount) * 100;
          const gracePerc = (outofGraceCount / completedCount) * 100;
    
          setPlannedPercentage(plannedPerc);
          setOpenPercentage(openPerc);
          setCompletedPercentage(completedPerc);
          setGracePercentage(gracePerc);
        }
      }
    }, [
      isTotalPlannedCountFetched,
      isTotalWtgCountFetched,
      isOpenStatusCountFetched,
      isCompletedStatusCountFetched,
      isOutOfGraceCountFetched,
      isTotalStateWiseCountFetched,
      totalCount,
      plannedCount,
      openCount,
      completedCount,
      outofGraceCount
    ]);

    useEffect(() => {
      // Wait for 1 second before selecting the first dropdown value
      const timer = setTimeout(() => {
        if (options.length > 0) {
          const firstOption = options[0].ZEXT_RNO;
          setSelectedOption1(firstOption);
  
          // Create a synthetic event to trigger the handleSelectChange1 manually
          const syntheticEvent = { target: { value: firstOption } };
          handleSelectChange1(syntheticEvent);
  
          // Trigger the button click after the dropdown value is set
          handleButtonClick();
        }
      }, 1000);
  
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [options, handleSelectChange1, handleButtonClick]);
    

  return (
    <div className='main_Lub_container'>
      {modalData.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            <h2>Add a Reason</h2>
            <div class="horizontal-line"></div>
            <div className="modal-body">
              <div className="modal-field">
                <label>Order Number:</label>
                <p>{modalData.orderNo}</p>
              </div>
              <div className="modal-field">
                <label>Functional Location:</label>
                <p>{modalData.functionLoc}</p>
              </div>
              <div className="modal-field">
                <label>Select Reason</label>
                <select value={modalData.reason} onChange={handleReasonChange}>
  <option value="">Select Reason</option>
  <option value="pm activity not applicable">PM Activity Not Applicable</option>
  <option value="material not available">Material Not Available</option>
  <option value="tools not available">Tools Not Available</option>
  <option value="lubricants not available">Lubricants Not Available</option>
  <option value="Contractor not Available">Contractor Not Available</option>
  <option value="Manpower not Available">Manpower Not Available</option>
  <option value="Equipment not Available">Equipment Not Available</option>
  <option value="Insufficient Time">Insufficient Time</option>
  <option value="Design Issue">Design Issue</option>
  <option value="Maintainability Issue">Maintainability Issue</option>
</select>

              </div>
              <button className="submit-button" onClick={handleSubmitReason}>Submit</button>
            </div>
          </div>
        </div>
      )}
      <div className='container'>
        {/* <div className='dropdown_lubmain flex ' style={{justifyContent:'space-between',marginTop:'-9px',marginLeft:'-9px'}}> */}
        <div className="containerinsidewtg">
  <div className="lub-dropdown">
    <select onChange={handleSelectChange1} value={selectedOption1} className="searchWTG_dropicon">
      <option value="Select">Type of Order</option>
      {options.map((option, index) => (
        <option key={index} value={option.ZEXT_RNO}>
          {option.ZEXT_RNO}
        </option>
      ))}
    </select>
  </div>

  <div className="lub-dropdown">
    <input 
      type="date" 
      onChange={handleStartDateChange} 
      value={startDate} 
      placeholder="From" 
    />
  </div>

  <div className="lub-dropdown">
    <input 
      type="date" 
      onChange={handleEndDateChange} 
      value={endDate} 
      placeholder="To" 
    />
  </div>

  <div className="lub-dropdown">
    <select onChange={handleSelectChange2} value={selectedOption2} className="searchWTG_dropicon">
      <option value="Select">IB Level</option>
      {states.map((state, index) => (
        <option key={index} value={state.name}>
          {state.name}
        </option>
      ))}
    </select>
  </div>

  <div className="lub-dropdown">
    <select onChange={handleSelectChange3} value={selectedOption3} className="searchWTG_dropicon">
      <option value="Select">Area</option>
      {areas.map((area, index) => (
        <option key={index} value={area.area}>
          {area.area}
        </option>
      ))}
    </select>
  </div>

  <div className="lub-dropdown">
    <select onChange={handleSelectChange4} value={selectedOption4} className="searchWTG_dropicon">
      <option value="Select">Site</option>
      {sites.map((site, index) => (
        <option key={index} value={site.site}>
          {site.site}
        </option>
      ))}
    </select>
  </div>

  {/* Button placed in the same row as other items */}
  <div className="lub-dropdown">
    <button
      className="buttonrockongoodmyfriend"
      onClick={handleButtonClick}
    >
      Search
    </button>
  </div>
</div>

        <div className='card-container'>
      {/* <div className='card-allheader'>
        <span className='card-header'>April - June, 2024</span>
      </div> */}
                  {/* <div className='card-allheader'>
                <span className='card-header'>{monthRange ? `${monthRange}, 2024` : ''}</span>
            </div> */}

<div className='card-allheader'>
                <span className='card-header'>{monthRange ? `${monthRange}` : ''}</span>
            </div>
      <div className='col-card'>
      <div className="cards_p">
      {/* Total Card */}
      <div
        className={`card total ${selectedCard === 'Total' ? 'active' : ''}`}
        onClick={() => {
          handleCardClick('Total');
          fetchTotalWtgCount();
          fetchTotalStateWiseCount();
        }}
      >
        <div className="flex justify-between">
          <h2>Total</h2>
          <h3>{totalCount}</h3>
          <div style={{ width: `${totalPercentage}%` }}></div>
          {/* <p style={{ color: '#009F89' }}>{totalPercentage}%</p> */}
        </div>
        <div className="progress-main">
          <p style={{ color: '#009F89' }}>{totalPercentage}%</p>
          <div className="progress-bar">
            {/* <div style={{ width: `${totalPercentage}%` }}></div> */}
          </div>
        </div>
      </div>

      {/* Planned Card */}
      <div
        className={`card planned ${selectedCard === 'Planned' ? 'active' : ''}`}
        onClick={() => {
          handleCardClick('Planned');
          fetchTotalPlannedData();
          fetchTotalPlannedStateWiseCount();
        }}
      >
        <div className="flex justify-between">
          <h2>Planned</h2>
          <h3>{plannedCount !== null ? plannedCount : '0'}</h3>
          <div style={{ width: `${plannedPercentage}%` }}></div>
        </div>
        <div className="progress-main">
          <p style={{ color: '#013B72' }}>{plannedPercentage.toFixed(0)}%</p> {/* Display calculated percentage */}
          <div className="progress-bar">
            {/* <div style={{ width: `${plannedPercentage}%` }}></div> */}
          </div>
        </div>
      </div>

      {/* Open Card */}
      <div
        className={`card open-card ${selectedCard === 'Open' ? 'active' : ''}`}
        onClick={() => {
          handleCardClick('Open');
     //     fetchOpenStateWiseCount();
          fetchTotalOpenData();
          fetchTotalOpenStateWiseCount();
          
        }}
      >
        <div className="flex justify-between">
          <h2>Open</h2>
          <h3>{openCount !== null ? openCount : '0'}</h3>
          <div style={{ width: `${openPercentage}%` }}></div>
        </div>
        <div className="progress-main">
          <p style={{ color: '#E95060' }}>{openPercentage.toFixed(0)}%</p> {/* Display calculated percentage */}
          <div className="progress-bar">
            {/* <div style={{ width: `${openPercentage}%` }}></div> */}
          </div>
        </div>
      </div>

      {/* Completed Card */}
      <div
        className={`card completed ${selectedCard === 'Completed' ? 'active' : ''}`}
        onClick={() => {
          handleCardClick('Completed');
        //  fetchCompletedStateWiseCount();
          fetchTotalCompletedData();
          fetchTotalCompletedStateWiseCount();
        }}
      >
        <div className="flex justify-between">
          <h2>Completed</h2>
          <h3>{completedCount !== null ? completedCount : '0'}</h3>
          <div style={{ width: `${completedPercentage}%` }}></div>
        </div>
        <div className="progress-main">
          <p style={{ color: '#00AD48' }}>{completedPercentage.toFixed(0)}%</p> {/* Display calculated percentage */}
          <div className="progress-bar">
            {/* <div style={{ width: `${completedPercentage}%` }}></div> */}
          </div>
        </div>
      </div>

      {/* Grace Time Card */}
      <div
        className={`card grace ${selectedCard === 'Grace' ? 'active' : ''}`}
        onClick={() => {
          handleCardClick('Grace');
          fetchTotalCompletedOutOfGraceData();
          fetchTotalOutOfGraceStateWiseCount();
        }}
      >
        <div className="flex justify-between">
          <h2>Grace Time</h2>
          <h3>{outofGraceCount !== null ? outofGraceCount : '0'}</h3>
        </div>
        <div style={{ height: '1px' }}>
          <span style={{ fontSize: '9px', marginRight: '129px' }}>±7 Days</span>
        </div>
        <div className="progress-main">
          <p style={{ color: '#CE6301' }}>{gracePercentage.toFixed(0)}%</p> {/* Display calculated percentage */}
          <div className="progress-bar">
            {/* <div style={{ width: `${gracePercentage}%` }}></div> */}
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
        <div className='state_wise_container'>
          <div className='state-allheader'>
            <span className='state-header'>State wise WTG</span>
          </div>
          <div className="state-wise-wtg">
                {Object.entries(stateWiseCount).map(([state, count]) => (
                    <React.Fragment key={state}>
                        <div className="state-item">
                            <div className="state-value">{count}</div>
                            <div className="state-label">{state}</div>
                        </div>
                        <div className="separator_lub"></div>
                    </React.Fragment>
                ))}
            </div>
        </div>

        <div className='Main_lubrication'>
          <div className='table_header'>
            <button className="download-button_Lub" onClick={handleDownload}>
              <img src={excel_iconpng} alt="Excel Icon" className="excel-icon_Lub" />
              Download
            </button>
            <div className="legend_lubcount">
                <span className="legend_count">Total Rows: {totalRows}</span>
            </div>
          </div>
          
          <div className="Table-Lub-table">
            <div className="Lub-table-container">
            <table>
        <thead>
          <tr>
            <th className="filter-header">
              <div className='d-flex align-items-center'>
                <span>Functional Location</span>
                <img
                  src={filterIcon}
                  alt="Filter"
                  className="filter-icon"
                  onClick={() => setShowFunctionLocDropdown(!showFunctionLocDropdown)}
                />
              </div>
              {showFunctionLocDropdown && (
                <div className="filter-container">
                  <div className="filter-header">
                    <span>Functional Location</span>
                    <img
                      src={cancelIcon}
                      alt="Close"
                      className="close-filter-icon"
                      onClick={() => setShowFunctionLocDropdown(false)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="filter-search"
                    onChange={(e) => handleSearchChange(e, 'FunctionLoc')}
                  />
                  <div className="multi-select-dropdown">
                    {getUniqueValues('FUNCT_LOC')
                      .filter(value => value.toLowerCase().includes(searchTermFunctionLoc991.toLowerCase()))
                      .map((value) => (
                        <div className="multi-select-checkbox" key={value}>
                          <input
                            type="checkbox"
                            id={value}
                            value={value}
                            onChange={(e) => handleCheckboxChange(e, 'FunctionLoc')}
                          />
                          <label htmlFor={value}>{value}</label>
                        </div>
                      ))}
                  </div>
                  <button className="clear-filter-button" onClick={() => setSelectedFunctionLoc991([])}>
                    <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                  </button>
                </div>
              )}
            </th>
            <th className="filter-header">
              <div className='d-flex align-items-center' style={{ marginLeft: '15px' }}>
                <span>Plant</span>
                <img
                  src={filterIcon}
                  alt="Filter"
                  className="filter-icon"
                  onClick={() => setShowPlantDropdown(!showPlantDropdown)}
                />
              </div>
              {showPlantDropdown && (
                <div className="filter-container">
                  <div className="filter-header">
                    <span>Plant</span>
                    <img
                      src={cancelIcon}
                      alt="Close"
                      className="close-filter-icon"
                      onClick={() => setShowPlantDropdown(false)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="filter-search"
                    onChange={(e) => handleSearchChange(e, 'Plant')}
                  />
                  <div className="multi-select-dropdown">
                    {getUniqueValues('PLANT')
                      .filter(value => value.toLowerCase().includes(searchTermPlant991.toLowerCase()))
                      .map((value) => (
                        <div className="multi-select-checkbox" key={value}>
                          <input
                            type="checkbox"
                            id={value}
                            value={value}
                            onChange={(e) => handleCheckboxChange(e, 'Plant')}
                          />
                          <label htmlFor={value}>{value}</label>
                        </div>
                      ))}
                  </div>
                  <button className="clear-filter-button" onClick={() => setSelectedPlant991([])}>
                    <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                  </button>
                </div>
              )}
            </th>
            <th className="filter-header">
              <div className='d-flex align-items-center'>
                <span>Order No.</span>
                <img
                  src={filterIcon}
                  alt="Filter"
                  className="filter-icon"
                  onClick={() => setShowOrderNoDropdown(!showOrderNoDropdown)}
                />
              </div>
              {showOrderNoDropdown && (
                <div className="filter-container">
                  <div className="filter-header">
                    <span>Order No.</span>
                    <img
                      src={cancelIcon}
                      alt="Close"
                      className="close-filter-icon"
                      onClick={() => setShowOrderNoDropdown(false)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="filter-search"
                    onChange={(e) => handleSearchChange(e, 'OrderNo')}
                  />
                  <div className="multi-select-dropdown">
                    {getUniqueValues('CRM_ORDERH')
                      .filter(value => value.toLowerCase().includes(searchTermOrderNo991.toLowerCase()))
                      .map((value) => (
                        <div className="multi-select-checkbox" key={value}>
                          <input
                            type="checkbox"
                            id={value}
                            value={value}
                            onChange={(e) => handleCheckboxChange(e, 'OrderNo')}
                          />
                          <label htmlFor={value}>{value}</label>
                        </div>
                      ))}
                  </div>
                  <button className="clear-filter-button" onClick={() => setSelectedOrderNo991([])}>
                    <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                  </button>

                </div>
              )}
            </th> 

            <th>Status</th>
            {selectedCard !== 'Open' && <th>Start Date</th>}
            {selectedCard !== 'Open' && <th>End Date</th>}
                    <th>Order Type</th>
                    <th>PM Start Date</th>
                    {selectedCard === 'Open' && <th>Reason</th>}
                    <th>Delays</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.FUNCT_LOC}</td>
              <td>{row.PLANT}</td>
              <td>{row.CRM_ORDERH}</td>
              {/* Add other rows here */}
              <td>{row.ZTEXT1}</td> {/* Assuming this is the status */}
              {selectedCard !== 'Open' && <td>{row.ZACTSTDT}</td>} {/* Start Date */}
              {selectedCard !== 'Open' && <td>{row.ZACTENDT}</td>} {/* End Date */}
      <td>{row.ZEXT_RNO}</td> {/* Adjust if needed */}
      <td>{row.ZREQ_SDAT}</td>
      {selectedCard === 'Open' && (
        <td>
          {row.Reason ? row.Reason : (
             <button onClick={() => openModal(row.CRM_ORDERH, row.FUNCT_LOC)}>Add Reason</button>
          )}
        </td>
        //<td>{row.Reason}</td>
      )}
      <td>{getDelayChip(row.delay)}</td> {/* Define getDelayChip function to render delays */}
            </tr>
          ))}
        </tbody>
      </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WTG_Wise_Planning;
