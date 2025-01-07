import React from 'react';
import './Navbarr.css';
import '../App.css';
import myImage from '../assets/image.png';
import myImage_1 from '../assets/Clip path group.png';

const Navbar = () => {
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

    // Logout function to call the API
    const handleLogout = async () => {
        const adminId = getAdminIdFromCookie(); // Add logic to get adminId from cookies
        const userId = getUserIdFromCookie(); // Add logic to get userId from cookies
        
        // Log the values before sending the request
        console.log('Sending to logout_admin:', { adminId, userId });

        // Sending the data to the logout_admin API
        try {
            const response = await fetch('http://localhost:224/api/logout_admin', {
            // const response = await fetch('http://localhost:224/api/logout_admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adminId, userId }),
            });

            if (response.ok) {
                console.log('Logged out successfully');
                // Clear cookies or handle redirection here
                document.cookie = 'name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                document.cookie = 'adminId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                document.cookie = 'access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                window.location.href = '/'; // Redirect to login page
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Functions to retrieve adminId and userId from cookies
    const getAdminIdFromCookie = () => {
        const adminCookie = document.cookie.split('; ').find(row => row.startsWith('adminId='));
        return adminCookie ? decodeURIComponent(adminCookie.split('=')[1]) : '';
    };

    const getUserIdFromCookie = () => {
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('userId='));
        return userCookie ? decodeURIComponent(userCookie.split('=')[1]) : '';
    };

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
                    <a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
