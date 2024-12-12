import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import video_t from '../assets/figma_design.mp4';
import logo from '../assets/Frame 10.png';
import './LoginFrom.css';

const Login = ({ setAuth }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the userId and password
    console.log('User ID:', userId);
    console.log('Password:', password);
  
    // Send the userId and password to the API
    try {
        const response = await fetch('http://localhost:224/api/login2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domain_id: userId,
                password: password,
            }),
        });
  
        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data); // Log the API response for debugging
  
            // Assuming the API responds with some success data
            if (data.success) { // Replace this condition with the actual success check
                setAuth(true);
                navigate('/Home');
            } else {
                // Show specific error message from API response
                alert('Login failed: ' + (data.message || 'Invalid user ID or password'));
            }
        } else {
            // Get error details from the API response
            const errorData = await response.json();
            console.error('Login failed:', errorData); // Log error details
            alert('Login failed: ' + (errorData.message || 'Unknown error occurred'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in: ' + error.message);
    }
};

  

  return (
    <main className="relative flex justify-center items-center h-screen w-screen" id='main'>
      <div className="absolute aspect-w-16 aspect-h-9 h-full w-full bg-slate-300 bg-cover z-negative-10 overflow-hidden filter">
        <video autoPlay loop muted className="object-cover h-full w-full">
          <source src={video_t} type="video/mp4" />
        </video>
      </div>
      <div className="absolute aspect-w-16 aspect-h-9 h-full w-full bg-cover z-negative-10 overflow-hidden filter">
        <div className="w-full h-full bg-gradient-to-r from-white-10 via-black-60 to-black"></div>
      </div>
      <div className="w-full h-full flex flex-row items-center justify-center sm:justify-end sm:pr-32 z-10">
        <div className="border pt-4 pb-8 px-8 rounded w-96 h-[420px] flex flex-col items-center justify-between">
          <img src={logo} alt="Logo" className="logo" />
          <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <label className="label" htmlFor="user-id">User ID</label>
            <input
              type="text"
              id="user-id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="input"
            />
            <label className="label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input"
            />
            <button type="submit" className="button">Login</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
