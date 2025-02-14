import React, { useState, useEffect } from 'react';
import './Functional_Loc.css';
import excel_iconpng from '../assets/excel - Copy.jpg';
import filterIcon from '../assets/filter.png'; 
import cancelIcon from '../assets/close-line-icon.png';
import clearIcon from '../assets/filter-remove-icon.png';
import * as XLSX from 'xlsx';
import { BASE_URL } from '../../config'
import moment from 'moment-timezone';
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

function Functional_Loc_user() {

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
                        // domain_id: cookies.adminDomain || 'Not Set',
                        domain_id: cookies.domainId || 'Not Set',
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
                  
  const [selectedArea, setSelectedArea] = useState('Select');
  // const [selectedSite1, setSelectedSite1] = useState('Select');
  // const [selectedSite2, setSelectedSite2] = useState('Select');
  const [selectedSite1, setSelectedSite1] = useState('');
  const [selectedSite2, setSelectedSite2] = useState('');

  const [selectedSite3, setSelectedSite3] = useState('Select');
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  // Filtered data based on selected plants and order numbers
const [filteredData, setFilteredData] = useState([]);

// States to hold selected plants and order numbers
const [selectedPlants, setSelectedPlants] = useState([]);
const [selectedOrderNos, setSelectedOrderNos] = useState([]);
// const [scheduleData, setScheduleData] = useState([]);

  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [showOrderNoDropdown, setShowOrderNoDropdown] = useState(false);

  const [states, setStates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sites, setSites] = useState([]);

  const [functionalLocations, setFunctionalLocations] = useState([]); // State to hold functional locations

  const [scheduleData, setScheduleData] = useState([]); // State for storing fetched data

  const [selectedState, setSelectedState] = useState("Select"); // State for selected state

  // State to hold unique plants and order numbers
const [uniquePlants, setUniquePlants] = useState([]);
const [uniqueOrderNos, setUniqueOrderNos] = useState([]);



  useEffect(() => {
    // Function to get cookie by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Retrieve and decode cookies
    const decodeCookie = (cookieValue) => (cookieValue ? decodeURIComponent(cookieValue) : '');

    const stateCookie = decodeCookie(getCookie('state'));
    const areaCookie = decodeCookie(getCookie('area'));
    const siteCookie = decodeCookie(getCookie('site'));

    // Split cookie values by comma and trim spaces
    const parsedStates = stateCookie ? stateCookie.split(',').map(state => state.trim()) : [];
    const parsedAreas = areaCookie ? areaCookie.split(',').map(area => area.trim()) : [];
    const parsedSites = siteCookie ? siteCookie.split(',').map(site => site.trim()) : [];

    // Set states with parsed values
    setStates(parsedStates);
    setSelectedState(parsedStates);
    setAreas(parsedAreas);
    setSites(parsedSites);

    // Set first values for state and area if they exist
    if (parsedStates.length > 0) {
        setSelectedArea(parsedStates[0]); // Set first state as selected
    }
    if (parsedAreas.length > 0) {
        setSelectedSite1(parsedAreas[0]); // Set first area as selected
    }

    // Log decoded and parsed cookie values for debugging
    console.log("Retrieved Cookies:");
    console.log("State Cookie (Decoded):", stateCookie);
    console.log("Parsed States:", parsedStates);
    console.log("Area Cookie (Decoded):", areaCookie);
    console.log("Parsed Areas:", parsedAreas);
    console.log("Site Cookie (Decoded):", siteCookie);
    console.log("Parsed Sites:", parsedSites);

}, []);


  const handleSelectChangeArea = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSelectChangeSite1 = (e) => {
    setSelectedSite1(e.target.value);
  };

  // const handleSelectChangeSite2 = (e) => {
  //   setSelectedSite2(e.target.value);
  // };

  // Inside your component
// useEffect(() => {
//   // Pre-select the first site when the component mounts
//   if (sites.length > 0) {
//     const firstSite = sites[0];
//     setSelectedSite2(firstSite); // Update the selected site state
//     handleSelectChangeSite2({ target: { value: firstSite } }); // Trigger the change handler
//   }
// }, [sites]); // This effect runs when the sites array is updated or initially loaded

// useEffect(() => {
//   // Pre-select the first site when the component mounts
//   if (sites.length > 0) {
//     const firstSite = sites[0];
//     setSelectedSite2(firstSite); // Update the selected site state
    
//     // Trigger the change handler to fetch functional locations
//     handleSelectChangeSite2({ target: { value: firstSite } });

//     // Immediately call handleSelectChangeSite3 after selecting the site
//     // Select the second location if it exists
//     if (functionalLocations[1]) {
//       handleSelectChangeSite3({ target: { value: functionalLocations[1].Functional_Location } });
//     }
//   }
// }, [sites, functionalLocations]); // Re-run the effect when 'sites' or 'functionalLocations' change


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

  // const handleSelectChangeSite3 = (e) => {
  //   setSelectedSite3(e.target.value);
  // };

  const filteredRows = rows.filter(row => 
    (selectedPlant.length === 0 || selectedPlant.includes(row.plant)) &&
    (selectedOrderNo.length === 0 || selectedOrderNo.includes(row.orderno))
  );
  

   // Handle selection change
   // To be used for fetching the data
const handleSelectChangeSite3 = async (event) => {
  console.log("function called to fetch lubrication data")
  const funcLoc = event.target.value;
  setSelectedSite3(funcLoc);

  if (funcLoc && funcLoc !== "Select") {
    try {
      const apiUrl = `${BASE_URL}/api/fetch_schedule_plan_lubrication?func_loc=${funcLoc}`;
      console.log(`API URL: ${apiUrl}`);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      setScheduleData(data); // Store the original schedule data

      const uniquePlants = [...new Set(data.map((item) => item.PLANT))];
      const uniqueOrderNos = [...new Set(data.map((item) => item.CRM_ORDERH))];

      setUniquePlants(uniquePlants);
      setUniqueOrderNos(uniqueOrderNos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

    // Automatically select the second option after 1 second on page load
    useEffect(() => {
      const timeoutId = setTimeout(() => {
          if (functionalLocations.length > 1) {
              setSelectedSite3(functionalLocations[1].Functional_Location); // Select the second option
          }
      }, 1000);

      return () => clearTimeout(timeoutId); // Cleanup the timeout when the component unmounts
  }, [functionalLocations]);

  const handleDownload = () => {
    const header = ['Plant', 'Order No.', 'Status', 'Start Date', 'End Date', 'Order Type', 'PM Start Date', 'Delays'];
    const data = rows.map(row => [row.plant, row.orderno, row.status, row.startdate, row.enddate, row.ordertype, row.PMstart, row.delay]);
    const sheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
    XLSX.writeFile(wb, 'FuntionalLoc_Data.xlsx');
  };

  // Handle Plant checkbox change
const handleSelectChangePlant = (event) => {
  const value = event.target.value;
  setSelectedPlants((prevSelected) =>
    prevSelected.includes(value)
      ? prevSelected.filter((item) => item !== value) // Deselect if already selected
      : [...prevSelected, value] // Add if not already selected
  );
};

// Handle Order No checkbox change
const handleSelectChangeOrderNo = (event) => {
  const value = event.target.value;
  setSelectedOrderNos((prevSelected) =>
    prevSelected.includes(value)
      ? prevSelected.filter((item) => item !== value) // Deselect if already selected
      : [...prevSelected, value] // Add if not already selected
  );
};

// Clear all filters
const clearFilters = () => {
  setSelectedPlants([]);
  setSelectedOrderNos([]);
};

// Apply filtering based on selected plants and order numbers
useEffect(() => {
  // Filter the data based on selected plants and order numbers
  const filterData = scheduleData.filter((row) => {
    const plantMatch =
      selectedPlants.length === 0 || selectedPlants.includes(row.PLANT);
    const orderNoMatch =
      selectedOrderNos.length === 0 || selectedOrderNos.includes(row.CRM_ORDERH);
    return plantMatch && orderNoMatch;
  });

  // Set the filtered data
  setFilteredData(filterData);
}, [scheduleData, selectedPlants, selectedOrderNos]);

  return (
    <div>
      <div className='flex mt-0.8' style={{justifyContent:'space-between'}}>
      <div className="WTGWiseLoc-dropdown">
                <select onChange={handleSelectChangeArea} value={selectedArea} className="searchLoc_dropicon">
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
            </div>
            <div className="WTGWiseLoc-dropdown">
                <select onChange={handleSelectChangeSite1} value={selectedSite1} className="searchLoc_dropicon">
                    {areas.map((area, index) => (
                        <option key={index} value={area}>{area}</option>
                    ))}
                </select>
            </div>
            <div className="WTGWiseLoc-dropdown">
                <select onChange={handleSelectChangeSite2} value={selectedSite2} className="searchLoc_dropicon">
                    <option value="Select">Site</option>
                    {sites.map((site, index) => (
                        <option key={index} value={site}>{site}</option>
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
            <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
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
                  onChange={handleSelectChangePlant}
                />
                <div className="multi-select-dropdown">
                  {uniquePlants.map((plant, index) => (
                    <div key={index} className="multi-select-checkbox">
                      <input
                        type="checkbox"
                        id={plant}
                        value={plant}
                        checked={selectedPlants.includes(plant)}
                        onChange={handleSelectChangePlant}
                      />
                      <label htmlFor={plant}>{plant}</label>
                    </div>
                  ))}
                </div>
                <button className="clear-filter-button" onClick={clearFilters}>
                  <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                </button>
              </div>
            )}
          </th>
          <th className="filter-header">
            <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
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
                  onChange={handleSelectChangeOrderNo}
                />
                <div className="multi-select-dropdown">
                  {uniqueOrderNos.map((orderNo, index) => (
                    <div key={index} className="multi-select-checkbox">
                      <input
                        type="checkbox"
                        id={orderNo}
                        value={orderNo}
                        checked={selectedOrderNos.includes(orderNo)}
                        onChange={handleSelectChangeOrderNo}
                      />
                      <label htmlFor={orderNo}>{orderNo}</label>
                    </div>
                  ))}
                </div>
                <button className="clear-filter-button" onClick={clearFilters}>
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
        {(filteredData.length ? filteredData : scheduleData).map((row, index) => (
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
);
        </div>
      </div>
    </div>
  );
}

export default Functional_Loc_user;
