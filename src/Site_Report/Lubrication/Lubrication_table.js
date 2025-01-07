import React from 'react';
import excel_iconpng from '../../assets/excel - Copy.jpg';
import './Lubrication_table.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BASE_URL } from '../../config';

function Lubrication({ reportData }) {
    if (!reportData) {
        return <div>Loading...</div>;
    }

    const filteredData = reportData.filter(item => (
        item.ZEXT_RNO.startsWith('Q1_LUB_') ||
        item.ZEXT_RNO.startsWith('Q2_LUB_') ||
        item.ZEXT_RNO.startsWith('Q3_LUB_') ||
        item.ZEXT_RNO.startsWith('Q4_LUB_') ||
        item.ZEXT_RNO.startsWith('HALF1_LUB_') ||
        item.ZEXT_RNO.startsWith('HALF2_LUB_')
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

    const handleDownloadExcel = () => {
        const table = document.querySelector("table");
        const workbook = XLSX.utils.table_to_book(table, { sheet: "LubricationData" });
        XLSX.writeFile(workbook, "Lubrication_Report.xlsx");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const table = document.querySelector("table");

        // Extract table headers
        const headers = Array.from(table.querySelectorAll('thead tr th')).map(th => th.innerText);

        // Extract table rows
        const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
            return Array.from(row.querySelectorAll('td')).map(cell => cell.innerText);
        });

        // Add title
        doc.text("Lubrication Report", 14, 10);

        // Add the table to the PDF
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 20
        });

        doc.save("Lubrication_Report.pdf");
    };

    return (
        <div className='site_comntainer'>
            <div className="legend-download-container">
                <div className="legend">
                    <span className="legend-item below-80">Below 80%</span>
                    <span className="legend-item between-80-95">80% to 95%</span>
                    <span className="legend-item above-95">95% to 100%</span>
                </div>
                <button className="download-button" onClick={handleDownloadExcel}>
                    <img src={excel_iconpng} alt="Excel Icon" className="excel-icon" />
                    Download Excel
                </button>
                <button className="download-button" onClick={handleDownloadPDF}>
                    Download PDF
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
                                    <td>{row.ZEXT_RNO}</td>
                                    <td>{renderCellContent(row.total_count, row.total_percentage)}</td>
                                    <td>{renderCellContent(row.planned_count, row.planned_percentage)}</td>
                                    <td>{renderCellContent(row.open_count, row.open_percentage)}</td>
                                    <td>{renderCellContent(row.completed_count, row.completed_percentage)}</td>
                                    <td>{renderCellContent(row.grace_count, row.grace_percentage)}</td>
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
