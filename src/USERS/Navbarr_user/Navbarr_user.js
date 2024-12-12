import React from 'react';
import './Navbarr.css';
// import '../App.css';
import myImage from '../assets/image.png';
import myImage_1 from '../assets/Clip path group.png';



const Navbar_user = () => {
       // Function to get the name from the cookies
       const getNameFromCookie = () => {
        const nameCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('name='));
        return nameCookie ? decodeURIComponent(nameCookie.split('=')[1]) : '';
    };

    // Function to get the designation from the cookies
    const getDesignationFromCookie = () => {
        const designationCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('designation='));
        return designationCookie ? decodeURIComponent(designationCookie.split('=')[1]) : 'Your Designation';
    };

    // Retrieve the user's name and designation from the cookies
    const userName = getNameFromCookie() || "Guest"; // Default to "Guest" if name not found
    const userDesignation = getDesignationFromCookie(); // Default to "Your Designation" if not found


    const getInitials = (name) => {
        const nameArray = name.split(" ");
        if (nameArray.length > 1) {
            return nameArray[0].charAt(0) + nameArray[1].charAt(0);
        }
        return nameArray[0].charAt(0);
    };

    const initials = getInitials(userName).toUpperCase();

    return (
        <nav className="navbar">
            <div className='flex'>
                <a className="navbar-brand" href="#">
                    <img src={myImage} alt="Company Logo" className="suzlon-logo" />
                </a>
            </div>
            <div className="separator"></div>
            <div className='flex flex-auto left-0'>
                <div className="logo flex flex-row gap-2">
                    <div className="logo-image">
                        <img src={myImage_1} alt="SAP Finder Logo" className="sap-finder-logo" />
                    </div>
                    <div className='header-text'>Lubrication Portal</div>
                </div>
            </div>

            <div className="profile-dropdown">
                <div className="profile-icon">
                    {initials}
                </div>
                <div className="dropdown-content">
                <p>{userName}</p>
                <span>{userDesignation}</span> {/* Display the retrieved designation */}
                    <a className="dropdown-item" href="login">Logout</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar_user;
