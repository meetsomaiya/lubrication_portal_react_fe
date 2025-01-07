import React from 'react';
import excel_iconpng from '../../assets/excel - Copy.jpg';
import './Oil.css'; // Create a separate CSS file for styling
import * as XLSX from 'xlsx';

function Oil({ reportData }) {
    // Check if reportData is null or undefined
    if (!reportData) {
        return <div>Loading...</div>; // You can replace this with a spinner or message
    }

    // Filter the data based on the ZEXT_RNO conditions for Oil
    const filteredData = reportData.filter(item => (
        item.ZEXT_RNO.startsWith('YD_OIL_') || 
        item.ZEXT_RNO.startsWith('PD_OIL_') || 
        item.ZEXT_RNO.startsWith('HYD_OIL_')
    ));

    const getCellClass = (percentage) => {
        if (percentage < 80) return 'below-80';
        if (percentage >= 80 && percentage <= 95) return 'between-80-95';
        if (percentage > 95) return 'above-95';
    };

    const renderCellContent = (count, percentage) => {
        const className = getCellClass(percentage);
        return (
            <span className={`cell-content ${className}`}>{count} | {percentage}%</span>
        );
    };

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "OilData");
        XLSX.writeFile(workbook, "Oil_Report.xlsx");
    };

    return (
        <div className='site_container'>
            <div className="legend-download-container">
                <div className="legend">
                    <span className="legend-item below-80">Below 80%</span>
                    <span className="legend-item between-80-95">80% to 95%</span>
                    <span className="legend-item above-95">95% to 100%</span>
                </div>
                <button className="download-button" onClick={handleDownload}>
                    <img src={excel_iconpng} alt="Excel Icon" className="excel-icon" />
                    Download
                </button>
            </div>

            <div className="Site-report-table">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order Type</th>
                                <th>Total Count</th>
                                <th>Planned</th>
                                <th>Open</th>
                                <th>Completed</th>
                                <th>Grace Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.ZEXT_RNO}</td> {/* Display ZEXT_RNO as Order Type */}
                                    <td>{renderCellContent(row.total_count, row.total_percentage)}</td> {/* Display total_count */}
                                    <td>{renderCellContent(row.planned_count, row.planned_percentage)}</td> {/* Display planned_count */}
                                    <td>{renderCellContent(row.open_count, row.open_percentage)}</td> {/* Display open_count */}
                                    <td>{renderCellContent(row.completed_count, row.completed_percentage)}</td> {/* Display completed_count */}
                                    <td>{renderCellContent(row.grace_count, row.grace_percentage)}</td> {/* Display grace_count */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Oil;
