import React, { useState, useEffect } from 'react';
import './WTG_Wise_Planning.css';
import filterIcon from '../assets/filter.png';
import cancelIcon from '../assets/close-line-icon.png';
import clearIcon from '../assets/filter-remove-icon.png';
import excel_iconpng from '../assets/excel - Copy.jpg';
// import WTG_Wise_Planning from '../WTG_wise/WTG_Wise_Planning';

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

  const [totalPercentage, setTotalPercentage] = useState(0); // Initialize state for total percentage
  const [totalCount, setTotalCount] = useState(0); // Initialize state for total count

  const [totalData, setTotalData] = useState([]); // State to hold the fetched sites

  const [selectedCard, setSelectedCard] = useState(null);

     // Define state for planned count
     const [plannedCount, setPlannedCount] = useState(null);

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
  };

       // Function to fetch the total WTG count
       const fetchTotalWtgCount = async () => {
        const url = new URL('http://localhost:224/api/get_total_wtg_count');
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
      const url = `http://localhost:224/api/get_total_planned_wtg_count?${queryString}`;

      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Data fetched from API:', data); // Log the fetched data
          // Set the planned count from the API response
          setPlannedCount(data.totalPlannedCount);
      } catch (error) {
          console.error('Error fetching total planned count:', error);
      }
  };

  




  useEffect(() => {
    // Fetch data from the API on component mount
    const fetchOptions = async () => {
        try {
            const response = await fetch('http://localhost:224/api/fetch_type_order_for_wtg_wise_planning');
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
          const response = await fetch('http://localhost:224/api/get_states');
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
    setSelectedOption1(event.target.value);

    // fetchTotalWtgCount();
  };

  // const handleSelectChange2 = (event) => {
  //   setSelectedOption2(event.target.value);
  // };

  

      // Function to handle dropdown selection change for states
      const handleSelectChange2 = async (event) => {
        const selectedState = event.target.value;
        setSelectedOption2(selectedState);
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
          const response = await fetch(`http://localhost:224/api/get_areas?state=${state}`);
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
            const response = await fetch(`http://localhost:224/api/get_sites?state=${state}&area=${area}`);
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

  const handleDownload = () => {
    // Generate data to download
    const dataToDownload = filteredRows.map(row => ({
      FunctionalLocation: row.FuntionLoc,
      Plant: row.plant,
      OrderNo: row.orderno,
      Status: row.status,
      StartDate: row.startdate,
      EndDate: row.enddate,
      OrderType: row.ordertype,
      PMStartDate: row.PMstart,
      Reason: row.reason,
      Delays: row.delay
    }));

    
    const csvData = convertArrayOfObjectsToCSV(dataToDownload);

    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    
    const url = window.URL.createObjectURL(blob);

    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'WTG_Wise_Planning.csv');
    document.body.appendChild(link);

    
    link.click();

    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
                  <option value="Reason 1">Reason 1</option>
                  <option value="Reason 2">Reason 2</option>
                  <option value="Reason 3">Reason 3</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <button className="submit-button" onClick={handleSubmitReason}>Submit</button>
            </div>
          </div>
        </div>
      )}
      <div className='container'>
        <div className='dropdown_lubmain flex ' style={{justifyContent:'space-between',marginTop:'-9px',marginLeft:'-9px'}}>
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
                {/* <option value="Select">State</option> */}
                <option value="Select">IB Level</option>
                {states.map((state, index) => (
                    <option key={index} value={state.name}> {/* Adjust 'name' based on your actual data structure */}
                        {state.name} {/* Display the state name in the dropdown */}
                    </option>
                ))}
            </select>
        </div>
        <div className="lub-dropdown">
                <select onChange={handleSelectChange3} value={selectedOption3} className="searchWTG_dropicon">
                    <option value="Select">Area</option>
                    {areas.map((area, index) => (
                        <option key={index} value={area.area}> {/* Accessing the 'area' property */}
                            {area.area} {/* Display the area name in the dropdown */}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Site Dropdown */}
            <div className="lub-dropdown">
                <select onChange={handleSelectChange4} value={selectedOption4} className="searchWTG_dropicon">
                    <option value="Select">Site</option>
                    {sites.map((site, index) => (
                        <option key={index} value={site.site}>
                            {site.site}
                        </option>
                    ))}
                </select>
                
                <button
    className="buttonrockongoodmyfriend"
    style={{
        backgroundColor: 'black',
        color: 'silver',
        border: '2px solid silver',
        borderRadius: '12px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        // position: 'fixed', // Fixed position for center alignment
         position: 'relative', // Fixed position for center alignment
        top: '33%',
        left: '50%',
        transform: 'translate(-50%, -50%)' // Center it exactly
    }}
    // onClick={fetchTotalWtgCount}
    onClick={handleButtonClick}
>
    Search
</button>


            </div>

        </div>
        <div className='card-container'>
      <div className='card-allheader'>
        <span className='card-header'>April - June, 2024</span>
      </div>
      <div className='col-card'>
        <div className="cards_p">
          <div
            className={`card total ${selectedCard === 'Total' ? 'active' : ''}`}
            onClick={() => handleCardClick('Total')}
          >
            <div className='flex justify-between'>
              <h2>Total</h2>
              <h3>{totalCount}</h3> {/* Display total count from state */}
            </div>
            <div className='progress-main'>
              <p style={{ color: '#009F89' }}>{totalPercentage}%</p> {/* Display total percentage */}
              <div className="progress-bar">
                <div style={{ width: `${totalPercentage}%` }}></div> {/* Set progress bar width */}
              </div>
            </div>
          </div>

          <div
            className={`card planned ${selectedCard === 'Planned' ? 'active' : ''}`}
            onClick={() => handleCardClick('Planned')}
          >
            <div className='flex justify-between'>
              <h2>Planned</h2>
              {/* <h3>185</h3> */}
              <h3>{plannedCount !== null ? plannedCount : 'Loading...'}</h3>
            </div>
            <div className='progress-main'>
              <p style={{ color: '#013B72' }}>40%</p>
              <div className="progress-bar">
                <div style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>

          <div
            className={`card open-card ${selectedCard === 'Open' ? 'active' : ''}`}
            onClick={() => handleCardClick('Open')}
          >
            <div className='flex justify-between'>
              <h2>Open</h2>
              <h3>185</h3>
            </div>
            <div className='progress-main'>
              <p style={{ color: '#E95060' }}>40%</p>
              <div className="progress-bar">
                <div style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>

          <div
            className={`card completed ${selectedCard === 'Completed' ? 'active' : ''}`}
            onClick={() => handleCardClick('Completed')}
          >
            <div className='flex justify-between'>
              <h2>Completed</h2>
              <h3>185</h3>
            </div>
            <div className='progress-main'>
              <p style={{ color: '#00AD48' }}>40%</p>
              <div className="progress-bar">
                <div style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>

          <div
            className={`card grace ${selectedCard === 'Grace' ? 'active' : ''}`}
            onClick={() => handleCardClick('Grace')}
          >
            <div className='flex justify-between'>
              <h2>Grace Time</h2>
              <h3>185</h3>
            </div>
            <div style={{ height: '1px' }}>
              <span style={{ fontSize: '9px', marginRight: '129px' }}>±7 Days</span>
            </div>
            <div className='progress-main'>
              <p style={{ color: '#CE6301' }}>56%</p>
              <div className="progress-bar">
                <div style={{ width: '56%' }}></div>
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
            <div className="state-item">
              <div className="state-value">1421</div>
              <div className="state-label">Rajasthan</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">1922</div>
              <div className="state-label">Maharashtra</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">17</div>
              <div className="state-label">Sri Lanka</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">737</div>
              <div className="state-label">Andhra Pradesh</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">1958</div>
              <div className="state-label">Tamil Nadu</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">1421</div>
              <div className="state-label">Gj - Saurashtra</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">1081</div>
              <div className="state-label">GJ - Kutch</div>
            </div>
            <div className="separator_lub"></div>
            <div className="state-item">
              <div className="state-value">717</div>
              <div className="state-label">Karnataka</div>
            </div>
          </div>
        </div>

        <div className='Main_lubrication'>
          <div className='table_header'>
            <button className="download-button_Lub" onClick={handleDownload}>
              <img src={excel_iconpng} alt="Excel Icon" className="excel-icon_Lub" />
              Download
            </button>
            <div className="legend_lubcount">
              <span className="legend_count">Count: {filteredCount}</span>
            </div>
          </div>
          
          <div className="Table-Lub-table">
            <div className="Lub-table-container">
              <table>
                <thead>
                  <tr>
                    <th className="filter-header">
                      <div className='d-flex align-items-center'>
                        <span> Functional Location</span>
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
                            onChange={handleSelectChangeFunctionLoc}
                          />
                          <div className="multi-select-dropdown">
                            <div className="multi-select-checkbox">
                              <input type="checkbox" id="SWSPAL-SC2-RS102-P112" value="SWSPAL-SC2-RS102-P112" onChange={handleSelectChangeFunctionLoc} />
                              <label htmlFor="SWSPAL-SC2-RS102-P112">SWSPAL-SC2-RS102-P112</label>
                            </div>
                            {/* Add more options as needed */}
                          </div>
                          <button className="clear-filter-button" onClick={() => setSelectedFunctionLoc([])}>
                            <img src={clearIcon} alt="Clear" className="clear-icon" /> Clear All
                          </button>
                        </div>
                      )}
                    </th>
                    <th className="filter-header">
                      <div className='d-flex align-items-center' style={{marginLeft:'15px'}}>
                        <span> Plant</span>
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
                    <th>Reason</th>
                    <th>Delays</th>
                  </tr>
                </thead>
                <tbody>
          {totalData.map((row, index) => (
            <tr key={index}>
              <td>{row.FUNCT_LOC}</td>
              <td>{row.PLANT}</td>
              <td>{row.CRM_ORDERH}</td>
              <td>{row.ZTEXT1}</td> {/* Assuming this is the status */}
              <td>{row.ZACTSTDT}</td>
              <td>{row.ZACTENDT}</td>
              <td>{row.ZEXT_RNO}</td> {/* Adjust if needed */}
              <td>{row.ZREQ_SDAT}</td>
              <td>{row.reason ? row.reason : <button onClick={() => openModal(row.CRM_ORDERH)}>Add Reason</button>}</td>
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
