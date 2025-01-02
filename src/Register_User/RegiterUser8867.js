import React from 'react';
import './RegisterUser8845.css'; // Ensure the CSS file is correctly imported

const RegisterUser = () => {
    return (
        <div className="register-user-container">
            <h1>Register User</h1>
            <p>Welcome to the Register User Component!</p>
            <form>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterUser;
