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

const Functional_Loc_user = () => {
  const [rows, setRows] = useState(initialRows);
  const [selectedFunctionLoc, setSelectedFunctionLoc] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);
  const [selectedOption1, setSelectedOption1] = useState('Select');
  const [selectedOption2, setSelectedOption2] = useState('Select');
  const [selectedOption3, setSelectedOption3] = useState('Select');
  const [selectedOption4, setSelectedOption4] = useState('Select');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalData, setModalData] = useState({ show: false, orderNo: '', functionLoc: '', reason: '' });
  const [showFunctionLocDropdown, setShowFunctionLocDropdown] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [showOrderNoDropdown, setShowOrderNoDropdown] = useState(false);
  const [filteredCount, setFilteredCount] = useState(rows.length);

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
  };

  const handleSelectChange2 = (event) => {
    setSelectedOption2(event.target.value);
  };

  const handleSelectChange3 = (event) => {
    setSelectedOption3(event.target.value);
  };

  const handleSelectChange4 = (event) => {
    setSelectedOption4(event.target.value);
  };

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
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
              <option value="12345">12345</option>
              <option value="23456">23456</option>
              <option value="34567">34567</option>
            </select>
          </div>
          <div className="lub-dropdown">
            <input type="date" onChange={handleDateFromChange} value={dateFrom} placeholder="From" />
          </div>
          <div className="lub-dropdown">
            <input type="date" onChange={handleDateToChange} value={dateTo} placeholder="To" />
          </div>
          <div className="lub-dropdown">
            <select onChange={handleSelectChange2} value={selectedOption2} className="searchWTG_dropicon">
              <option value="Select">State</option>
              <option value="Technically Completed">Technically Completed</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="lub-dropdown">
            <select onChange={handleSelectChange3} value={selectedOption3} className="searchWTG_dropicon">
              <option value="Select">Area</option>
              <option value="12345">12345</option>
              <option value="23456">23456</option>
              <option value="34567">34567</option>
            </select>
          </div>
          <div className="lub-dropdown">
            <select onChange={handleSelectChange4} value={selectedOption4} className="searchWTG_dropicon">
              <option value="Select">Site</option>
              <option value="12345">12345</option>
              <option value="23456">23456</option>
              <option value="34567">34567</option>
            </select>
          </div>
        </div>
        <div className='card-container'>
          <div className='card-allheader'>
            <span className='card-header'>April - June, 2024</span>
          </div>
          <div className='col-card '>
            <div className="cards_p">
              <div className="card total">
                <div className='flex justify-between'>
                  <h2>Total</h2>
                  <h3>185</h3>
                </div>
                <div className='progress-main'>
                  <p style={{ color: '#009F89' }}>88%</p>
                  <div className="progress-bar">
                    <div style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
              <div className="card planned">
                <div className='flex justify-between'>
                  <h2>Planned</h2>
                  <h3>185</h3>
                </div>
                <div className='progress-main'>
                  <p style={{ color: '#013B72' }}>40%</p>
                  <div className="progress-bar">
                    <div style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <div className="card open-card">
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
              <div className="card completed">
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
              <div className="card grace">
                <div className='flex justify-between'>
                  <h2>Grace Time</h2>
                  <h3>185</h3>
                </div>
                <div style={{height:'1px'}}>
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
                  {filteredRows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.FuntionLoc}</td>
                      <td>{row.plant}</td>
                      <td>{row.orderno}</td>
                      <td>{row.status}</td>
                      <td>{row.startdate}</td>
                      <td>{row.enddate}</td>
                      <td>{row.ordertype}</td>
                      <td>{row.PMstart}</td>
                      <td>
                        {row.reason ? (
                          <span>{row.reason}</span>
                        ) : (
                          <button className='model_button' onClick={() => openModal(row.orderno, row.FuntionLoc, row.reason)}>Add Reason</button>
                        )}
                      </td>
                      <td>{getDelayChip(row.delay)}</td>
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

export default Functional_Loc_user;
