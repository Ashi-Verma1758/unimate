import React, { useState } from "react";
import axios from 'axios'; // Import axios
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import "./Log-In.css";
import {FaEnvelope,FaLock,FaEye,FaEyeSlash,} from "react-icons/fa";


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); 

  const [message, setMessage] = useState({ type: '', text: '' }); // State for messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage({ type: '', text: '' }); // Clear previous messages
    setLoading(true); // Start loading

    try {
     const backendUrl = 'http://localhost:8000';
    const res = await axios.post(`${backendUrl}/api/auth/login`, {
      email: formData.email,
      password: formData.password,
    });

    const { accessToken, refreshToken, user, message: successMessage } = res.data;

    // ✅ Change 'token' to 'accessToken' here
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken); // Ensure refreshToken is also stored
    localStorage.setItem('user', JSON.stringify(user));

      setMessage({ type: 'success', text: successMessage || 'Login successful! Redirecting...' });

      // Redirect to the homepage or dashboard after a short delay
      setTimeout(() => {
        navigate('/Homepage'); // Redirect to your Homepage
      }, 1500);

    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const handleGoogleLogin = () => {
  window.location.href =
    "http://localhost:8000/api/auth/google";
};

  return (
  <div className="login-page">
    <div className="logo-circle">U</div>

    <h3 className="welcome">Welcome back</h3>
    <p className="subtitle">
      Sign in to your Unimate account
    </p>

    <div className="login-card">
      <h2>Sign In</h2>

      <p className="card-subtitle">
        Enter your credentials to access your account
      </p>

      <form onSubmit={handleSubmit}>
        {message.text && (
          <p className={`form-message ${message.type}`}>
            {message.text}
          </p>
        )}

        <label htmlFor="email">
          <FaEnvelope className="label-icon" />
          Email
        </label>

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">
          <FaLock className="label-icon" />
          Password
        </label>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <span
            className="eye-icon"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </span>
        </div>

        <div className="options">
          <label className="remember">
            <input type="checkbox" />
            Remember me
          </label>

          <a href="/">Forgot password?</a>
        </div>

        <button
          type="submit"
          className="signin-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          />
        <span>Sign in with Google</span>
        </button>

        <p className="signup-text">
          Don't have an account?
          <Link to="/signup">
            {" "}
            Sign up here
          </Link>
        </p>
      </form>
    </div>

    <p className="footer">
      By signing in, you agree to our
      <a href="/"> Terms of Service </a>
      and
      <a href="/"> Privacy Policy</a>
    </p>
  </div>
);
};

export default Login;
