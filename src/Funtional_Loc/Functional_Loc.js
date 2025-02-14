import React, { useState, useEffect } from 'react';
import './Functional_Loc.css';
import excel_iconpng from '../assets/excel - Copy.jpg';
import filterIcon from '../assets/filter.png'; 
import cancelIcon from '../assets/close-line-icon.png';
import clearIcon from '../assets/filter-remove-icon.png';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';
import { BASE_URL } from '../config'

const createData = (plant, orderno, status, startdate, enddate, ordertype, PMstart, delay) => {
  return { plant, orderno, status, startdate, enddate, ordertype, PMstart, delay };
};

const rows = [
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 55),
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 15),
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 8),
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 10),
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 100),
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 75),
  createData('4446', '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 3),
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

function Functional_Loc() {

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
                    //  window.location.href = '/'; // Redirect to the home page or default route
                  //  window.location.href = '/LubricationPortal'; // Redirect to the home page or default route

                  // window.location.href = 'https://suzomsuatapps.suzlon.com/apps/fleetmanager_fe/index.html#/signin'; // Redirect to the home page or default route

                  window.location.href = 'https://suzoms.suzlon.com/FleetM/#/signin'; // Redirect to the home page or default route     
                    }
                  };
    
                  useEffect(() => {
                    checkAdminIdAndRedirect(); // Check adminId and redirect if not found
                  }, []); // Empty dependency array to ensure this runs only once on mount

  const [selectedArea, setSelectedArea] = useState('Select');
  const [selectedSite1, setSelectedSite1] = useState('Select');
  const [selectedSite2, setSelectedSite2] = useState('Select');
  const [selectedSite3, setSelectedSite3] = useState('Select');
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [showOrderNoDropdown, setShowOrderNoDropdown] = useState(false);

  const [states, setStates] = useState([]); // State to store fetched states
  const [selectedState, setSelectedState] = useState("Select"); // State for selected state

  const [areas, setAreas] = useState([]); // State to store fetched areas
  const [sites, setSites] = useState([]); // State to store fetched sites
  const [selectedSite, setSelectedSite] = useState("Select"); // State for selected site

  const [functionalLocations, setFunctionalLocations] = useState([]); // State to hold functional locations

  const [scheduleData, setScheduleData] = useState([]); // State for storing fetched data


  const [showPlantDropdown992, setShowPlantDropdown992] = useState(false);
  const [showOrderNoDropdown992, setShowOrderNoDropdown992] = useState(false);

  const [plantFilterOptions992, setPlantFilterOptions992] = useState([]);
  const [orderNoFilterOptions992, setOrderNoFilterOptions992] = useState([]);

  const [selectedPlant992, setSelectedPlant992] = useState([]);
  const [selectedOrderNo992, setSelectedOrderNo992] = useState([]);

  const [searchPlant992, setSearchPlant992] = useState('');
  const [searchOrderNo992, setSearchOrderNo992] = useState('');

  // State to track if the effect has already run
  const [hasRun, setHasRun] = useState(false);

  // const handleSelectChangeArea = (e) => {
  //   setSelectedArea(e.target.value);
  // };




  // // Step 1: Select the second State
  // useEffect(() => {
  //   if (states.length > 1 && !selectedState) {
  //     const secondState = states[1].name;
  //     setSelectedState(secondState);
  //     handleSelectChangeArea({ target: { value: secondState } });
  //   }
  // }, [states]);

  // // Step 2: Select the second Area only if State is selected
  // useEffect(() => {
  //   if (selectedState && areas.length > 1 && !selectedSite1) {
  //     const secondArea = areas[1].area;
  //     setSelectedSite1(secondArea);
  //     handleSelectChangeSite1({ target: { value: secondArea } });
  //   }
  // }, [areas, selectedState]);

  // // Step 3: Select the second Site only if Area is selected
  // useEffect(() => {
  //   if (selectedSite1 && sites.length > 1 && !selectedSite2) {
  //     const secondSite = sites[1].site;
  //     setSelectedSite2(secondSite);
  //     handleSelectChangeSite2({ target: { value: secondSite } });
  //   }
  // }, [sites, selectedSite1]);

  // // Step 4: Select Functional Location only if Site is selected
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (selectedSite2 && functionalLocations.length > 1 && !hasRun) {
  //       handleSelectChangeSite3({
  //         target: { value: functionalLocations[1].Functional_Location },
  //       });
  //       setHasRun(true);
  //       clearInterval(interval);
  //     }
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [functionalLocations, selectedSite2, hasRun]);


  
  // Step 2: Select the first available State (if any)
  useEffect(() => {
    if (states.length > 0) {
      setTimeout(() => {
        const firstState = states[0].name; // Select first state
        handleSelectChangeArea({ target: { value: firstState } });
      }, 500);
    }
  }, [states]);

  // Step 3: Select the first available Area (if any)
  useEffect(() => {
    if (areas.length > 0) {
      setTimeout(() => {
        const firstArea = areas[0].area; // Select first available area
        handleSelectChangeSite1({ target: { value: firstArea } });
      }, 500);
    }
  }, [areas]);

  // Step 4: Select the first available Site (if any)
  useEffect(() => {
    if (sites.length > 0) {
      setTimeout(() => {
        const firstSite = sites[0].site; // Select first available site
        handleSelectChangeSite2({ target: { value: firstSite } });
      }, 500);
    }
  }, [sites]);

  // Step 5: Select Functional Location (if available)
  useEffect(() => {
    const interval = setInterval(() => {
      if (functionalLocations.length > 0 && !hasRun) {
        handleSelectChangeSite3({
          target: { value: functionalLocations[0].Functional_Location },
        });
        setHasRun(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [functionalLocations, hasRun]);

  
    // Extract unique values for filters dynamically from `scheduleData`
    useEffect(() => {
      const uniquePlants = [...new Set(scheduleData.map(row => row.PLANT))];
      const uniqueOrderNos = [...new Set(scheduleData.map(row => row.CRM_ORDERH))];
      setPlantFilterOptions992(uniquePlants);
      setOrderNoFilterOptions992(uniqueOrderNos);
    }, [scheduleData]);
  
    // Filter schedule data based on selected filters
    const filteredData992 = scheduleData.filter(row => {
      const matchesPlant = selectedPlant992.length === 0 || selectedPlant992.includes(row.PLANT);
      const matchesOrderNo = selectedOrderNo992.length === 0 || selectedOrderNo992.includes(row.CRM_ORDERH);
      return matchesPlant && matchesOrderNo;
    });
  
    const handlePlantCheckboxChange992 = (e) => {
      const { value, checked } = e.target;
      setSelectedPlant992(prev =>
        checked ? [...prev, value] : prev.filter(item => item !== value)
      );
    };
  
    const handleOrderNoCheckboxChange992 = (e) => {
      const { value, checked } = e.target;
      setSelectedOrderNo992(prev =>
        checked ? [...prev, value] : prev.filter(item => item !== value)
      );
    };

  // Handle dropdown selection for states
  const handleSelectChangeArea = async (e) => {
    const stateValue = e.target.value;
    setSelectedState(stateValue); // Update selected state
    

    if (stateValue !== "Select") {
      try {
        // const response = await fetch(`http://localhost:224/api/get_areas?state=${stateValue}`);
        const response = await fetch(`${BASE_URL}/api/get_areas?state=${stateValue}`);
        const data = await response.json();
        setAreas(data); // Assuming the API response is an array of area objects
        setSites([]); // Reset sites when state is reset
        setFunctionalLocations([]);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    } else {
      setAreas([]); // Reset areas if "Select" is chosen
      setSites([]); // Reset sites when state is reset
      setFunctionalLocations([]);
    }
  };

  // const handleSelectChangeSite1 = (e) => {
  //   setSelectedSite1(e.target.value);
  // };

// Handle dropdown selection for areas
const handleSelectChangeSite1 = async (e) => {
  const areaValue = e.target.value;
  setSelectedSite1(areaValue); // Update selected area (ensure to use the correct state variable)

  if (areaValue !== "Select") {
    try {
      // const response = await fetch(`http://localhost:224/api/get_sites?state=${selectedState}&area=${areaValue}`);

      const response = await fetch(`${BASE_URL}/api/get_sites?state=${selectedState}&area=${areaValue}`);

      const data = await response.json();
      setSites(data); // Assuming the API response is an array of site objects
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  } else {
    setSites([]); // Reset sites if "Select" is chosen
  }
};



useEffect(() => {
  // Only run the effect if it hasn't run before and sites are available
  if (!hasRun && sites.length > 0) {
    const firstSite = sites[0];
    setSelectedSite2(firstSite); // Update the selected site state

    // Trigger the change handler to fetch functional locations
    handleSelectChangeSite2({ target: { value: firstSite } });

    // After running the initial setup, set the flag to prevent re-execution
    setHasRun(true);
  }
}, [sites, hasRun]); // Runs once when sites are available

useEffect(() => {
  // Continuously retry checking for functionalLocations every 500ms
  const interval = setInterval(() => {
    if (functionalLocations.length > 0) {
      // Functional locations are available, call handleSelectChangeSite3
      handleSelectChangeSite3({ target: { value: functionalLocations[1].Functional_Location } });

      // Clear the interval once the function is called
      clearInterval(interval);
    }
  }, 500); // Retry every 500ms

  // Cleanup the interval when the component unmounts
  return () => clearInterval(interval);

}, [functionalLocations]); // Depend on functionalLocations to retry when it changes


  // const handleSelectChangeSite2 = (e) => {
  //   setSelectedSite2(e.target.value);
  // };

  // const handleSelectChangeSite3 = (e) => {
  //   setSelectedSite3(e.target.value);
  // };

      // Handle selection change
      const handleSelectChangeSite3 = async (event) => {
        const funcLoc = event.target.value;
        setSelectedSite3(funcLoc);

        // If funcLoc is selected, proceed to fetch the data
        if (funcLoc && funcLoc !== 'Select') {
            try {
                // Construct the URL
                // const apiUrl = `http://localhost:224/api/fetch_schedule_plan_lubrication?func_loc=${funcLoc}`;
                const apiUrl = `${BASE_URL}/api/fetch_schedule_plan_lubrication?func_loc=${funcLoc}`;

                
                // Log the API URL
                console.log(`API URL: ${apiUrl}`);

                // Make the request using node-fetch
                const response = await fetch(apiUrl);
                
                // Check if response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the JSON response
                const data = await response.json();
                
                // Log the response data
                console.log('API Response:', data);

                // Set the fetched data to scheduleData state
                setScheduleData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

  const handleSelectChangeSite2 = async (e) => {
    const selectedValue = e.target.value; // Get the selected value from dropdown
    setSelectedSite2(selectedValue); // Update the selected site 3 state

    if (selectedValue !== "Select") {
        // Formulate the API query
        // const query = `http://localhost:224/api/get_functional_locations?state=${selectedState}&area=${selectedSite1}&site=${selectedValue}`;
        const query = `${BASE_URL}/api/get_functional_locations?state=${selectedState}&area=${selectedSite1}&site=${selectedValue}`;

        console.log("SQL Query:", query); // Log the SQL query

        try {
            const response = await fetch(query);
            const data = await response.json();
            console.log("Fetched Data:", data); // Log the fetched data
            setFunctionalLocations(data); // Assuming the API returns an array of functional location objects
        } catch (error) {
            console.error("Error fetching functional locations:", error);
        }
    } else {
        setFunctionalLocations([]); // Reset functional locations if "Select" is chosen
    }
};


  
  

    // Fetch states from API
    useEffect(() => {
      const fetchStates = async () => {
        try {
          // const response = await fetch('http://localhost:224/api/get_states');
          const response = await fetch(`${BASE_URL}/api/get_states`);
          const data = await response.json();
          setStates(data); // Assuming the API response is an array of state objects
          setFunctionalLocations([]);
          setSites([]); // Reset sites when state is reset
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
  
      fetchStates();
    }, []);
  

    const handleDownload = () => {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert table data into a worksheet
      const ws = XLSX.utils.table_to_sheet(document.querySelector('.WTG-table-container table'));
    
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
      // Create an Excel file and initiate download
      XLSX.writeFile(wb, 'WTG_Data.xlsx');
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

  const clearFilters = () => {
    setSelectedArea('Select');
    setSelectedSite1('Select');
    setSelectedSite2('Select');
    setSelectedSite3('Select');
    setSelectedOrderNo([]);
    setSelectedPlant([]);
  };

  return (
    <div>
      <div className='flex mt-0.8' style={{justifyContent:'space-between'}}>
      <div className="WTGWiseLoc-dropdown">
        <select 
          onChange={handleSelectChangeArea} 
          value={selectedState} 
          className="searchLoc_dropicon"
        >
          <option value="Select">State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      {/* Area Dropdown */}
      <div className="WTGWiseLoc-dropdown">
        <select 
          onChange={handleSelectChangeSite1} 
          value={selectedSite1} 
          className="searchLoc_dropicon"
        >
          <option value="Select">Area</option>
          {areas.map((area) => (
            <option key={area.area} value={area.area}>
              {area.area}
            </option>
          ))}
        </select>
      </div>
      <div className="WTGWiseLoc-dropdown">
        <select onChange={handleSelectChangeSite2} value={selectedSite2} className="searchLoc_dropicon">
          <option value="Select">Site</option>
          {sites.map((site) => (
            <option key={site.site} value={site.site}>
              {site.site} {/* Adjust based on the actual field returned */}
            </option>
          ))}
        </select>
      </div>
      <div className="WTGWiseLoc-dropdown">
    <select 
        onChange={handleSelectChangeSite3} 
        value={selectedSite3} // Ensure this state variable reflects the selected functional location
        className="searchLoc_dropicon"
    >
        <option value="Select">Function Location</option>
        {functionalLocations.map((location, index) => (
            <option key={index} value={location.Functional_Location}> {/* Use Functional_Location for value */}
                {location.Functional_Location} {/* Display Functional_Location */}
            </option>
        ))}
    </select>
</div>


      </div>
      <div className='WTG-header'>
        <span className='WTG-list-admin'>Name of Selected Location</span>
        <div className="WTG-download-container">
          <button className="WTG-download-button" onClick={handleDownload}>
            <img src={excel_iconpng} alt="Excel Icon" className="WTG-excel-icon" />
            Download
          </button>
        </div>
      </div>

      <div className="WTG-WISE-table">
        <div className="WTG-table-container">
        <table>
      <thead>
        <tr>
          <th className="filter-header">
            <div className="d-flex align-items-center" style={{ marginLeft: '30px' }}>
              <span>Plant</span>
              <img
                src={filterIcon} // Retain the original icon for activating filters
                alt="Filter"
                className="filter-icon"
                onClick={() => setShowPlantDropdown992(!showPlantDropdown992)}
              />
            </div>
            {showPlantDropdown992 && (
              <div className="filter-container">
                <div className="filter-header">
                  <span>Plant</span>
                  <img
                    src={cancelIcon} // Retain the original cancel icon
                    alt="Close"
                    className="close-filter-icon"
                    onClick={() => setShowPlantDropdown992(false)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="filter-search"
                  value={searchPlant992}
                  onChange={(e) => setSearchPlant992(e.target.value)}
                />
                <div className="multi-select-dropdown">
                  {plantFilterOptions992
                    .filter(option => option.includes(searchPlant992))
                    .map((option, index) => (
                      <div className="multi-select-checkbox" key={index}>
                        <input
                          type="checkbox"
                          id={`plant-${option}`}
                          value={option}
                          onChange={handlePlantCheckboxChange992}
                        />
                        <label htmlFor={`plant-${option}`}>{option}</label>
                      </div>
                    ))}
                </div>
                <button className="clear-filter-button" onClick={() => setSelectedPlant992([])}>
                  <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                </button>
              </div>
            )}
          </th>

          <th className="filter-header">
            <div className="d-flex align-items-center" style={{ marginLeft: '30px' }}>
              <span>Order No.</span>
              <img
                src={filterIcon} // Retain the original icon for activating filters
                alt="Filter"
                className="filter-icon"
                onClick={() => setShowOrderNoDropdown992(!showOrderNoDropdown992)}
              />
            </div>
            {showOrderNoDropdown992 && (
              <div className="filter-container">
                <div className="filter-header">
                  <span>Order No.</span>
                  <img
                    src={cancelIcon} // Retain the original cancel icon
                    alt="Close"
                    className="close-filter-icon"
                    onClick={() => setShowOrderNoDropdown992(false)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="filter-search"
                  value={searchOrderNo992}
                  onChange={(e) => setSearchOrderNo992(e.target.value)}
                />
                <div className="multi-select-dropdown">
                  {orderNoFilterOptions992
                    .filter(option => option.includes(searchOrderNo992))
                    .map((option, index) => (
                      <div className="multi-select-checkbox" key={index}>
                        <input
                          type="checkbox"
                          id={`orderNo-${option}`}
                          value={option}
                          onChange={handleOrderNoCheckboxChange992}
                        />
                        <label htmlFor={`orderNo-${option}`}>{option}</label>
                      </div>
                    ))}
                </div>
                <button className="clear-filter-button" onClick={() => setSelectedOrderNo992([])}>
                  <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                </button>
              </div>
            )}
          </th>

          <th>Status</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Order Type</th>
          <th>PM Start Date</th>
          <th>Delays</th>
        </tr>
      </thead>
      <tbody>
        {filteredData992.map((row, index) => (
          <tr key={index}>
            <td>{row.PLANT}</td>
            <td>{row.CRM_ORDERH}</td>
            <td>{row.ZTEXT1}</td>
            <td>{row.ZACTSTDT}</td>
            <td>{row.ZACTENDT}</td>
            <td>{row.ZEXT_RNO}</td>
            <td>{row.ZREQ_SDAT}</td>
            <td>{getDelayChip(row.delay)}</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
      </div>
    </div>
  );
}

export default Functional_Loc;
