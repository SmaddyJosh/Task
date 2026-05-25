import React, { useState } from 'react';
import './LoginForm.css';

export default function MovieForm() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage('✅ Movie added to database!');
        setTitle('');
        setGenre('');
      } else {
        setStatusMessage('❌ Error: ' + data.message);
      }
    } catch (err) {
      setStatusMessage('❌ Could not connect to the backend server.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <div className="login-header">
          <h2 className="logo">Moviebox<span>.</span></h2>
          <h1>Add a Movie</h1>
          <p>Submit a new movie to the database.</p>
        </div>

        <form onSubmit={handleAddMovie} className="login-form">
          
          <div className="input-group">
            <label htmlFor="title">Movie Title</label>
            <input 
              type="text" 
              id="title"
              placeholder="e.g., Inception" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="genre">Genre</label>
            <input 
              type="text" 
              id="genre"
              placeholder="e.g., Sci-Fi" 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required 
            />
          </div>

          {statusMessage && (
            <div className="error-message" style={{ backgroundColor: statusMessage.includes('✅') ? '#d4edda' : '#fadbd8', color: '#333' }}>
              {statusMessage}
            </div>
          )}

          <button type="submit" className="submit-btn">Save Movie</button>
          
        </form>

      </div>
    </div>
  );
}
