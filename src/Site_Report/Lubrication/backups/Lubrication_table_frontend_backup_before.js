import React, { useState, useEffect } from 'react';
import excel_iconpng from '../../assets/excel - Copy.jpg';
import './Lubrication_table.css';
import * as XLSX from 'xlsx';

function Lubrication() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Initial data fetch
        fetchData();

        // Simulate data updates every 5 seconds
        const interval = setInterval(fetchData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchData = () => {
        // Example data generation (replace this with actual data fetching logic)
        const newData = [
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 100%', planned: '104 | 55%', open: '104 | 96%', completed: '104 | 55%', graceTime: '104 | 95%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 95%', planned: '104 | 100%', open: '104 | 96%', completed: '104 | 55%', graceTime: '104 | 55%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 100%', planned: '104 | 55%', open: '104 | 95%', completed: '104 | 96%', graceTime: '104 | 96%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 100%', planned: '104 | 100%', open: '104 | 96%', completed: '104 | 100%', graceTime: '104 | 55%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 55%', planned: '104 | 55%', open: '104 | 55%', completed: '104 | 55%', graceTime: '104 | 55%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 100%', planned: '104 | 55%', open: '104 | 96%', completed: '104 | 100%', graceTime: '104 | 95%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 95%', planned: '104 | 55%', open: '104 | 96%', completed: '104 | 96%', graceTime: '104 | 96%' },
            { orderType: 'Q1 LUB 2022', totalCount: '104 | 55%', planned: '104 | 100%', open: '104 | 95%', completed: '104 | 55%', graceTime: '104 | 55%' }
        ];
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "LubricationData");
        XLSX.writeFile(workbook, "Lubrication_Report.xlsx");
    };

    return (
        <div className='site_comntainer'>
            <div className="Site-report-table"></div>
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

export default Lubrication;
