import React, { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import MovieForm from './MovieForm.jsx';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <MovieForm onLogout={handleLogout} />
      )}
    </div>
  );
}