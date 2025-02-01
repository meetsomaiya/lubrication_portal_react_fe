import React from 'react';
import './Navbarr.css';
import myImage from '../assets/image.png';
import myImage_1 from '../assets/Clip path group.png';

import { BASE_URL } from '../../config'

const Navbar_user = () => {
    // Function to retrieve a cookie by name
    const getCookie = (cookieName) => {
        const cookieString = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`));
        return cookieString ? decodeURIComponent(cookieString.split('=')[1]) : null;
    };

    // Retrieve the user's name and userId from cookies
    const userName = getCookie('name') || "Guest";
    const userId = getCookie('userId') || "Unknown User";

    // Retrieve the designation if stored in cookies (optional)
    const userDesignation = getCookie('designation') || 'Your Designation';

    // Function to get user initials
    const getInitials = (name) => {
        const nameArray = name.split(" ");
        if (nameArray.length > 1) {
            return nameArray[0].charAt(0) + nameArray[1].charAt(0);
        }
        return nameArray[0].charAt(0);
    };

    const initials = getInitials(userName).toUpperCase();

    // Logout function
    const handleLogout = async () => {
        // Set cookies to be sent with the API
        document.cookie = `userId=${userId}; path=/`;
        document.cookie = `name=${encodeURIComponent(userName)}; path=/`;

        // Log the data being sent
        console.log({
            userId: userId,
            name: userName,
        });

        // Send data to the logout_user API
        try {
            // const response = await fetch('http://localhost:224/api/logout_user', {
                const response = await fetch(`${BASE_URL}/api/logout_user`, {


                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, name: userName }),
            });

            if (response.ok) {
                console.log('Logout successful');
                // window.location.href = "/"; // Redirect to the login page

                window.location.href = "/LubricationPortal"; // Redirect to the login page

             //  window.location.href = 'https://suzomsuatapps.suzlon.com/LubricationPortal/index.html#/'; // Redirect to login page
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
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
                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar_user;
