import React, { useEffect, useState } from 'react';
import './Oil_Analysis_user.css';
import { BASE_URL } from '../../config'

// Import the FontAwesome library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import specific icons from the solid icon set
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment-timezone';
import * as XLSX from 'xlsx';


const OilAnalysisTableUser = () => {
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

                            // Call the function to extract domain_id from URL
    extractDomainIdFromUrl();
                      
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

  const [stateValue2, setStateValue2] = useState("");

  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [orderData, setOrderData] = useState([]);

  const [loading, setLoading] = useState(false); // To track loading state
  const [modalData, setModalData] = useState(null); // To store the fetched data
  const [originalData, setOriginalData] = useState(null); // To store the fetched data
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const [clickedOrderType, setClickedOrderType] = useState('');

  const [customReasons, setCustomReasons] = React.useState([]); // Holds custom reason input values

  const [isFilterModalOpen9963, setFilterModalOpen9963] = useState(false);
  const [filterColumn9963, setFilterColumn9963] = useState("");
  const [filterOptions9963, setFilterOptions9963] = useState([]);
  const [selectedFilters9963, setSelectedFilters9963] = useState({});
  const [originalFilterOptions9963, setOriginalFilterOptions9963] = useState([]);

  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [searchQuery9963, setSearchQuery9963] = useState('');

  const [domainId, setDomainId] = useState(null);  // State to store the domain_id
  
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
 
  const filteredOptions = searchQuery9963
    ? filterOptions9963.filter((option) =>
        option.toLowerCase().includes(searchQuery9963.toLowerCase())
      )
    : filterOptions9963;
 
    const handleOpenFilterModal9963 = (column) => {
      setFilterColumn9963(column);
      const options = generateFilterOptions(modalData, column);
      setFilterOptions9963(options);
      setFilterModalOpen9963(true);
    };
    
    const handleSearchChange9963 = (event) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery9963(query);
      const options = generateFilterOptions(modalData, filterColumn9963).filter((option) =>
        option.toLowerCase().includes(query)
      );
      setFilterOptions9963(options);
    };
    
    const handleCheckboxChange9963 = (option) => {
      const mappedKey = headerToKeyMap[filterColumn9963] || filterColumn9963;
    
      // Ensure the selectedFilters9963 state aligns with available filter options
      const newFilters = { ...selectedFilters9963 };
    
      // Initialize or update the filter array for the specific column
      if (!newFilters[mappedKey]) {
        newFilters[mappedKey] = [];
      }
    
      // Add or remove the selected option
      if (newFilters[mappedKey].includes(option)) {
        newFilters[mappedKey] = newFilters[mappedKey].filter((item) => item !== option);
      } else if (filterOptions9963.includes(option)) {
        // Only add the option if it's a valid filter option
        newFilters[mappedKey].push(option);
      }
    
      setSelectedFilters9963(newFilters);
    };
    

    const generateFilterOptions = (data, column) => {
      const mappedKey = headerToKeyMap[column] || column;
      return [...new Set(data.map((item) => item[mappedKey]))].filter(Boolean); // Unique and non-empty options
    };
    
 
  const applyFilters9963 = () => {
    let filteredData = modalData;
    Object.keys(selectedFilters9963).forEach((column) => {
      const mappedKey = headerToKeyMap[column] || column; // Use the mapped key or fallback to the column
      if (selectedFilters9963[column].length > 0) {
        filteredData = filteredData.filter((row) =>
          selectedFilters9963[column].includes(row[mappedKey])
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

    const formatToTwoDecimals = (value) => {
      return Number(value).toFixed(2);
    };

    // Helper function to format values to 2 decimal places and return absolute value
const formatValue = (value) => {
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return "0.00";
  }
  const absoluteValue = Math.abs(number);
  return absoluteValue.toFixed(2);
};

// Function to extract domain_id from URL and decode it
const extractDomainIdFromUrl = () => {
  try {
    const hash = window.location.hash;
    console.log('Window location hash:', hash);

    // Ensure hash is present and contains the query string
    if (!hash || !hash.includes('?')) {
      console.error('Hash does not contain query parameters');
      return null;
    }

    // Split the hash to get query string after the first '?'
    const [path, queryString] = hash.split('?');
    if (!queryString) {
      console.error('No query parameters in hash');
      return null;
    }

    console.log('Query string:', queryString);

    // Parse the query string using URLSearchParams
    const urlParams = new URLSearchParams(queryString);

    // Get the domain_id from the query string
    const domainIdFromUrl = urlParams.get('domain_id');
    console.log('Encoded Domain ID from URL:', domainIdFromUrl);

    if (domainIdFromUrl) {
      // Decode the Base64 encoded domain_id
      const decodedDomainId = atob(domainIdFromUrl);
      console.log('Decoded Domain ID:', decodedDomainId);

      // Set the decoded domain_id to the state
      setDomainId(decodedDomainId);

      // Set the domain_id as a cookie
      document.cookie = `domain_id=${decodedDomainId}; path=/`;

      // Send the AJAX request to the API for auto login
      sendAutoLoginRequest(decodedDomainId);

      return decodedDomainId;
    } else {
      console.error('domain_id not found in URL');
      return null;
    }
  } catch (error) {
    console.error('Error extracting or decoding domain_id:', error);
    return null;
  }
};


// Function to send the AJAX request to api_for_auto_login
// Function to send the AJAX request to api_for_auto_login
const sendAutoLoginRequest = async (domainId) => {
try {
  // Log the data being sent
  console.log('Sending data to auto login API:', { domain_id: domainId });

  // const response = await fetch('http://localhost:224/api/api_for_auto_login', {
 //  const response = await fetch('http://localhost:3001/api/api_for_auto_login', {
  const response = await fetch(`${BASE_URL}/api/api_for_auto_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain_id: domainId }),
  });

  if (response.ok) {
    const userData = await response.json(); // Assuming the response is in JSON format
    console.log('Auto login API request successful', userData);

    // Encode each field properly before storing in cookies to handle special characters (like commas)
    document.cookie = `userId=${encodeURIComponent(userData.id)}; path=/`;
    document.cookie = `domain_id=${encodeURIComponent(userData.domain_id)}; path=/`;
    document.cookie = `name=${encodeURIComponent(userData.name)}; path=/`;
    document.cookie = `email=${encodeURIComponent(userData.email)}; path=/`;
    document.cookie = `state=${encodeURIComponent(userData.state)}; path=/`;
    document.cookie = `area=${encodeURIComponent(userData.area)}; path=/`;
    document.cookie = `site=${encodeURIComponent(userData.site)}; path=/`;
    document.cookie = `access=${encodeURIComponent(userData.access)}; path=/`;
    
    // Directly store the isadmin flag from API response
    document.cookie = `isadmin=${userData.isadmin}; path=/`;

  } else {
    console.error('Error sending auto login request:', response.status);
  }
} catch (error) {
  console.error('Failed to send auto login request:', error);
}
};


const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");
  const targetCookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
  return targetCookie ? decodeURIComponent(targetCookie.split("=")[1]) : null;
};

// Helper function to parse and trim cookie values
const parseCookieValues = (cookieValue) => {
  return cookieValue ? cookieValue.split(",").map(value => value.trim()) : [];
};

// Usage Example
// const domainId = getCookie("domain_id");
const userName = getCookie("name");
const state = getCookie("state");

// Parse state cookie if it exists
const parsedStates = parseCookieValues(state);

console.log("Retrieved Cookies:");
console.log("Domain ID:", domainId);
console.log("User Name:", userName);
console.log("State Cookie (Raw):", state);
console.log("Parsed States:", parsedStates);





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
      //  const url = `http://localhost:224/api/fetch_yd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
         const url = `${BASE_URL}/api/fetch_yd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;

        //const url = `http://localhost:3001/api/fetch_yd_oil_change_state_wise_data?year=${encodeURIComponent(year)}`;
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
  
      const downloadTableAsExcel = () => {
        // Get the table element by its ID
        const table = document.getElementById('tbl7997');
      
        // Create a new workbook
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
      
        // Trigger download of the Excel file
        XLSX.writeFile(wb, "table_data.xlsx");
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
      // fetch("http://localhost:224/api/insert_reason_for_dispute_and_pending_teco", {
        fetch(`${BASE_URL}/api/insert_reason_for_dispute_and_pending_teco`, {
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
    
    
    const headerToKeyMap = {
      "Order No": "Order No",
      "Function Loc": "Function Loc",
      "Issue": "Issue",
      "Return": "Return",
      "Return Percentage": "Return Percentage",
      "Plant": "Plant",
      "State": "State",
      "Area": "Area",
      "Site": "Site",
      "Material": "Material",
      "Storage Location": "Storage Location",
      "Move Type": "Move Type",
      "Material Document": "Material Document",
      "Description": "Description",
      "Val Type": "Val Type",
      "Posting Date": "Posting Date",
      "Entry Date": "Entry Date",
      "Quantity": "Quantity",
      "Order": "Order",
      "Order Type": "Order Type",
      "Component": "Component",
      "WTG Model": "WTG Model",
      "Current Oil Change Date": "Current Oil Change Date",
      "State Engineering Head": "stateEnggHead",
      "Area Incharge": "areaIncharge",
      "Site Incharge": "siteIncharge",
      "State PMO": "statePMO",
      "Order Status": "Order Status",
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

  const url = `${BASE_URL}/api/${apiEndpoint}?order_type=${encodeURIComponent(orderType)}&financial_year=${encodeURIComponent(selectedYear)}&state=${encodeURIComponent(stateValue2)}`;

  setLoading(true); // Show loader

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setModalData(data); // Save data to state
      setOriginalData(data); // Save data to state
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
      setStateValue(normalizeStateName(state)); // Normalize the state name when setting stateValue
      setStateValue2(state);
    }
  }, []);
  // Utility function to normalize state names
const normalizeStateName = (stateName) => {
  const stateMap = {
    "Karnataka": "Karnataka",
    "Andhra Pradesh": "AP",
    "Maharashtra": "Maharashtra",
    "GJ - Saurashtra": "GJ",
    "Rajasthan": "Rajasthan",
    "Tamil nadu": "TamilNadu",
    "GJ - Kutch": "GJ2",
  };
  return stateMap[stateName] || stateName;
};
  const handleSegregatedFileDownload = async () => {
    // Ensure a financial year is selected
    if (!selectedYear) {
      alert("Please select a financial year.");
      return;
    }
  
    console.log("Retrieved Cookies:");
    console.log("State:", state);
    console.log("Financial Year:", selectedYear);
  
    // Prepare the query parameters
    const queryParams = new URLSearchParams({
      state,
      financialYear: selectedYear,
    });
  
    // const apiUrl = `http://localhost:224/api/download_segregated_oil_analysis_file_user?${queryParams}`;
  const apiUrl = `${BASE_URL}/api/download_segregated_oil_analysis_file_user?${queryParams}`

    console.log("Data sent to API via GET:", queryParams.toString());
  
    setLoading(true); // Show preloader
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `segregated_file_${selectedYear}.xlsx`; // Use selectedYear in filename
        link.click();
        console.log("File downloaded successfully.");
      } else {
        console.error("Failed to download the file. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during API request:", error);
    } finally {
      setLoading(false); // Hide preloader after completion
    }
  };
  

  const handleConsolidatedFileDownload = async () => {
    // Ensure a financial year is selected
    if (!selectedYear) {
      alert("Please select a financial year.");
      return;
    }
  
    console.log("Retrieved Cookies:");
    console.log("State:", state);
    console.log("Financial Year:", selectedYear);
  
    // Prepare the query parameters
    const queryParams = new URLSearchParams({
      state,
      financialYear: selectedYear,
    });
  
   // const apiUrl = `http://localhost:224/api/download_consolidated_file_user?${queryParams}`;
    const apiUrl = `${BASE_URL}/api/download_consolidated_file_user?${queryParams}`;
  
    console.log("Data sent to API via GET:", queryParams.toString());
  
    setLoading(true); // Show preloader
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `consolidated_file_${selectedYear}.xlsx`; // Use selectedYear in filename
        link.click();
        console.log("File downloaded successfully.");
      } else {
        console.error("Failed to download the file. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during API request:", error);
    } finally {
      setLoading(false); // Hide preloader after completion
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedYear(value);

    // Call fetch functions
    fetchDataForYDOilChange(event);
    fetchDataForPDOilChange(event);
    fetchDataForGBOilChange(event);
    fetchDataForFCOilChange(event);
    fetchDataForGbTopup(event);
    fetchDataForFCTopup(event);
    fetchDataForYDPDTopUp(event);
    fetchDataForDispute(event);
    fetchDataForPendingTeco(event);
  };

    useEffect(() => {
      // Use setTimeout to delay the execution by 2 seconds
      const timer = setTimeout(() => {
        // Extract the query parameters from the hash
        const hashParams = window.location.hash.split('?')[1];
      
        // Check if the reload query parameter is present
        if (!hashParams || !hashParams.includes('reload=true')) {
          // Append the reload query parameter to the hash
          const baseHash = window.location.hash.split('?')[0]; // Get the base part of the hash
          const updatedHash = `${baseHash}?reload=true`;
      
          // Update the hash and reload the page
          window.location.hash = updatedHash;
          window.location.reload(); // Reload the page
        }
      }, 2000); // 2000ms = 2 seconds
      
      // Cleanup the timeout on component unmount
      return () => clearTimeout(timer);
    
    }, []);

  useEffect(() => {
    // Wait for 1 second before selecting the first dropdown value
    const timer = setTimeout(() => {
      if (financialYears.length > 0) {
        // const firstYear = financialYears[0];
        const firstYear = financialYears[1];
        setSelectedYear(firstYear);

        // Call the handleChange manually to trigger the associated functions
        const syntheticEvent = { target: { value: firstYear } }; // Mimic an event object
        handleChange(syntheticEvent);
      }
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [financialYears]);

  
  
  
  
  return (
    <div className="container997user">
      <div className="buttonContainer997user">
      <button id="downloadSegregatedFile997user" onClick={handleSegregatedFileDownload}>
        Download Segregated File
      </button>
      <button id="downloadConsolidatedFile997user" onClick={handleConsolidatedFileDownload}>
  Download Consolidated File
</button>

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
        onChange={handleChange}
      >
        <option value="">Select Financial Year</option>
        {financialYears.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>


      </div>



      <div className="tableContainer997user">
        <table className="oilAnalysisTable997user">
          <thead>
            <tr>
              <th className="orderTypeHeader997user">Order Type</th>
              <th colSpan="3">{stateValue2}</th>
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
                {/* <a href="/" onClick={() => handleOrderTypeClick(order.type)}>
                  {order.type}
                </a> */}

<a 
  href="/" 
  onClick={(e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    handleOrderTypeClick(order.type); // Perform your custom logic
  }}
>
  {/* {order.type} */}
  {order.type.replace(/_/g, ' ').toUpperCase()}
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
  <div className="modal-7997user">
    <div className="modal-content-7997user">
    <div className="btn-content-7997">
           {/* Display the selected order type dynamically */}
           {/* {clickedOrderType && <h1 className="order-type-heading-7997">{clickedOrderType}</h1>} */}
           {clickedOrderType && (
  <h1 className="order-type-heading-7997">
    {clickedOrderType.replace(/_/g, ' ').toUpperCase()}
  </h1>
)}
           <button
  id="download-excel"
  onClick={() => downloadTableAsExcel()}
>
  Download Excel
</button>

  <button id="closebtn" onClick={() => setShowModal(false)}>Close</button>
</div>
      {modalData && (
        <div className="data-table-wrapper-7997">
<table className="data-table-7997user" id="tbl7997">
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
        // Conditionally render the "Reason" and "Action" headers if the order type is 'dispute'
        ...(clickedOrderType === 'dispute' ? ["Reason", "Action"] : [])
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
          {/* <td>{item["Issue"]}</td>
          <td>{item["Return"]}</td>
          <td>{item["Return Percentage"]}</td> */}

              <td>{formatToTwoDecimals(item["Issue"])}</td>
              <td>{formatToTwoDecimals(item["Return"])}</td>
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

          {/* Conditionally render "Reason" and "Action" columns if the order type is 'dispute' */}
          {clickedOrderType === 'dispute' && (
  <>
    <td>
      <select
        value={item["reason"] && !dropdownOptions.includes(item["reason"]) ? item["reason"] : "Select"}
        onChange={(e) => handleReasonChange(e, index)}
      >
        {/* Render all dropdown options */}
        {dropdownOptions.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
        
        {/* If the reason is not in the dropdown options, add it dynamically */}
        {item["reason"] && !dropdownOptions.includes(item["reason"]) && (
          <option value={item["reason"]}>{item["reason"]}</option>
        )}
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

              <td>
                <button
                  onClick={() => handleSaveReason(index)}
                  className="save-button"
                >
                  Save
                </button>
              </td>
            </>
          )}
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
          selectedFilters9963[headerToKeyMap[filterColumn9963] || filterColumn9963]?.includes(option) || false
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
     
    export default OilAnalysisTableUser;