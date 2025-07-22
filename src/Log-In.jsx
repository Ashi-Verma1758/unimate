import React from "react";
import "./Log-In.css"; 
const Login = () => {
  return (
    <div className="container">
      <h1 className="logo">Unimate</h1>
      <p className="subtitle">Welcome back to your collaboration hub</p>

      <div className="form-box">
        <h2>Sign in</h2>
        <p className="description">
          Enter your email and password to access your account
        </p>

        <form>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your university email"
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Sign in</button>
        </form>

        <p className="switch">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
