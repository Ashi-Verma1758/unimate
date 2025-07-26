import React from "react";
import './profile.css';

const StudentProfile = () => {
  return (
    <div className="container">

      {/* Profile Header */}
      <div className="profile-header">
        <img src="https://via.placeholder.com/80" className="avatar" alt="avatar" />
        <div className="info">
          <h2>John Doe</h2>
          <p>Computer Science • Junior</p>
          <p>🎓 MIT • 📍 Joined</p>
          <div className="meta">
            <span>⭐ 0 (0 projects)</span> • 
            <span>👥 0 connections</span>
          </div>
        </div>
        <button className="edit-btn">✏ Edit Profile</button>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <strong>0</strong>
          <p>Total Projects</p>
        </div>
        <div className="stat">
          <strong className="green">0</strong>
          <p>Completed</p>
        </div>
        <div className="stat">
          <strong className="orange">0</strong>
          <p>In Progress</p>
        </div>
        <div className="stat">
          <strong className="blue">0</strong>
          <p>Avg Rating</p>
        </div>
      </div>

      {/* Content */}
      <div className="content">

        {/* Projects */}
        <div className="projects">
          <div className="project-card">
            <img src="https://via.placeholder.com/300x150" alt="project" />
            <div className="badge blue">In Progress</div>
            <p><strong>AI Study Assistant</strong></p>
            <p>Project Lead</p>
          </div>
          <div className="project-card">
            <img src="https://via.placeholder.com/300x150" alt="project" />
            <div className="badge green">Completed</div>
            <p><strong>Mental Health Platform</strong></p>
            <p>Full-Stack Developer</p>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="skills-interests">
          <div className="skills-card">
            <h3>Technical Skills</h3>
            <p>Programming languages and technologies</p>
            <span className="tag">React</span>
            <span className="tag">Python</span>
            <span className="tag">Machine Learning</span>
          </div>
          <div className="skills-card">
            <h3>Interests</h3>
            <p>Areas of focus and passion</p>
            <p className="no-data">No interests listed yet.</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements">
          <div className="achievement">
            <div className="icon">🏆</div>
            <div>
              <strong>HackMIT 2024 Winner</strong>
              <p>First place in the AI/ML track</p>
            </div>
            <span>October 2024</span>
          </div>
          <div className="achievement">
            <div className="icon">💻</div>
            <div>
              <strong>Google Summer of Code</strong>
              <p>Contributed to TensorFlow project</p>
            </div>
            <span>Summer 2024</span>
          </div>
          <div className="achievement">
            <div className="icon">🎓</div>
            <div>
              <strong>Stanford CS Scholarship</strong>
              <p>Merit-based scholarship recipient</p>
            </div>
            <span>September 2023</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews">
          <div className="review">
            <img src="https://via.placeholder.com/40" alt="reviewer" />
            <div>
              <strong>Michael Johnson</strong>
              <p>Mental Health Platform</p>
              <p>Sarah was an incredible team lead. Her technical skills and leadership made our project a huge success.</p>
            </div>
            <span>
              ⭐⭐⭐⭐⭐<br />
              <small>December 2024</small>
            </span>
          </div>
          <div className="review">
            <img src="https://via.placeholder.com/40" alt="reviewer" />
            <div>
              <strong>Emma Wilson</strong>
              <p>Campus Sustainability Tracker</p>
              <p>Sarah's UI/UX work was outstanding and really elevated our app.</p>
            </div>
            <span>
              ⭐⭐⭐⭐⭐<br />
              <small>June 2024</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;