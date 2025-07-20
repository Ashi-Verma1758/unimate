import React from "react";
import "./CreateAcc.css";

const CreateAccount = () => {
  return (
    <div className="container">
      <h1 className="logo">Unimate</h1>
      <p className="subtitle">Join the collaboration revolution</p>

      <div className="form-box">
        <h2>Create account</h2>
        <p>Enter your details</p>

        <form>
          <div className="input-row">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>

          <input type="email" placeholder="University Email" required />

          <select required>
            <option value="">Select your university</option>
            <option value="uni1">University A</option>
            <option value="uni2">University B</option>
          </select>

          <div className="input-row">
            <select required>
              <option value="">Year</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
              <option>5th</option>
            </select>
            <input type="text" placeholder="Computer Science" required />
          </div>

          <input type="password" placeholder="Create password" required />
          <input type="password" placeholder="Confirm password" required />

          <button type="submit">Create account</button>
        </form>

        <p className="signin-text">
          Already have an account? <a href="#">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
