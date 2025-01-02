
import React, { useState } from 'react';
 import './Admin_manegement.css';
import add_admin from '../assets/plus-circle.png';
import cancel_icon from '../assets/close.png';

function AdminManagement() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([
        { name: 'Pratik', domainId: 'Domain Id', email: 'pratik@example.com', access: 'User', adminType: 'User' },
        { name: 'John', domainId: 'Domain Id', email: 'john@example.com', access: 'User', adminType: 'User' },
        { name: 'Jane', domainId: 'Domain Id', email: 'jane@example.com', access: 'User', adminType: 'User' },
        { name: 'Doe', domainId: 'Domain Id', email: 'doe@example.com', access: 'User', adminType: 'User' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [domainId, setDomainId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [access, setAccess] = useState('');
    const [adminType, setAdminType] = useState('User');

    const handleDelete = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            const updatedUsers = users.filter((_, i) => i !== index);
            setUsers(updatedUsers);
        }
    };
    

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddNewAdmin = () => {
        setSelectedUser(null);
        clearFormFields();
        setShowModal(true);
    };

    const handleUpdate = (user, index) => {
        setSelectedUser(index);
        setDomainId(user.domainId);
        setName(user.name);
        setEmail(user.email);
        setAccess(user.access);
        setAdminType(user.adminType);
        setShowModal(true);
    };

    const handleSaveUser = () => {
        const newUser = { name, domainId, email, access, adminType };

        if (selectedUser !== null) {
            // Update existing user
            const updatedUsers = [...users];
            updatedUsers[selectedUser] = newUser;
            setUsers(updatedUsers);
        } else {
            // Add new user
            setUsers([...users, newUser]);
        }
        handleModalClose();
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const clearFormFields = () => {
        setDomainId('');
        setName('');
        setEmail('');
        setAccess('');
        setAdminType('User');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.domainId.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <AdminUserRow
                                key={index}
                                user={user}
                                onDelete={() => handleDelete(index)}
                                onUpdate={() => handleUpdate(user, index)}
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

function AdminUserRow({ user, onDelete, onUpdate }) {
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.domainId}</td>
            <td>{user.email}</td>
            <td>
                <button className='update-button' onClick={onUpdate}>Update Account</button>
                <button className='delete-button' onClick={onDelete}>Delete Admin</button>
            </td>
        </tr>
    );
}

function AdminModal({
    domainId, setDomainId,
    name, setName,
    email, setEmail,
    access, setAccess,
    adminType, setAdminType,
    onClose, onSave
}) {
    return (
        <div className='admin-modal'>
            <div className='admin-modal-content'>
                <span className='admin-close' onClick={onClose}>
                    <img src={cancel_icon} alt='Cancel Icon' />
                </span>
                <h2>{name ? 'Update Admin' : 'Add New Admin'}</h2>
                <form>
                    <label>
                        <input type='text' value={domainId} onChange={(e) => setDomainId(e.target.value)} placeholder='Enter Domain ID' />
                    </label>
                    <label>
                        <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' />
                    </label>
                    <label>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' />
                    </label>
                    <label>
                        <input type='text' value={access} onChange={(e) => setAccess(e.target.value)} placeholder='Select Access' />
                    </label>
                    <label>
                        <select value={adminType} onChange={(e) => setAdminType(e.target.value)}>
                            <option value='User'>User</option>
                            <option value='Admin'>Admin</option>
                            <option value='Sub Admin'>SubAdmin</option>
                        </select>
                    </label>
                    <button type='button' onClick={onSave}>{name ? 'Save Changes' : 'Register'}</button>
                </form>
            </div>
        </div>
    );
}

export default AdminManagement;
