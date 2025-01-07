import React, { useState } from 'react';
import './Admin_manegement.css';
import add_admin from '../assets/plus-circle.png'; 
import cancel_icon from '../assets/close.png'; 

function AdminManagement() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([
        { name: 'Pratik', domainId: 'Domain Id', access: 'User' },
        { name: 'John', domainId: 'Domain Id', access: 'User' },
        { name: 'Jane', domainId: 'Domain Id', access: 'User' },
        { name: 'Doe', domainId: 'Domain Id', access: 'User' },
    ]);
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

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.domainId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleSaveUser = () => {
        const newUser = { name, domainId, email, access, adminType };
        setUsers([...users, newUser]);
        handleModalClose();
    };

    return (
        <div className='admin-management'>
            <div className='admin-search-bar'>
                <input
                    type='text'
                    placeholder='Search by name and domain ID...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='admin-search-button' onClick={handleSearch}>Search</button>
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
                        {filteredUsers.map((user, index) => (
                            <AdminUserRow
                                key={index}
                                user={user}
                                onDelete={() => handleDelete(index)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal &&
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
                />}
        </div>
    );
}

function AdminUserRow({ user, onDelete }) {
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.domainId}</td>
            <td>
                <button className='admin-delete-button' onClick={onDelete}>Delete Admin</button>
            </td>
        </tr>
    );
}


function AdminModal({
    domainId, setDomainId,
    name, setName,
    email, setEmail,
    onClose, onSave
}) {
    // Define fresh useState for 'access' and 'adminType'
    const [access, setAccess] = useState('lubrication'); // Default value 'lubrication'
    const [adminType, setAdminType] = useState('admin'); // Default value 'admin' and it will be disabled

    const handleSave = async () => {
        // Prepare the data to be sent
        const data = {
            domainId,
            name,
            email,
            access,     // Selected Access value (lubrication)
            adminType,  // Selected Admin Type value (admin)
        };
    
        // Log the data being sent to the console
        console.log("Sending the following data to API:", data);
    
        try {
            // Send the data to the backend API
            // const response = await fetch('http://localhost:224/api/register_admin', {
            const response = await fetch('http://localhost:3001/api/register_admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                // Handle success (e.g., show a success message)
                console.log('Registration successful:', result);
                alert(result.message || "Registration successful");  // Show success message from API
            } else {
                // Handle failure (e.g., show an error message)
                console.error('Registration failed:', result);
                alert(result.message || "Registration failed. Please try again.");  // Show failure message from API
            }
        } catch (error) {
            // Handle any errors that occur during the request
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

