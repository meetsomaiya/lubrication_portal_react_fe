import React, { useState } from 'react';
import './RegisterUser8845.css';

const RegisterUser = () => {
    const [fileName, setFileName] = useState('No file chosen');

    const handleDownload = () => {
        const templateData = 'Name,Email\nJohn Doe,johndoe@example.com';
        const blob = new Blob([templateData], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'UserTemplate.csv';
        link.click();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            console.log('File uploaded:', file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('suzoms.suzlon.com says!');
       
    };

    return (
        <div className="register-user-card">
            <h2>Register Users via Excel Upload</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fileUpload">Upload Excel File:</label>
                    <input
                        type="file"
                        id="fileUpload"
                        accept=".csv, .xlsx"
                        onChange={handleFileUpload}
                    />
                    <p className="file-name">{fileName}</p>
                </div>

                <button
                    type="button"
                    className="download-btn"
                    onClick={handleDownload}
                >
                    Format of uploading users
                </button>

                <button type="submit" className="submit-btn">
                    Upload and Register Users
                </button>
            </form>
        </div>
    );
};

export default RegisterUser;
