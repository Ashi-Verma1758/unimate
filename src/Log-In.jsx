import React, { useState } from "react";
import axios from 'axios'; // Import axios
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import "./Log-In.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' }); // State for messages
  const [loading, setLoading] = useState(false); // State for loading indicator

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

  return (
    <div className="container">
      {/* "Unimate" logo linking to homepage */}
      <Link to="/" className="logo-link">
        <h1 className="logo">Unimate</h1>
      </Link>
      <p className="subtitle">Welcome back to your collaboration hub</p>

      <div className="form-box">
        <h2>Sign in</h2>
        <p className="description">
          Enter your email and password to access your account
        </p>

        <form onSubmit={handleSubmit}> {/* Attach the handleSubmit to the form */}
          {/* Display messages */}
          {message.text && (
            <p className={`form-message ${message.type}`}>
              {message.text}
            </p>
          )}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email" // Added name attribute
            placeholder="Enter your university email"
            value={formData.email} // Controlled component
            onChange={handleChange} // Handle input changes
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type="password"
              id="password"
              name="password" // Added name attribute
              placeholder="Enter your password"
              value={formData.password} // Controlled component
              onChange={handleChange} // Handle input changes
              required
            />
          </div>

          <div className="forgot">
            <a href="#">Forgot password?</a> {/* Consider a <Link to="/forgot-password"> */}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/signup">Sign up</Link> {/* Use Link to your signup page */}
        </p>
      </div>
    </div>
  );
};

export default Login;