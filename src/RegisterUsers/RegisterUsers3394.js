import React, { useState } from "react";
import "./RegisterUsers3394.css";

const RegisterUsers3394 = () => {
  const [file3394, setFile3394] = useState(null);

  // Handle file selection
  const handleFileChange3394 = (e) => {
    setFile3394(e.target.files[0]);
  };

  const handleDownloadFormat = () => {
    // Trigger the download by requesting the file from the backend
    fetch('http://localhost:224/api/user-registration-excel-format') // Update with your actual API endpoint
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
        link.download = 'excel_download_user_registration.xlsx'; // The file name to be downloaded
        link.click(); // Simulate a click to start the download
      })
      .catch((error) => {
        console.error('Error downloading format:', error);
        alert('Failed to download the format. Please try again later.');
      });
  };

  // Handle form submission
  const handleSubmit3394 = async (e) => {
    e.preventDefault();

    if (file3394) {
      // Create FormData object
      const formData = new FormData();
      formData.append("file", file3394);

      // Log the file being sent
      console.log("File being sent to the backend:", file3394);

      try {
        // Make POST request using fetch
        const response = await fetch(
          "http://localhost:224/api/register-users-via-excel",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        alert(`File uploaded successfully: ${data.message}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      }
    } else {
      alert("No file selected");
    }
  };

  return (
    <div className="register-users-container-3394">
      <h2 className="register-users-title-3394">Register Users via Excel Upload</h2>
      <form className="register-users-form-3394" onSubmit={handleSubmit3394}>
        <div className="file-input-container-3394">
          <label htmlFor="file-upload-3394" className="file-label-3394">
            Upload Excel File:
          </label>
          <input
            type="file"
            id="file-upload-3394"
            onChange={handleFileChange3394}
            className="file-input-3394"
          />
        </div>
        <button
  type="button"
  className="format-button-3394"
  onClick={handleDownloadFormat}
>
  Format of uploading users
</button>

        <button type="submit" className="upload-button-3394">
          Upload and Register Users
        </button>
      </form>
    </div>
  );
};

export default RegisterUsers3394;
