import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import './User_Manegement.css';
import add_admin from '../assets/plus-circle.png';
import cancel_icon from '../assets/close.png';
 
import { BASE_URL } from '../config'
 
function UserManagement() {
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
 
    const handleDelete = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const updatedUsers = users.filter((_, i) => i !== index);
            setUsers(updatedUsers);
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
                            <th>Last Login Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchTerm ? filteredUsers : users).map((user, index) => (
                            <UserRow
                                key={index}
                                user={user}
                                onUpdate={() => handleUpdate(user)}
                                onDelete={() => handleDelete(index)}
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
        <tr>
            <td>{user.name}</td>
            <td>{user.domainId}</td>
            <td>{user.access}</td>
            <td>{user.last_login_time}</td>
            <td>
                <button className='update-button' onClick={onUpdate}>Update Account</button>
                <button className='delete-button' onClick={onDelete}>Delete User</button>
            </td>
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
    const [selectedValues779, setSelectedValues779] = useState({
        state: [],
        area: [],
        site: [],
    });
 
    const [areasData001, setAreasData001] = useState([]);
    const [sitesData001, setSitesData001] = useState([]);
 
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
    const [state, setState] = useState(user.state || '');
    const [area, setArea] = useState(user.area || '');
    const [site, setSite] = useState(user.site || '');
    const [access, setAccess] = useState(user.access.split(', ')); // Convert string to array
 
    const options = ['PM', 'User', 'Admin'];
 
    const handleChange = (event) => {
        const { target: { value } } = event;
        setAccess(typeof value === 'string' ? value.split(',') : value);
    };
 
    const handleSave = () => {
        onSave({
            domainId,
            state,
            area,
            site,
            access: access.join(', ') // Convert array to comma-separated string
        });
    };
 
    return (
        <div className='User_modal'>
            <div className='User_modal-content'>
                <span className='User_close' onClick={onClose}>
                    <img src={cancel_icon} alt='Cancel Icon' />
                </span>
                <h2>Update User Details</h2>
                <form>
                    <label>
                        <input type='text' value={domainId} onChange={(e) => setDomainId(e.target.value)} placeholder='Enter Domain ID' />
                    </label>
                    <label>
                        <select value={state} onChange={(e) => setState(e.target.value)}>
                            <option value=''>Select State</option>
                            {/* Add options here */}
                        </select>
                    </label>
                    <label>
                        <select value={area} onChange={(e) => setArea(e.target.value)}>
                            <option value=''>Select Area</option>
                            {/* Add options here */}
                        </select>
                    </label>
                    <label>
                        <select value={site} onChange={(e) => setSite(e.target.value)}>
                            <option value=''>Select Site</option>
                            {/* Add options here */}
                        </select>
                    </label>
                    <label>
                        <Select
                            multiple
                            value={access}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(', ')}
                            sx={{ width: '350px', height: '43px',marginBottom:'20px' }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    <Checkbox checked={access.indexOf(option) > -1} />
                                    <ListItemText primary={option} />
                                </MenuItem>
                            ))}
                        </Select>
                    </label>
                    <button type='button' onClick={handleSave}>Update</button>
                </form>
            </div>
        </div>
    );
}
 
export default UserManagement;