import React, { useState, useEffect } from 'react';
import './Admin_manegement.css';
import add_admin from '../assets/plus-circle.png';
import cancel_icon from '../assets/close.png';
import moment from 'moment-timezone';
import { BASE_URL } from '../config'

function AdminManagement() {

          let entryTime = null;  // Store the entry time (when user stepped into the page)
          let exitTime = null;   // Store the exit time (when user left the page)
          
          const sendCookiesToBackend = async () => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=');
              acc[key] = decodeURIComponent(value);
              return acc;
            }, {});
          
  // Get the current pathname when using HashRouter
  const pathname = window.location.hash.replace(/^#/, '');
          
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
            //   const response = await fetch('http://localhost:224/api/heartbeat', {
                const response = await fetch(`${BASE_URL}/api/heartbeat`, {
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

                                          const checkAdminIdAndRedirect = () => {
                                            const getCookie = (name) => {
                                              const value = `; ${document.cookie}`;
                                              const parts = value.split(`; ${name}=`);
                                              if (parts.length === 2) return parts.pop().split(';').shift();
                                            };
                                          
                                            const adminId = getCookie('adminId'); // Retrieve the adminId from cookies
                                          
                                            if (!adminId) {
                                              // If adminId is not found, redirect to the default route
                                          //    window.location.href = '/'; // Redirect to the home page or default route
                                          window.location.href = 'https://suzomsuatapps.suzlon.com/apps/fleetmanager_fe/index.html#/signin'; // Redirect to the home page or default route
                                            }
                                          };
                            
                                          useEffect(() => {
                                            checkAdminIdAndRedirect(); // Check adminId and redirect if not found
                                          }, []); // Empty dependency array to ensure this runs only once on mount
                                          
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([
        { name: 'Pratik', domainId: 'Domain Id', access: 'User' },
        { name: 'John', domainId: 'Domain Id', access: 'User' },
        { name: 'Jane', domainId: 'Domain Id', access: 'User' },
        { name: 'Doe', domainId: 'Domain Id', access: 'User' },
    ]);

    // State to hold the filtered users data
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [domainId, setDomainId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [access, setAccess] = useState('');
    const [adminType, setAdminType] = useState('User');

    const handleDelete = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddNewAdmin = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleSaveUser = () => {
        const newUser = { name, domainId, email, access, adminType };
        setUsers([...users, newUser]);
        handleModalClose();
    };

    const deleteAdmin = async (domainId) => {
        try {
            const requestData = { domainId };
            console.log('Data being sent to API:', requestData); // Log the data being sent
    
            // const response = await fetch('http://localhost:224/api/delete_admin', {
                const response = await fetch(`${BASE_URL}/api/delete_admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            const data = await response.json();
            console.log('Response from API:', data);
    
            if (data.success) {
                // If deletion was successful, alert the user and update the state
                alert(`Admin with domainId: ${domainId} deleted successfully.`);
                setUsers(users.filter(user => user.domainId !== domainId));
            } else {
                // Show an alert with the failure message
                alert(`Failed to delete admin: ${data.message}`);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('Error deleting admin:', error.message);
            alert('An error occurred while attempting to delete the admin. Please try again later.');
        }
    };
    
    

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Send GET request to fetch the users data
                // const response = await fetch('http://localhost:224/api/fetch_admins');
                const response = await fetch(`${BASE_URL}/api/fetch_admins`);

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();

                if (data.success) {
                    // Set the users and filteredUsers with the fetched data
                    setUsers(data.data || []); // Ensure data is an array
                    setFilteredUsers(data.data || []); // Ensure data is an array
                }
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array ensures it runs only once when the component mounts

       

    // Function to filter users based on name or domainId
    useEffect(() => {
        const filterData = () => {
            if (!searchTerm) {
                setFilteredUsers(users);
            } else {
                const filtered = users.filter(user => {
                    const domainIdMatch = user.domainId.toLowerCase().includes(searchTerm.toLowerCase());
                    const nameMatch = user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return domainIdMatch || nameMatch;
                });
                setFilteredUsers(filtered);
            }
        };

        filterData();
    }, [searchTerm, users]); // Re-run filtering when users or searchTerm changes

    return (
        <div className='admin-management'>
            <div className='admin-search-bar'>
                <input
                    type='text'
                    placeholder='Search by name and domain ID...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='admin-header'>
                <span className='admin-list-title'>List of Admin</span>
                <div className='admin-options'>
                <button className='add-admin-button' onClick={handleAddNewAdmin}>
                        <img src={add_admin} alt='Add Icon' className='admin-icon' /> Add New Admin
                    </button>
                </div>
            </div>
            <div className='admin-customer-list-table'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain Id</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <AdminUserRow
                                    key={index}
                                    user={user}
                                    deleteAdmin={deleteAdmin} // Pass deleteAdmin function here
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <AdminModal
                    domainId={domainId}
                    setDomainId={setDomainId}
                    name={name}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    access={access}
                    setAccess={setAccess}
                    adminType={adminType}
                    setAdminType={setAdminType}
                    onClose={handleModalClose}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}

// function AdminUserRow({ user, onDelete }) {
//     return (
//         <tr>
//             <td>{user.name}</td>
//             <td>{user.domainId}</td>
//             {/* <td>{user.last_login_time}</td> */}
//             <td>
//                 <button className='admin-delete-button' onClick={onDelete}>Delete Admin</button>
//             </td>
//         </tr>
//     );
// }

function AdminUserRow({ user, deleteAdmin }) {
    return (
        <tr className="user-row">
            <td>{user.name}</td>
            <td>{user.domainId}</td>
            <td>
                <button
                    className='admin-delete-button'
                    onClick={() => deleteAdmin(user.domainId)} // Call deleteAdmin with domainId
                >
                    Delete Admin
                </button>
            </td>
            <td className="last-login-time">{user.last_login_time}</td> {/* Display the last login time */}
        </tr>
    );
}


function AdminModal({
    domainId, setDomainId,
    name, setName,
    email, setEmail,
    onClose, onSave
}) {
    const [access, setAccess] = useState('lubrication');
    const [adminType, setAdminType] = useState('admin');

    const handleSave = async () => {
        const data = {
            domainId,
            name,
            email,
            access,
            adminType,
        };

        console.log("Sending the following data to API:", data);

        try {
            //  const response = await fetch('http://localhost:224/api/register_admin', {
            //    const response = await fetch('http://localhost:3001/api/register_admin', {
                const response = await fetch(`${BASE_URL}/api/register_admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Registration successful:', result);
                alert(result.message || "Registration successful");
            } else {
                console.error('Registration failed:', result);
                alert(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error('Error sending data to API:', error);
            alert("An error occurred while sending data to the API.");
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className='admin-close' onClick={onClose}>
                    <img src={cancel_icon} alt='Cancel Icon' />
                </span>
                <h2>Add New Admin</h2>
                <form>
                    <label>
                        <input
                            type="text"
                            value={domainId}
                            onChange={(e) => setDomainId(e.target.value)}
                            placeholder="Enter Domain ID"
                        />
                    </label>

                    <label>
                        <select
                            value={access}
                            onChange={(e) => setAccess(e.target.value)}
                        >
                            <option value="lubrication">Lubrication</option>
                        </select>
                    </label>

                    <label>
                        <select
                            value={adminType}
                            onChange={(e) => setAdminType(e.target.value)}
                            disabled
                        >
                            <option value="admin" disabled>Admin</option>
                        </select>
                    </label>

                    <button type="button" onClick={handleSave}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default AdminManagement;
