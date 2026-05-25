import React, { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import MovieForm from './MovieForm.jsx';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <MovieForm />
      )}
    </div>
  );
}