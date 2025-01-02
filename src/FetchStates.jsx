import React, { useEffect, useState } from 'react';

const FetchStates = () => {
  const [states, setStates] = useState([]);

  useEffect(() => {
    // Call backend API
    fetch('/api/get_states') // Automatically redirects to http://localhost:3001/api/get_states
      .then((response) => response.json())
      .then((data) => {
        setStates(data); // Save data in state
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>States Data</h1>
      <ul>
        {states.map((state, index) => (
          <li key={index}>{state.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchStates;
