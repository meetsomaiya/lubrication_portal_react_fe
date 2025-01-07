import React, { useState } from "react";
import "./RegisterUsers3394.css";

const RegisterUsers3394 = () => {
  const [file3394, setFile3394] = useState(null);

  const handleFileChange3394 = (e) => {
    setFile3394(e.target.files[0]);
  };

  const handleSubmit3394 = (e) => {
    e.preventDefault();
    if (file3394) {
      alert(`File uploaded: ${file3394.name}`);
      // Add your file upload logic here
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
          onClick={() => alert("Show format of uploading users")}
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
