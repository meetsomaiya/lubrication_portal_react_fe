import React, { useState, useEffect } from 'react';
import './Functional_Loc.css';
import excel_iconpng from '../assets/excel - Copy.jpg';
import filterIcon from '../assets/filter.png'; 
import cancelIcon from '../assets/close-line-icon.png';
import clearIcon from '../assets/filter-remove-icon.png';
import * as XLSX from 'xlsx';

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

function WTG_Wise_Planning() {
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

  // const handleSelectChangeArea = (e) => {
  //   setSelectedArea(e.target.value);
  // };

  // Handle dropdown selection for states
  const handleSelectChangeArea = async (e) => {
    const stateValue = e.target.value;
    setSelectedState(stateValue); // Update selected state

    if (stateValue !== "Select") {
      try {
        const response = await fetch(`http://localhost:224/api/get_areas?state=${stateValue}`);
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
      const response = await fetch(`http://localhost:224/api/get_sites?state=${selectedState}&area=${areaValue}`);
      const data = await response.json();
      setSites(data); // Assuming the API response is an array of site objects
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  } else {
    setSites([]); // Reset sites if "Select" is chosen
  }
};


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
                const apiUrl = `http://localhost:224/api/fetch_schedule_plan_lubrication?func_loc=${funcLoc}`;
                
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
        const query = `http://localhost:224/api/get_functional_locations?state=${selectedState}&area=${selectedSite1}&site=${selectedValue}`;
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
          const response = await fetch('http://localhost:224/api/get_states');
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
    const header = ['Plant', 'Order No.', 'Status', 'Start Date', 'End Date', 'Order Type', 'PM Start Date', 'Delays'];
    const data = rows.map(row => [row.plant, row.orderno, row.status, row.startdate, row.enddate, row.ordertype, row.PMstart, row.delay]);
    const sheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
    XLSX.writeFile(wb, 'FuntionalLoc_Data.xlsx');
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
                  <div className='d-flex align-items-center' style={{marginLeft:'30px'}}>
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
                        <div className="multi-select-checkbox">
                          <input type="checkbox" id="4446" value="4446" onChange={handleSelectChangePlant} />
                          <label htmlFor="4446">4446</label>
                        </div>
                        {/* Add more options as needed */}
                      </div>
                      <button className="clear-filter-button" onClick={() => setSelectedPlant([])}>
                        <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                      </button>
                    </div>
                  )}
                </th>
                <th className="filter-header">
                  <div className='d-flex align-items-center' style={{marginLeft:'30px'}}>
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
                        <div className="multi-select-checkbox">
                          <input type="checkbox" id="0018165907" value="0018165907" onChange={handleSelectChangeOrderNo} />
                          <label htmlFor="0018165907">0018165907</label>
                        </div>
                        {/* Add more options as needed */}
                      </div>
                      <button className="clear-filter-button" onClick={() => setSelectedOrderNo([])}>
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
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.plant}</td>
                  <td>{row.orderno}</td>
                  <td>{row.status}</td>
                  <td>{row.startdate}</td>
                  <td>{row.enddate}</td>
                  <td>{row.ordertype}</td>
                  <td>{row.PMstart}</td>
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

export default WTG_Wise_Planning;
