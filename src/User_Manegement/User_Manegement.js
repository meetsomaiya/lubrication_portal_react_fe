import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import './User_Manegement.css';
import add_admin from '../assets/plus-circle.png';
import cancel_icon from '../assets/close.png';
 
import { BASE_URL } from '../config'
import moment from 'moment-timezone';
 
function UserManagement() {
              let entryTime = null;  // Store the entry time (when user stepped into the page)
              let exitTime = null;   // Store the exit time (when user left the page)
              
              const sendCookiesToBackend = async () => {
                const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                  const [key, value] = cookie.trim().split('=');
                  acc[key] = decodeURIComponent(value);
                  return acc;
                }, {});
              
                // Get the current pathname
                const pathname = window.location.pathname;
              
                // Get the current time in IST format
                const currentTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
              
                // Prepare the data to send to the backend
                const cookieData = {
                  name: cookies.name || 'Not Set',
                  adminId: cookies.adminId || 'Not Set',
                  access: cookies.access || 'Not Set',
                  adminEmail: cookies.adminEmail || 'Not Set',
                  userId: cookies.userId || 'Not Set',
                  domain_id: cookies.adminDomain || 'Not Set',
                  state: cookies.state || 'Not Set',
                  area: cookies.area || 'Not Set',
                  site: cookies.site || 'Not Set',
                  email: cookies.email || 'Not Set',
                  pathname: pathname,  // Add the pathname to the data
                  entryTime: entryTime, // Include entry time (when user stepped in)
                  exitTime: exitTime,   // Include exit time (when user leaves)
                };
              
                console.log('Sending the following cookie data to backend:', cookieData);
              
                try {
                  // Send data to the backend's heartbeat API
                  const response = await fetch('http://localhost:224/api/heartbeat', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cookieData),
                  });
              
                  if (response.ok) {
                    console.log('Cookie data sent to backend successfully.');
                  } else {
                    console.error('Error sending cookie data to backend:', response.status);
                  }
                } catch (error) {
                  console.error('Failed to send cookie data:', error);
                }
              };
              
              useEffect(() => {
                // Set entry time when the page loads
                entryTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                console.log(`Entry Time (IST): ${entryTime}`);
              
                // Add event listener for beforeunload (browser close / tab close)
                const handleBeforeUnload = () => {
                  exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                  console.log(`Exit Time (IST): ${exitTime}`);
                  sendCookiesToBackend();
                };
              
                window.addEventListener('beforeunload', handleBeforeUnload);
              
                return () => {
                  // Clean up the event listener when the component unmounts
                  window.removeEventListener('beforeunload', handleBeforeUnload);
                };
              }, []);
              
              useEffect(() => {
                const handlePathChange = () => {
                  // Capture exit time and send cookies when pathname changes
                  exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                  console.log(`Exit Time (IST): ${exitTime}`);
                  sendCookiesToBackend();
                };
              
                // Listen for changes in the pathname using window.history
                const windowHistoryPushState = window.history.pushState;
                window.history.pushState = function (...args) {
                  handlePathChange();
                  return windowHistoryPushState.apply(this, args);
                };
              
                const windowHistoryReplaceState = window.history.replaceState;
                window.history.replaceState = function (...args) {
                  handlePathChange();
                  return windowHistoryReplaceState.apply(this, args);
                };
              
                return () => {
                  // Reset window.history methods when component unmounts
                  window.history.pushState = windowHistoryPushState;
                  window.history.replaceState = windowHistoryReplaceState;
                };
              }, []);
            
            // Call the polling function on mount
            useEffect(() => {
              // Send cookies on page unload and capture exit time
              const handleBeforeUnload = (event) => {
                exitTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                console.log(`Exit Time (IST): ${exitTime}`);
            
                // Send cookies and exit time to backend when user is leaving the page
                sendCookiesToBackend();
              };
            
              // Attach event listener for beforeunload
              window.addEventListener('beforeunload', handleBeforeUnload);
            
              // Clean up the event listener on component unmount
              return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
              };
            }, []);
            
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [users, setUsers] = useState([
        // { name: 'Pratik', domainId: 'Domain Id', access: 'User' },
        // { name: 'John', domainId: 'Domain Id', access: 'User' },
        // { name: 'Jane', domainId: 'Domain Id', access: 'User' },
        // { name: 'Doe', domainId: 'Domain Id', access: 'User' },
    ]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const [filteredUsers, setFilteredUsers] = useState(null);


    const [selectedValues779, setSelectedValues779] = useState({});
 
    const handleSelection779 = (dropdown, value) => {
        setSelectedValues779((prev) => {
            const existingValues = prev[dropdown] || [];
            if (!existingValues.includes(value)) {
                return { ...prev, [dropdown]: [...existingValues, value] };
            }
            return prev;
        });
    };

    const handleRemove779 = (dropdown, value) => {
        setSelectedValues779((prev) => {
            const updatedValues = prev[dropdown]?.filter((item) => item !== value) || [];
            return { ...prev, [dropdown]: updatedValues };
        });
    };
       
     // Fetch users from the API when the component mounts
     useEffect(() => {
        fetch('http://localhost:224/api/fetch_users')
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.data || []); // Ensure data is an array
                    setFilteredUsers(data.data || []); // Ensure data is an array
                } else {
                    console.error('Error fetching users:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);
 
    const handleUpdate = (user) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };
 
    // const handleDelete = (index) => {
    //     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    //     if (confirmDelete) {
    //         const updatedUsers = users.filter((_, i) => i !== index);
    //         setUsers(updatedUsers);
    //     }
    // };

    const handleDelete = async (user) => {
        // Extract the domainId directly from the user object
        const { domainId } = user;
    
        // Log the data being sent to the backend
        console.log('Deleting user with domainId:', domainId);
    
        // Send the domainId to the backend
        try {
            const response = await fetch('http://localhost:224/api/delete_user', {
                method: 'POST', // Use POST for sending data securely
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ domainId }), // Send domainId in the body
            });
    
            const result = await response.json();
    
            if (response.ok) {
                // If successful, remove the user from the list
                alert(`Success: ${result.message}`);
                setUsers((prevUsers) => prevUsers.filter((u) => u.domainId !== domainId));
            } else {
                // Handle failure
                alert(`Error: ${result.message || 'Failed to delete user'}`);
                console.error('Failed to delete user:', result);
            }
        } catch (error) {
            // Handle network or other errors
            alert(`Error: ${error.message || 'An unexpected error occurred'}`);
            console.error('Error deleting user:', error);
        }
    };
    
     
 
    // const handleSearch = (event) => {
    //     setSearchTerm(event.target.value);
    // };

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase(); // Get input value
        setSearchTerm(searchValue); // Update the search input value
    
        if (searchValue === '') {
            // Reset filtered users if search input is cleared
            setFilteredUsers([]);
        } else {
            // Filter users based on search input, adding null-checks
            const filtered = users.filter((user) =>
                (user.name && user.name.toLowerCase().includes(searchValue)) || 
                (user.domainId && user.domainId.toLowerCase().includes(searchValue))
            );
            setFilteredUsers(filtered);
        }
    };
    
 
    // const filteredUsers = users.filter(user =>
    //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.domainId.toLowerCase().includes(searchTerm.toLowerCase())
    // );
 
    return (
        <div className="user-management">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name and domain ID..."
                    value={searchTerm}
                    onInput={handleSearch}
                />
            </div>
            <div className='header_user'>
                <span className='list-admin'>List of User</span>
                <div className='admin-options'>
                    <button className='add-User-button' onClick={() => setShowAddModal(true)}>
                        <img src={add_admin} alt='Add Icon' className='icon' /> Add New User
                    </button>
                </div>
            </div>
            <div className="customerListTable">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain Id</th>
                            <th>Access</th>
                            {/* <th>Last Login Time</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchTerm ? filteredUsers : users).map((user, index) => (
                            <UserRow
                                key={index}
                                user={user}
                                onUpdate={() => handleUpdate(user)}
                                onDelete={() => handleDelete(user)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {showAddModal && (
                <AddModal
                    onClose={() => setShowAddModal(false)}
                    onSave={(newUser) => {
                        setUsers([...users, newUser]);
                        setShowAddModal(false);
                    }}
                />
            )}
            {showUpdateModal && (
                <UpdateModal
                    user={selectedUser}
                    onClose={() => setShowUpdateModal(false)}
                    onSave={(updatedUser) => {
                        const updatedUsers = users.map((u) =>
                            u === selectedUser ? { ...u, ...updatedUser } : u
                        );
                        setUsers(updatedUsers);
                        setSelectedUser(null);
                        setShowUpdateModal(false);
                    }}
                />
            )}
        </div>
    );
}
 
function UserRow({ user, onUpdate, onDelete }) {
    return (
        <tr className="user-row">
            <td>{user.name}</td>
            <td>{user.domainId}</td>
            <td>{user.access}</td>
            {/* <td>{user.last_login_time}</td> */}
            <td>
                <button className="update-button" onClick={onUpdate}>Update Account</button>
                <button className="delete-button" onClick={onDelete}>Delete User</button>
            </td>
            <div className="last-login-time">{user.last_login_time}</div> {/* Last login time above row */}
        </tr>
    );
}

 
function AddModal({ onClose, onSave }) {
    const [domainId, setDomainId] = useState('');
    const [state, setState] = useState('');
    const [area, setArea] = useState('');
    const [site, setSite] = useState('');
    const [access, setAccess] = useState([]);
 
    const [domainId001, setDomainId001] = useState('');
    const [state001, setState001] = useState('');
    const [area001, setArea001] = useState('');
    const [site001, setSite001] = useState('');
    const [access001, setAccess001] = useState([]);
    const [statesData001, setStatesData001] = useState([]);
    const [areasData001, setAreasData001] = useState([]);
    const [sitesData001, setSitesData001] = useState([]);
    const [selectedValues779, setSelectedValues779] = useState({
        state: [],
        area: [],
        site: [],
    });
 
  
 
    // Fetch states on page load
    useEffect(() => {
        const fetchStates = async () => {
            try {
                // const response = await fetch('http://localhost:224/api/get_states');
                const response = await fetch(`${BASE_URL}/api/get_states`);
                const data = await response.json();
                setStatesData001([...new Set(data.map((item) => item.name))]);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        fetchStates();
    }, []);
 
    // Fetch areas based on selected state
    const handleStateChange = async (selectedState) => {
        setState001(selectedState);
        setArea001('');
        setSite001('');
        setSitesData001([]);
        try {
            const response = await fetch(
                // `http://localhost:224/api/get_areas?state=${encodeURIComponent(selectedState)}`
                `${BASE_URL}/api/get_areas?state=${encodeURIComponent(selectedState)}`
 
            );
            const data = await response.json();
            setAreasData001(data.map((item) => item.area));
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    };
 
    // Fetch sites based on selected state and area
    const handleAreaChange = async (selectedArea) => {
        setArea001(selectedArea);
        setSite001('');
        try {
            const response = await fetch(
                // `http://localhost:224/api/get_sites?state=${encodeURIComponent(state001)}&area=${encodeURIComponent(selectedArea)}`
                `${BASE_URL}/api/get_sites?state=${encodeURIComponent(state001)}&area=${encodeURIComponent(selectedArea)}`
 
            );
            const data = await response.json();
            setSitesData001(data.map((item) => item.site)); // Extracting "site" values
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };
 
    const options = ['PM', 'Lubrication', 'Oil Change'];
 
    const handleChange = (event) => {
        const { target: { value } } = event;
        setAccess(typeof value === 'string' ? value.split(',') : value);
    };
    const handleSelection779 = (dropdown, value) => {
        if (!value || selectedValues779[dropdown]?.includes(value)) return; // Prevent duplicates
        setSelectedValues779((prev) => ({
            ...prev,
            [dropdown]: [...(prev[dropdown] || []), value],
        }));
    };

    // Remove selected value from the corresponding dropdown list
    const handleRemove779 = (dropdown, value) => {
        setSelectedValues779((prev) => ({
            ...prev,
            [dropdown]: prev[dropdown]?.filter((item) => item !== value),
        }));
    };

   // Add a new value to the selected values array
const addBubble = (dropdown, value) => {
    if (!value || selectedValues779[dropdown]?.includes(value)) return; // Prevent duplicates
    setSelectedValues779((prev) => ({
        ...prev,
        [dropdown]: [...(prev[dropdown] || []), value],
    }));
};


// Remove a selected value and clear dependent dropdowns
const removeBubble = (dropdown, valueToRemove) => {
    setSelectedValues779((prev) => ({
        ...prev,
        [dropdown]: prev[dropdown]?.filter((value) => value !== valueToRemove),
    }));

    // Clear dependent dropdowns when a parent is removed
    if (dropdown === 'state') {
        setArea001('');
        setSite001('');
        setSelectedValues779((prev) => ({
            ...prev,
            area: [],
            site: [],
        }));
    } else if (dropdown === 'area') {
        setSite001('');
        setSelectedValues779((prev) => ({
            ...prev,
            site: [],
        }));
    }
};
    
 
    // const handleSave = () => {
    //     onSave({
    //         name: 'New User',
    //         domainId,
    //         state,
    //         area,
    //         site,
    //         access: access.join(', ') // Convert array to comma-separated string
    //     });
    // };

    const handleSave = async () => {
        // Check if required fields are filled
        if (!domainId) {
            alert('Please enter the Domain ID');
            return;
        }
    
        if (selectedValues779['state']?.length === 0) {
            alert('Please select at least one State');
            return;
        }
    
        if (selectedValues779['area']?.length === 0) {
            alert('Please select at least one Area');
            return;
        }
    
        if (selectedValues779['site']?.length === 0) {
            alert('Please select at least one Site');
            return;
        }
    
        // Prepare the data to send to the API
        const dataToSend = {
            domainId,
            state: selectedValues779['state']?.join(', ') || '', // Convert state array to comma-separated string
            area: selectedValues779['area']?.join(', ') || '', // Convert area array to comma-separated string
            site: selectedValues779['site']?.join(', ') || '', // Convert site array to comma-separated string
            access: 'lubrication' // Fixed value as 'Lubrication'
        };
    
        // Console log the data
        console.log('Data to be sent to API:', dataToSend);
    
        // Send data to the API
        try {
            const response = await fetch('http://localhost:224/api/register_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
    
            const result = await response.json();
            console.log('API response:', result);
    
            // Check if result contains a message and display it in the alert
            if (result.message) {
                alert(result.message);
            } else {
                alert('An unknown error occurred.');
            }
        } catch (error) {
            console.error('Error sending data to API:', error);
            alert('Error sending data to API');
        }
    };
    
    
    
 
    return (
        <div className='User_modal'>
            <div className='User_modal-content'>
                <span className='User_close' onClick={onClose}>
                    <img src={cancel_icon} alt='Cancel Icon' />
                </span>
                <h2>Register New User</h2>
                <form>
    <label>
        <input
            type="text"
            value={domainId}
            onChange={(e) => setDomainId(e.target.value)}
            placeholder="Enter Domain ID"
        />
    </label>

    {/* State Dropdown */}
    <label>
        <div className="selected-values-container">
            {(selectedValues779['state'] || []).map((value, index) => (
                <span className="bubble" key={index}>
                    {value}{' '}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            removeBubble('state', value);
                        }}
                    >
                        x
                    </button>
                </span>
            ))}
        </div>
        <select
            value={state001}
            onChange={(e) => {
                const newState = e.target.value;
                handleStateChange(newState);
                addBubble('state', newState); // Add state bubble
            }}
        >
            <option value="">Select State</option>
            {statesData001.map((state, index) => (
                <option key={index} value={state}>
                    {state}
                </option>
            ))}
        </select>
    </label>

    {/* Area Dropdown */}
    <label>
        <div className="selected-values-container">
            {(selectedValues779['area'] || []).map((value, index) => (
                <span className="bubble" key={index}>
                    {value}{' '}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            removeBubble('area', value);
                        }}
                    >
                        x
                    </button>
                </span>
            ))}
        </div>
        <select
            value={area001}
            onChange={(e) => {
                const newArea = e.target.value;
                handleAreaChange(newArea);
                addBubble('area', newArea); // Add area bubble
            }}
            disabled={!state001} // Disable if no state selected
        >
            <option value="">Select Area</option>
            {areasData001.map((area, index) => (
                <option key={index} value={area}>
                    {area}
                </option>
            ))}
        </select>
    </label>

    {/* Site Dropdown */}
    <label>
        <div className="selected-values-container">
            {(selectedValues779['site'] || []).map((value, index) => (
                <span className="bubble" key={index}>
                    {value}{' '}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            removeBubble('site', value);
                        }}
                    >
                        x
                    </button>
                </span>
            ))}
        </div>
        <select
            value={site001}
            onChange={(e) => {
                const newSite = e.target.value;
                addBubble('site', newSite); // Add site bubble
            }}
            disabled={!area001} // Disable if no area selected
        >
            <option value="">Select Site</option>
            {sitesData001.map((site, index) => (
                <option key={index} value={site}>
                    {site}
                </option>
            ))}
        </select>
    </label>

                    {/* Select Access Dropdown */}
                    <label>
                    <select
                        value="lubrication" // Preselect "Lubrication"
                        
                    >
                        <option value="lubrication">lubrication</option>
                    </select>
                </label>

    {/* <button type="button">Register</button> */}
    <button type="button" onClick={handleSave}>Register</button>

</form>


            </div>
        </div>
    );
}
 
