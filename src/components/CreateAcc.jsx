import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./CreateAcc.css";
import { Link } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

  // formData state matches input names
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    universityEmail: '', // Input name is 'universityEmail'
    university: '',
    year: '',            // Input name is 'year'
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
      const backendUrl = 'http://localhost:8000'; // Ensure this matches your backend port

      const res = await axios.post(`${backendUrl}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.universityEmail, // Map frontend 'universityEmail' to backend 'email'
        university: formData.university,
        academicYear: formData.year,     // Map frontend 'year' to backend 'academicYear'
        major: formData.major,
        password: formData.password,
      });

      // ✅ Store the tokens and user info from the successful registration response
      const { accessToken, refreshToken, user, message: successMessage } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user)); // Store user data

      setMessage({ type: 'success', text: successMessage || 'Account created successfully!' });

      setTimeout(() => {
        navigate('/Homepage'); // Redirect to your Homepage after registration
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

            {/* Input name is 'universityEmail' */}
            <input type="email" name="universityEmail" placeholder="University Email" value={formData.universityEmail} onChange={handleChange} required />

            <select name="university" value={formData.university} onChange={handleChange} required>
              <option value="">Select your university</option>
              <option value="DITU">DITU</option>
              <option value="Graphic Era">Graphic Era</option>
              <option value="UPES">UPES</option>
              <option value="Thapar">Thapar</option>
              <option value="Uttaranchal">Uttaranchal Uni</option>
              <option value="Bennett">Bennett Uni</option>
              <option value="JSS Noida">JSS Noida</option>





              {/* Add more university options as needed */}
            </select>

            <div className="input-row">
              {/* Input name is 'year' */}
              <select name="year" value={formData.year} onChange={handleChange} required>
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

            <button type="submit" className="subbbmit" disabled={loading}>
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