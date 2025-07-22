import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./CreateAcc.css";
import { Link } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

  // Corrected formData state to match input names and backend payload
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    universityEmail: '', // Changed from 'email' to match input name and payload
    university: '',
    year: '',            // Changed from 'academicYear' to match input name and payload
    major: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      // Hardcoded localhost URL as requested.
      // IMPORTANT: Remember to change this to your deployed backend URL for production!
      const backendUrl = 'http://localhost:8000';

      const res = await axios.post(`${backendUrl}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email, // This now correctly matches the state and input
        university: formData.university,
        academicYear: formData.academicYear,                       // This now correctly matches the state and input
        major: formData.major,
        password: formData.password,
      });

      setMessage({ type: 'success', text: res.data.message || 'Account created successfully!' });

      setTimeout(() => {
        navigate('/Homepage'); // Redirect to your login page
      }, 2000);

    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maincont">
      <div className="container">
     <Link to="/" className="logo-link"><h1 className="logo">Unimate</h1></Link>
      <p className="subtitle">Join the collaboration revolution</p>

      <div className="form-box">
        <h2>Create account</h2>
        <p>Enter your details</p>

        <form onSubmit={handleSubmit}>
          {message.text && (
            <p className={`form-message ${message.type}`}>
              {message.text}
            </p>
          )}

          <div className="input-row">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>

          <input type="email" name="email" placeholder="University Email" value={formData.email} onChange={handleChange} required />

          <select name="university" value={formData.university} onChange={handleChange} required>
            <option value="">Select your university</option>
            <option value="University A">University A</option>
            <option value="University B">University B</option>
            {/* Add more university options as needed */}
          </select>

          <div className="input-row">
            <select name="academicYear" value={formData.academicYear} onChange={handleChange} required>
              <option value="">Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="5th">5th</option>
            </select>
            <input type="text" name="major" placeholder="e.g., Computer Science" value={formData.major} onChange={handleChange} required />
          </div>

          <input type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="signin-text">
          Already have an account? <a href="/login">Sign In</a>
          {/* Consider using <Link to="/login">Sign In</Link> if /login is a React Router route */}
        </p>
      </div>
    </div>
    </div>
  );
}

export default CreateAccount;