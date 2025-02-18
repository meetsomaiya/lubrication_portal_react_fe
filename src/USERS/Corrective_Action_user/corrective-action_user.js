import React, { useState, useEffect, useRef } from "react";
import "./Corrective_Action.css";
import * as XLSX from "xlsx";
import moment from 'moment-timezone';
import { BASE_URL } from '../../config'

const TableComponent9976 = () => {

    // Helper function to format the date from yyyymmdd to dd-mm-yyyy
const formatDate = (dateString) => {
  if (!dateString) return ""; // If no date is available, return empty string

  const date = dateString.toString();
  const day = date.slice(6, 8);
  const month = date.slice(4, 6);
  const year = date.slice(0, 4);

  return `${day}-${month}-${year}`; // Format to dd-mm-yyyy
};


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
                    
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterBoxes, setFilterBoxes] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page (can be adjusted)

  const filterBoxRef = useRef(null);

  const fieldOrder = [
    "SERVICEORDER",
    "Sample_Number",
    "FUNCTIONAL_LOCATION",
    "Sample_Collection_Date",
    "Oil_Material_Code",
    "DESCRIP",
    "STATUS",
    "Sampling_Decision",
    "Reason",
    "Decision_Taken_Date",
    "Last_Oil_Changed_Date",
    "STATE",
    "AREA",
    "SITE",
    "MAINTENANCE_PLANT",
    "STATE_ENGG_HEAD",
    "AREA_INCHARGE",
    "SITE_INCHARGE"
  ];

  const headers = [
    "SERVICEORDER",
    "SAMPLE_NUMBER",
    "FUNCTIONAL_LOCATION",
    "SAMPLE_COLLECTION_DATE",
    "OIL_MATERIAL_CODE",
    "DESCRIP",
    "STATUS",
    "SAMPLING_DECISION",
    "REASON",
    "DECISION_TAKEN_DATE",
    "LAST_OIL_CHANGED_DATE",
    "STATE",
    "AREA",
    "SITE",
    "MAINTENANCE_PLANT",
    "STATE_ENGG_HEAD",
    "AREA_INCHARGE",
    "SITE_INCHARGE",
  ];
  
  const dateFields = [
    "SAMPLE_COLLECTION_DATE",
    "DECISION_TAKEN_DATE",
    "LAST_OIL_CHANGED_DATE"
  ];

  // Mapping between headers used in the table and the original API field names
  const headerMapping = {
    SERVICEORDER: "SERVICEORDER",
    SAMPLE_NUMBER: "Sample_Number",
    FUNCTIONAL_LOCATION: "FUNCTIONAL_LOCATION",
    SAMPLE_COLLECTION_DATE: "Sample_Collection_Date",
    OIL_MATERIAL_CODE: "Oil_Material_Code",
    DESCRIP: "DESCRIP",
    STATUS: "STATUS",
    SAMPLING_DECISION: "Sampling_Decision",
    REASON: "Reason",
    DECISION_TAKEN_DATE: "Decision_Taken_Date",
    LAST_OIL_CHANGED_DATE: "Last_Oil_Changed_Date",
    STATE: "STATE",
    AREA: "AREA",
    SITE: "SITE",
    MAINTENANCE_PLANT: "MAINTENANCE_PLANT",
    STATE_ENGG_HEAD: "STATE_ENGG_HEAD",
    AREA_INCHARGE: "AREA_INCHARGE",
    SITE_INCHARGE: "SITE_INCHARGE",
  };

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
    const email = cookies.email;

    if (email) {
      // const apiUrl = `http://localhost:224/api/fetch_oil_under_supervision?loginUser=${email}`;
      const apiUrl = `${BASE_URL}/api/fetch_oil_under_supervision?loginUser=${email}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((responseData) => {
          // Ensure data is ordered based on the specified sequence
          const orderedData = responseData.map((row) => {
            const orderedRow = {};
            fieldOrder.forEach((field) => {
              orderedRow[field] = row[field] || ""; // Default to an empty string if field is missing
            });
            return orderedRow;
          });
          setData(orderedData);
          setFilteredData(orderedData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  const toggleFilterBox = (header) => {
    setFilterBoxes((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
    setSearchTerms((prev) => ({
      ...prev,
      [header]: "", // Reset search term when toggling the filter box
    }));
  };
  
  const handleFilterChange = (header, value) => {
    const updatedFilters = { ...filters };
    const apiHeader = headerMapping[header]; // Map the header to the original API field name
    
    if (!updatedFilters[apiHeader]) {
      updatedFilters[apiHeader] = new Set();
    }
  
    if (updatedFilters[apiHeader].has(value)) {
      updatedFilters[apiHeader].delete(value);
    } else {
      updatedFilters[apiHeader].add(value);
    }
  
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };
  
  const applyFilters = (activeFilters) => {
    let filtered = [...data];
    for (const [header, values] of Object.entries(activeFilters)) {
      if (values.size > 0) {
        filtered = filtered.filter((row) => {
          const value = row[header] ?? ""; // Default to empty string if null/undefined
          return values.has(value); // Apply filter if value exists
        });
      }
    }
    setFilteredData(filtered);
  };
  
  const resetFilters = () => {
    setFilters({});
    setFilteredData(data);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterBoxRef.current && !filterBoxRef.current.contains(event.target)) {
        setFilterBoxes({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (header, searchTerm) => {
    setSearchTerms((prev) => ({
      ...prev,
      [header]: searchTerm,
    }));
  };



  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Oil Supervision Data");
    XLSX.writeFile(wb, "oil_supervision_data.xlsx");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container-9976">
      <button className="download-btn" onClick={downloadExcel}>
        Download Excel
      </button>
      <button className="reset-btn" onClick={resetFilters}>
        Reset Filters
      </button>

      <div className="data-table-9976-wrapper">
      <table className="data-table-9976">
  <thead>
    <tr>
      {headers.map((header, index) => (
        <th key={index}>
          {header.replace(/_/g, " ").toUpperCase()}
          <span
            className="filter-icon"
            onClick={() => toggleFilterBox(header)}
          >
            ⚙️
          </span>
          {filterBoxes[header] && (
            <div ref={filterBoxRef} className="filter-box">
              <input
                type="text"
                className="filter-search-bar"
                placeholder={`Search ${header}`}
                value={searchTerms[header] || ""}
                onChange={(e) =>
                  handleSearchChange(header, e.target.value)
                }
              />
              {Array.from(
                new Set(
                  filteredData
                    .map((row) => row[headerMapping[header]] ?? "")
                    .filter((value) =>
                      value
                        .toString()
                        .toLowerCase()
                        .includes(
                          (searchTerms[header] ?? "").toLowerCase()
                        )
                    )
                )
              ).map((value, idx) => (
                <div key={idx} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters[header]?.has(value) || false}
                    onChange={() => handleFilterChange(header, value)}
                  />
                  <label>{value}</label>
                </div>
              ))}
            </div>
          )}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {/* {filteredData.map((row, index) => ( */}
    {currentItems.map((row, index) => (
      <tr key={index}>
        {headers.map((header, idx) => (
          <td key={idx}>
            {/* Apply date formatting if the header corresponds to a date field */}
            {dateFields.includes(header)
              ? formatDate(row[headerMapping[header]])
              : row[headerMapping[header]] ?? ""}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent9976;
