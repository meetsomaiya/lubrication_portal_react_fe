import React, { useState } from 'react';
import './ExcelUpload7756.css';
import * as XLSX from 'xlsx';

const UploadExcel = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (['xlsx', 'xls'].includes(fileExtension)) {
        setFileName(file.name);
        setSelectedFile(file); // Store the file for backend upload
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
    if (!selectedFile) {
      alert('suzoms.suzlon.com says\n\nPlease select a file first.');
      return;
    }
  
    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    // Log the contents of FormData by iterating through entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);  // Logs the file name and data
    }
  
    // Send the file to the backend
    fetch('http://localhost:224/api/site_incharge_format_upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('File uploaded successfully!');
        } else {
          alert('File upload failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
      });
  };
  

  const handleDownloadFormat = () => {
    // Trigger the download by requesting the file from the backend
    fetch('http://localhost:224/api/site-incharge-excel-format') // Update with your actual API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download the file');
        }
        return response.blob(); // Get the file as a Blob
      })
      .then((blob) => {
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create an object URL for the blob
        link.download = 'excel_download.xlsx'; // The file name to be downloaded
        link.click(); // Simulate a click to start the download
      })
      .catch((error) => {
        console.error('Error downloading format:', error);
        alert('Failed to download the format. Please try again later.');
      });
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
      {/* {excelData && (
        <div className="excel-preview7756">
          <h3>Excel Data Preview</h3>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default UploadExcel;
