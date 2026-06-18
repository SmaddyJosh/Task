import React, { useState } from 'react';
import './LoginForm.css';

export default function LoginForm({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(4, score);
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthLabel = () => {
    switch(strength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const endpoint = isSignUp ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';

    try {
      const payload = isSignUp ? { username, password, role } : { username, password };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignUp) {
          setMessage('Sign up successful! Please sign in.');
          setIsSignUp(false);
          setUsername('');
          setPassword('');
          setRole('client');
        } else {
          localStorage.setItem('token', data.token);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }
      } else {
        setError(data.message || (isSignUp ? 'Sign up failed' : 'Login failed'));
      }
    } catch (err) {
      setError('Could not connect to the server. Is it running?');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <div className="login-header">
          <h2 className="logo">Moviebox<span>.</span></h2>
          <h1>{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
          <p>{isSignUp ? 'Please enter your details to sign up.' : 'Please enter your details to sign in.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {isSignUp && (
            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <option value="client">Client</option>
                <option value="managerial">Managerial</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {isSignUp && password.length > 0 && (
            <div className="password-strength">
              <div className="strength-bars">
                <div className={`bar ${strength >= 1 ? 'active s' + strength : ''}`}></div>
                <div className={`bar ${strength >= 2 ? 'active s' + strength : ''}`}></div>
                <div className={`bar ${strength >= 3 ? 'active s' + strength : ''}`}></div>
                <div className={`bar ${strength >= 4 ? 'active s' + strength : ''}`}></div>
              </div>
              <span className={`strength-label s${strength}`}>{getStrengthLabel()}</span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{message}</div>}

          {!isSignUp && (
            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember for 30 days</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-btn">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          
        </form>

        <p className="signup-prompt">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); setError(''); setMessage(''); }}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </a>
        </p>

      </div>
    </div>
  );
}
