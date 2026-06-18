import React, { useState, useEffect } from 'react';
import './LoginForm.css';

export default function MovieForm({ onLogout }) {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movies');
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      }
    } catch (err) {
      console.error('Failed to fetch movies', err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/movies/${editingId}` 
        : 'http://localhost:5000/api/movies';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, genre })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(editingId ? 'Movie updated successfully!' : 'Movie added successfully!');
        setTitle('');
        setGenre('');
        setEditingId(null);
        fetchMovies();
      } else {
        setStatusMessage('Error: ' + data.message);
      }
    } catch (err) {
      setStatusMessage('Could not connect to the backend server.');
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setTitle(movie.title);
    setGenre(movie.genre);
    setStatusMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStatusMessage('Movie deleted successfully!');
        fetchMovies();
      } else {
        const data = await response.json();
        setStatusMessage('Error: ' + data.message);
      }
    } catch (err) {
      setStatusMessage('Could not connect to the backend server.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setGenre('');
    setStatusMessage('');
  };

  return (
    <div className="login-wrapper" style={{ padding: '2rem' }}>
      <div className="login-card" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="login-header">
          <h2 className="logo">Moviebox<span>.</span></h2>
          <h1>Dashboard</h1>
          <p>Manage your movies (CRUD Operations)</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>{editingId ? 'Edit Movie' : 'Add a Movie'}</h3>
            <form onSubmit={handleSubmit} className="login-form">
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
                <div className="error-message" style={{ backgroundColor: statusMessage.includes('success') ? '#d4edda' : '#fadbd8', color: '#333' }}>
                  {statusMessage}
                </div>
              )}

              <button type="submit" className="submit-btn">
                {editingId ? 'Update Movie' : 'Save Movie'}
              </button>
              
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="submit-btn" style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Movie List</h3>
            {movies.length === 0 ? (
              <p>No movies found. Add one!</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {movies.map(movie => (
                  <li key={movie.id} style={{ 
                    borderBottom: '1px solid #eee', 
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{movie.title}</strong> <br />
                      <small style={{ color: '#666' }}>{movie.genre}</small>
                    </div>
                    <div>
                      <button onClick={() => handleEdit(movie)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(movie.id)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
