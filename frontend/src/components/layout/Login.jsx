import "./Login.css";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from 'react-hot-toast';
function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok && data.role === "user") {
        login(data, remember);
        toast.success('Login successfully!', {
          style: {
            border: '1px solid #4ade80',
            padding: '12px 16px',
            color: '#16a34a',
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            borderRadius: '12px',
            background: '#f0fdf4',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          iconTheme: {
            primary: '#16a34a',
            secondary: '#ecfdf5',
          },
        });
        navigate("/");
      } else if (response.ok && data.role === "admin") {
        login(data, remember);
        navigate("/admin");
        toast.success('Login successfully!', {
          style: {
            border: '1px solid #4ade80',
            padding: '12px 16px',
            color: '#16a34a',
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            borderRadius: '12px',
            background: '#f0fdf4',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          iconTheme: {
            primary: '#16a34a',
            secondary: '#ecfdf5',
          },
        });
      } else {
        toast.error(data.detail || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  return (
    
    <div className="login-bg">
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="login-form-container">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="input-icon right"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <a
              href="#"
              className="login-link"
              onClick={e => {
                e.preventDefault();
                alert("Please contact admin to retrieve password.");
              }}
            >
              Forget password
            </a>
          </div>
          <button type="submit" className="login-btn">
            Sign in
          </button>
          <div className="login-or">or</div>
          <div className="login-signup">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
