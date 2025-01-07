import React, { useState } from 'react';
import './ExcelUpload7756.css';
import * as XLSX from 'xlsx';

const UploadExcel = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (['xlsx', 'xls'].includes(fileExtension)) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
          setExcelData(data);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('suzoms.suzlon.com says\n\nPlease select a valid Excel file.');
      }
    }
  };

  const handleUploadClick = () => {
    if (!fileName) {
      alert('suzoms.suzlon.com says\n\nPlease select a file first.');
    }
  };

  const handleDownloadFormat = () => {
    // Define the format/template for the Excel file
    const templateData = [
      { Column1: 'Sample 1', Column2: 'Sample 2', Column3: 'Sample 3' },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'ExcelTemplate.xlsx');
  };

  return (
    <div className="upload-excel-container7756">
      <h2 className="upload-header7756">Excel Upload - Site Incharge Mapping</h2>
      <div className="upload-horizontal7756">
        <label htmlFor="file-upload" className="choose-file7756">
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden-input7756"
        />
        <button className="download-format7756" onClick={handleDownloadFormat}>
          Download Format
        </button>
        <button className="upload-button7756" onClick={handleUploadClick}>
          Upload Excel
        </button>
      </div>
      {fileName && <p className="file-name7756">Selected file: {fileName}</p>}
      {excelData && (
        <div className="excel-preview7756">
          <h3>Excel Data Preview</h3>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;
