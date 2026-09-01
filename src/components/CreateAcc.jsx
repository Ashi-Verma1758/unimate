import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./CreateAcc.css";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaBuilding,
  FaGraduationCap,
  FaCalendarAlt,
} from "react-icons/fa";

function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    universityEmail: "",
    university: "",
    year: "",
    major: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const backendUrl = "http://localhost:8000";

      const res = await axios.post(`${backendUrl}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.universityEmail,
        university: formData.university,
        academicYear: formData.year,
        major: formData.major,
        password: formData.password,
      });

      const { accessToken, refreshToken, user, message: successMessage } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage({
        type: "success",
        text: successMessage || "Account created successfully!",
      });

      setTimeout(() => {
        navigate("/Homepage");
      }, 2000);
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  return (
    <div className="login-page signup-page">
      <div className="logo-circle">U</div>

      <h3 className="welcome">Create your account</h3>
      <p className="subtitle">Join the Unimate community</p>

      <div className="login-card signup-card">
        <h2>Sign Up</h2>

        <p className="card-subtitle">Enter your details to start collaborating</p>

        <form onSubmit={handleSubmit} className="signup-form">
          {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}

          <div className="input-row">
            <div className="field-group">
              <label htmlFor="firstName">
                <FaUser className="label-icon" />
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="lastName">
                <FaUser className="label-icon" />
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="universityEmail">
              <FaEnvelope className="label-icon" />
              University Email
            </label>
            <input
              type="email"
              id="universityEmail"
              name="universityEmail"
              placeholder="Enter your university email"
              value={formData.universityEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="university">
              <FaBuilding className="label-icon" />
              University
            </label>
            <select
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            >
              <option value="">Select your university</option>
              <option value="DITU">DITU</option>
              <option value="Graphic Era">Graphic Era</option>
              <option value="UPES">UPES</option>
              <option value="Thapar">Thapar</option>
              <option value="Uttaranchal">Uttaranchal Uni</option>
              <option value="Bennett">Bennett Uni</option>
              <option value="JSS Noida">JSS Noida</option>
            </select>
          </div>

          <div className="input-row">
            <div className="field-group">
              <label htmlFor="year">
                <FaCalendarAlt className="label-icon" />
                Year
              </label>
              <select id="year" name="year" value={formData.year} onChange={handleChange} required>
                <option value="">Year</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="major">
                <FaGraduationCap className="label-icon" />
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                placeholder="Computer Science"
                value={formData.major}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="password">
              <FaLock className="label-icon" />
              Password
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="confirmPassword">
              <FaLock className="label-icon" />
              Confirm Password
            </label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button type="button" className="google-btn" onClick={handleGoogleSignup}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
            />
            <span>Sign up with Google</span>
          </button>

          <p className="signup-text">
            Already have an account?
            <Link to="/login"> Sign in here</Link>
          </p>
        </form>
      </div>

      <p className="footer">
        By signing up, you agree to our
        <a href="/"> Terms of Service </a>
        and
        <a href="/"> Privacy Policy</a>
      </p>
    </div>
  );
}

export default CreateAccount;
