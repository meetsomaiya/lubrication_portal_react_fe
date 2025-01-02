// // import React, { useState } from 'react';
// // import './ExcelUpload7756.css'; // Ensure the file name matches exactly
// // import * as XLSX from 'xlsx';

// // const UploadExcel = () => {
// //   const [excelData, setExcelData] = useState(null);
// //   const [error, setError] = useState('');
// //   const [fileName, setFileName] = useState('');

// //   const handleFileUpload = (event) => {
// //     const file = event.target.files[0];
// //     if (!file) {
// //       setError('Please select a file to upload.');
// //       return;
// //     }

// //     const fileExtension = file.name.split('.').pop();
// //     if (!['xlsx', 'xls'].includes(fileExtension)) {
// //       setError('Invalid file type. Please upload an Excel file.');
// //       return;
// //     }

// //     setError('');
// //     setFileName(file.name);
// //     const reader = new FileReader();

// //     reader.onload = (e) => {
// //       try {
// //         const arrayBuffer = e.target.result;
// //         const workbook = XLSX.read(arrayBuffer, { type: 'array' });
// //         const firstSheetName = workbook.SheetNames[0];
// //         const firstSheet = workbook.Sheets[firstSheetName];
// //         const data = XLSX.utils.sheet_to_json(firstSheet);
// //         setExcelData(data);
// //       } catch (err) {
// //         setError('Error reading the Excel file. Please try again.');
// //         setExcelData(null);
// //       }
// //     };

// //     reader.readAsArrayBuffer(file);
// //   };

// //   return (
// //     <div className="upload-excel-container7756">
// //       <h4 className="upload-header7756">Excel Upload - Site Incharge Mapping</h4>
// //       <div className="upload-card7756">
// //         <label htmlFor="file-upload" className="upload-button7756">
// //           Upload Excel
// //         </label>
// //         <input
// //           id="file-upload"
// //           type="file"
// //           accept=".xlsx, .xls"
// //           onChange={handleFileUpload}
// //           className="hidden-input7756"
// //         />
// //         {fileName && <p className="file-name7756">Selected file: {fileName}</p>}
// //       </div>
// //       {error && <p className="error-message7756">{error}</p>}
// //       {excelData && (
// //         <div className="excel-preview7756">
// //           <h3>Excel Data Preview</h3>
// //           <pre>{JSON.stringify(excelData, null, 2)}</pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UploadExcel;
// import React, { useState } from 'react';
// import './ExcelUpload7756.css'; // Ensure the file name matches exactly
// import * as XLSX from 'xlsx';

// const UploadExcel = () => {
//   const [excelData, setExcelData] = useState(null);
//   const [error, setError] = useState('');
//   const [fileName, setFileName] = useState('');

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }

//     const fileExtension = file.name.split('.').pop();
//     if (!['xlsx', 'xls'].includes(fileExtension)) {
//       setError('Invalid file type. Please upload an Excel file.');
//       return;
//     }

//     setError('');
//     setFileName(file.name);
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       try {
//         const arrayBuffer = e.target.result;
//         const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//         const firstSheetName = workbook.SheetNames[0];
//         const firstSheet = workbook.Sheets[firstSheetName];
//         const data = XLSX.utils.sheet_to_json(firstSheet);
//         setExcelData(data);
//       } catch (err) {
//         setError('Error reading the Excel file. Please try again.');
//         setExcelData(null);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleUploadClick = () => {
//     if (!fileName) {
//       alert('suzoms.suzlon.com says:\nPlease select a file first');
//       return;
//     }
//     // Additional logic for uploading the file can go here
//   };

//   return (
//     <div className="upload-excel-container7756">
//       <h2 className="upload-header7756">Excel Upload - Site Incharge Mapping</h2>
//       <div className="upload-card7756">
//         <label htmlFor="file-upload" className="upload-button7756">
//           <span className="upload-icon7756">&#x1F4E5;</span> Upload Excel
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept=".xlsx, .xls"
//           onChange={handleFileUpload}
//           className="hidden-input7756"
//         />
//         {fileName && <p className="file-name7756">Selected file: {fileName}</p>}
//       </div>
//       {error && <p className="error-message7756">{error}</p>}
//       {excelData && (
//         <div className="excel-preview7756">
//           <h3>Excel Data Preview</h3>
//           <pre>{JSON.stringify(excelData, null, 2)}</pre>
//         </div>
//       )}
//       <button className="upload-button7756 bottom-upload" onClick={handleUploadClick}>
//         Upload Excel
//       </button>
//       <p className="instruction-text7756">Click on 'Upload Excel' to proceed.</p>
//     </div>
//   );
// };

// export default UploadExcel;
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