function UpdateModal({ user, onClose, onSave }) {
    const [domainId, setDomainId] = useState(user.domainId);
    const [state002, setState002] = useState(user.state);
    const [area002, setArea002] = useState(user.area);
    const [site002, setSite002] = useState(user.site);
    const [access002, setAccess002] = useState(user.access);
    const [name002, setName002] = useState(user.name);

    const [state001, setState001] = useState('');
    const [area001, setArea001] = useState('');
    const [site001, setSite001] = useState('');
    const [statesData001, setStatesData001] = useState([]);
    const [areasData001, setAreasData001] = useState([]);
    const [sitesData001, setSitesData001] = useState([]);
    const [selectedValues779, setSelectedValues779] = useState({
        state: [],
        area: [],
        site: [],
    });

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/get_states`);
                const data = await response.json();
                setStatesData001([...new Set(data.map((item) => item.name))]);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        fetchStates();
    }, []);

    const handleStateChange = async (selectedState) => {
        setState001(selectedState);
        setArea001('');
        setSite001('');
        setSitesData001([]);
        try {
            const response = await fetch(`${BASE_URL}/api/get_areas?state=${encodeURIComponent(selectedState)}`);
            const data = await response.json();
            setAreasData001(data.map((item) => item.area));
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    };

    const handleAreaChange = async (selectedArea) => {
        setArea001(selectedArea);
        setSite001('');
        try {
            const response = await fetch(`${BASE_URL}/api/get_sites?state=${encodeURIComponent(state001)}&area=${encodeURIComponent(selectedArea)}`);
            const data = await response.json();
            setSitesData001(data.map((item) => item.site));
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };

    const addBubble = (dropdown, value) => {
        if (!value || selectedValues779[dropdown]?.includes(value)) return;
        setSelectedValues779((prev) => ({
            ...prev,
            [dropdown]: [...(prev[dropdown] || []), value],
        }));
    };

    const removeBubble = (dropdown, valueToRemove) => {
        setSelectedValues779((prev) => ({
            ...prev,
            [dropdown]: prev[dropdown]?.filter((item) => item !== valueToRemove),
        }));
        if (dropdown === 'state') {
            setArea001('');
            setSite001('');
            setSelectedValues779((prev) => ({
                ...prev,
                area: [],
                site: [],
            }));
        } else if (dropdown === 'area') {
            setSite001('');
            setSelectedValues779((prev) => ({
                ...prev,
                site: [],
            }));
        }
    };

    const handleSave = async () => {
        // Prepare the data to be sent to the backend
        const data = {
            domainId,
            name: name002,
            access: access002,
            state: selectedValues779['state'].join(', '), // Comma-separated if multiple
            area: selectedValues779['area'].join(', '), // Comma-separated if multiple
            site: selectedValues779['site'].join(', '), // Comma-separated if multiple
        };
    
        // Log the data being sent to the backend
        console.log('Sending data to the backend:', data);
    
        // Send the data to the backend
        try {
            const response = await fetch('http://localhost:224/api/update_user_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            
            if (response.ok) {
                // Display success message in an alert
                alert(`Success: ${result.message}`);
                console.log('User details updated successfully:', result);
                onSave(); // Call onSave to perform any other necessary actions after saving
            } else {
                // Display error message in an alert
                alert(`Error: ${result.message || 'Failed to update user details'}`);
                console.error('Failed to update user details:', result);
            }
        } catch (error) {
            // Display network or other errors in an alert
            alert(`Error: ${error.message || 'An unexpected error occurred'}`);
            console.error('Error sending data to backend:', error);
        }
    };
    

    return (
        <div className='User_modal'>
            <div className='User_modal-content'>
                <span className='User_close' onClick={onClose}>
                    <img src={cancel_icon} alt='Cancel Icon' />
                </span>
                <h2>Update User</h2>
                <form>
                    <label>
                        <input
                            type="text"
                            value={domainId}
                            onChange={(e) => setDomainId(e.target.value)}
                            placeholder="Enter Domain ID"
                        />
                    </label>

                    {/* Name Dropdown - Uneditable */}
                    <label>
                        <select value={name002} disabled>
                            <option>{name002}</option>
                        </select>
                    </label>

                    {/* Access Dropdown - Uneditable */}
                    <label>
                        <select value={access002} disabled>
                            <option>{access002}</option>
                        </select>
                    </label>

                    {/* Bordered Box Displaying Current State, Area, and Site */}
                    <div className="current-values-box" style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px' }}>
                        <p><strong>Current State:</strong> {state002}</p>
                        <p><strong>Current Area:</strong> {area002}</p>
                        <p><strong>Current Site:</strong> {site002}</p>
                    </div>

                    {/* State Dropdown */}
                    <label>
                        <div className="selected-values-container">
                            {(selectedValues779['state'] || []).map((value, index) => (
                                <span className="bubble" key={index}>
                                    {value}{' '}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeBubble('state', value);
                                        }}
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                        <select
                            value={state001}
                            onChange={(e) => {
                                const newState = e.target.value;
                                handleStateChange(newState);
                                addBubble('state', newState);
                            }}
                        >
                            <option value="">Select State</option>
                            {statesData001.map((state, index) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Area Dropdown */}
                    <label>
                        <div className="selected-values-container">
                            {(selectedValues779['area'] || []).map((value, index) => (
                                <span className="bubble" key={index}>
                                    {value}{' '}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeBubble('area', value);
                                        }}
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                        <select
                            value={area001}
                            onChange={(e) => {
                                const newArea = e.target.value;
                                handleAreaChange(newArea);
                                addBubble('area', newArea);
                            }}
                            disabled={!state001}
                        >
                            <option value="">Select Area</option>
                            {areasData001.map((area, index) => (
                                <option key={index} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Site Dropdown */}
                    <label>
                        <div className="selected-values-container">
                            {(selectedValues779['site'] || []).map((value, index) => (
                                <span className="bubble" key={index}>
                                    {value}{' '}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeBubble('site', value);
                                        }}
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                        <select
                            value={site001}
                            onChange={(e) => {
                                const newSite = e.target.value;
                                addBubble('site', newSite);
                            }}
                            disabled={!area001}
                        >
                            <option value="">Select Site</option>
                            {sitesData001.map((site, index) => (
                                <option key={index} value={site}>
                                    {site}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Save Button */}
                    <button type="button" onClick={handleSave}>Save</button>
                </form>
            </div>
        </div>
    );
}

export default UserManagement;


