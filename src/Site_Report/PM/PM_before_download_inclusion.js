import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import excel_iconpng from '../../assets/excel - Copy.jpg';
import './PM.css';

function Site_Report({ reportData }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Initial data fetch
        fetchData();

        // Simulate data updates every 5 seconds
        const interval = setInterval(fetchData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [reportData]); // Depend on reportData

    const fetchData = () => {
        if (!reportData) return; // Prevent running if reportData is not available

        // Filter the data based on the ZEXT_RNO conditions
        const filteredData = reportData.filter(item => (
            item.ZEXT_RNO === 'WTG_HYL' ||
            item.ZEXT_RNO === 'WTG_VI' ||
            item.ZEXT_RNO.startsWith('WTG') ||
            item.ZEXT_RNO.startsWith('HT') ||
            item.ZEXT_RNO.startsWith('TT') ||
            item.ZEXT_RNO.startsWith('BOTTOM_') ||
            item.ZEXT_RNO.startsWith('NACELLE') ||
            item.ZEXT_RNO.startsWith('HUB') ||
            item.ZEXT_RNO.startsWith('FEEDER') ||
            item.ZEXT_RNO.startsWith('SUBSTATION') ||
            item.ZEXT_RNO.startsWith('WTG_VIEL_') ||
            item.ZEXT_RNO === '500HRS'
        ));

        // Map the filtered data to the desired format
        const newData = filteredData.map(item => ({
            orderType: item.ZEXT_RNO,
            totalCount: `${item.total_count} | ${item.total_percentage}%`,
            planned: `${item.planned_count} | ${item.planned_percentage}%`,
            open: `${item.open_count} | ${item.open_percentage}%`,
            completed: `${item.completed_count} | ${item.completed_percentage}%`,
            graceTime: `${item.grace_count} | ${item.grace_percentage}%`,
        }));

        setData(newData);
    };

    const getCellClass = (value) => {
        const percentage = parseInt(value.split('|')[1].trim().replace('%', ''));
        if (percentage < 80) return 'below-80';
        if (percentage >= 80 && percentage <= 95) return 'between-80-95';
        if (percentage > 95) return 'above-95';
    };

    const renderCellContent = (value) => {
        const [count, percentage] = value.split('|').map(v => v.trim());
        const className = getCellClass(value);
        return (
            <span className={`cell-content ${className}`}>{count} | {percentage}</span>
        );
    };

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Site Report");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "PM_report.xlsx");
    };

    return (
        <div className='site_comntainer'>
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
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.orderType}</td>
                                    <td>{renderCellContent(row.totalCount)}</td>
                                    <td>{renderCellContent(row.planned)}</td>
                                    <td>{renderCellContent(row.open)}</td>
                                    <td>{renderCellContent(row.completed)}</td>
                                    <td>{renderCellContent(row.graceTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Site_Report;
