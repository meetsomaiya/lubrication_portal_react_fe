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

function Functional_Loc_user() {
  const [selectedArea, setSelectedArea] = useState('Select');
  // const [selectedSite1, setSelectedSite1] = useState('Select');
  // const [selectedSite2, setSelectedSite2] = useState('Select');
  const [selectedSite1, setSelectedSite1] = useState('');
  const [selectedSite2, setSelectedSite2] = useState('');

  const [selectedSite3, setSelectedSite3] = useState('Select');
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [showOrderNoDropdown, setShowOrderNoDropdown] = useState(false);

  const [states, setStates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sites, setSites] = useState([]);



  useEffect(() => {
    // Function to get cookie by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Retrieve and parse cookies
    const stateCookie = getCookie('state');
    const areaCookie = getCookie('area');
    const siteCookie = getCookie('site');

    // Split cookie values by comma and trim spaces
    const parsedStates = stateCookie ? stateCookie.split(',').map(state => state.trim()) : [];
    const parsedAreas = areaCookie ? areaCookie.split(',').map(area => area.trim()) : [];
    const parsedSites = siteCookie ? siteCookie.split(',').map(site => site.trim()) : [];

    setStates(parsedStates);
    setAreas(parsedAreas);
    setSites(parsedSites);

    // Set first values for state and area if they exist
    if (parsedStates.length > 0) {
        setSelectedArea(parsedStates[0]); // Set first state as selected
    }
    if (parsedAreas.length > 0) {
        setSelectedSite1(parsedAreas[0]); // Set first area as selected
    }
}, []);

  const handleSelectChangeArea = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSelectChangeSite1 = (e) => {
    setSelectedSite1(e.target.value);
  };

  const handleSelectChangeSite2 = (e) => {
    setSelectedSite2(e.target.value);
  };

  const handleSelectChangeSite3 = (e) => {
    setSelectedSite3(e.target.value);
  };

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
          <select onChange={handleSelectChangeSite3} value={selectedSite3} className="searchLoc_dropicon">
            <option value="Select">Function Location</option>
            <option value="12345">12345</option>
            <option value="23456">23456</option>
            <option value="34567">34567</option>
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

export default Functional_Loc_user;
