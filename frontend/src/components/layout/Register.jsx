import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Register successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Register failed!');
      }
    } catch (error) {
      alert('Register error!');
      console.error(error);
    }
  };

  return (
    <div className="login-bg">
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="login-form-container">
        <h1 className="login-title">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              placeholder="Email*"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="text"
              placeholder="Username*"
              required
              autoComplete="username"
              value={username}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              required
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span
              className="input-icon right"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(prev => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password*"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
            <span
              className="input-icon right"
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirm(prev => !prev)}
            >
              <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
            </span>
          </div>
          <button type="submit" className="login-btn">Register</button>
          <div className="login-or">or</div>
          <div className="login-signup">
            You already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;