import React, { useState, useEffect } from "react";
import "./Corrective_Action.css";
import * as XLSX from "xlsx";
import moment from 'moment-timezone';

const TableComponent9976 = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterBoxes, setFilterBoxes] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page (can be adjusted)

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
    const email = cookies.email;

    if (email) {
      const apiUrl = `http://localhost:224/api/fetch_oil_under_supervision?loginUser=${email}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((responseData) => {
          setData(responseData);
          setFilteredData(responseData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const toggleFilterBox = (header) => {
    setFilterBoxes((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
    // Reset search term when opening/closing the filter box
    setSearchTerms((prev) => ({
      ...prev,
      [header]: "",
    }));
  };

  const handleSearchChange = (header, searchTerm) => {
    setSearchTerms((prev) => ({
      ...prev,
      [header]: searchTerm,
    }));
  };

  const handleFilterChange = (header, value) => {
    const updatedFilters = { ...filters };
    if (!updatedFilters[header]) {
      updatedFilters[header] = new Set();
    }

    if (updatedFilters[header].has(value)) {
      updatedFilters[header].delete(value);
    } else {
      updatedFilters[header].add(value);
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
                  {header.replace(/_/g, " ")}
                  <span
                    className="filter-icon"
                    onClick={() => toggleFilterBox(header)}
                  >
                    ⚙️
                  </span>
                  {filterBoxes[header] && (
                    <div className="filter-box">
                      {/* Search Bar */}
                      <input
                        type="text"
                        className="filter-search-bar"
                        placeholder={`Search ${header}`}
                        value={searchTerms[header] || ""}
                        onChange={(e) =>
                          handleSearchChange(header, e.target.value)
                        }
                      />
                      {/* Filter Options */}
                      {Array.from(
                        new Set(
                          data
                            .map((row) => row[header] ?? "") // Handle null/undefined safely
                            .filter((value) =>
                              value
                                .toString()
                                .toLowerCase()
                                .includes(
                                  (searchTerms[header] || "").toLowerCase()
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
            {currentItems.map((row, index) => (
              <tr key={index}>
                {headers.map((header, idx) => (
                  <td key={idx}>{row[header] ?? ""}</td> // Handle null/undefined safely
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
