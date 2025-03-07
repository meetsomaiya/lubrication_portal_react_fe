import React, { useState } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import './User_Manegement.css';
import add_admin from '../assets/plus-circle.png';
import cancel_icon from '../assets/close.png';

function UserManagement() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [users, setUsers] = useState([
        { name: 'Pratik', domainId: 'Domain Id', access: 'User' },
        { name: 'John', domainId: 'Domain Id', access: 'User' },
        { name: 'Jane', domainId: 'Domain Id', access: 'User' },
        { name: 'Doe', domainId: 'Domain Id', access: 'User' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUpdate = (user) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    const handleDelete = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.domainId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='user-management'>
            <div className='search-bar'>
                <input
                    type='text'
                    placeholder='Search by name and domain ID...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='search-button' onClick={handleSearch}>Search</button>
            </div>
            <div className='header_user'>
                <span className='list-admin'>List of User</span>
                <div className='admin-options'>
                    <button className='add-User-button' onClick={() => setShowAddModal(true)}>
                        <img src={add_admin} alt='Add Icon' className='icon' /> Add New User
                    </button>
                </div>
            </div>
            <div className='customerListTable'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain Id</th>
                            <th>Access</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
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
                        const updatedUsers = users.map(u =>
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

    const options = ['PM', 'Lubrication', 'Oil Change'];

    const handleChange = (event) => {
        const { target: { value } } = event;
        setAccess(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSave = () => {
        onSave({
            name: 'New User',
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
                <h2>Register New Admin</h2>
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
                    <button type='button' onClick={handleSave}>Register</button>
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
                <h2>Update Admin</h2>
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
