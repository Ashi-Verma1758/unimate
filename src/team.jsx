import React from "react";
import "./team.css";

const FindTeammates = () => {
  return (
    <main>
      <div className="checkbox-group">
        <h4>Skills</h4>
        <label><input type="checkbox" /> React</label>
        <label><input type="checkbox" /> Python</label>
        <label><input type="checkbox" /> JavaScript</label>
        <label><input type="checkbox" /> Node.js</label>
        <label><input type="checkbox" /> Java</label>
        <label><input type="checkbox" /> C++</label>
        <label><input type="checkbox" /> TypeScript</label>

        <h4>Interests</h4>
        <label><input type="checkbox" /> AI/ML</label>
        <label><input type="checkbox" /> Web Development</label>
        <label><input type="checkbox" /> Mobile Development</label>
        <label><input type="checkbox" /> Data Science</label>
        <label><input type="checkbox" /> Cybersecurity</label>
        <label><input type="checkbox" /> Game Dev</label>
        <label><input type="checkbox" /> Cloud</label>
      </div>

      <section className="teammates">
        <h2>Find Teammates</h2>
        <p className="subtext">
          Discover talented students to collaborate with on your next project
        </p>
        <input
          type="text"
          placeholder="Search by name, skills, major, or interests..."
        />

        <div className="cards">
          <div className="card">
            <div className="card-header">
              <img
                src="https://via.placeholder.com/60"
                alt="Profile"
              />
              <div>
                <h3>
                  Alex Chen <span className="verified">✔</span>
                </h3>
                <p>Junior • Computer Science • Stanford University</p>
                <p>Palo Alto, CA • Active 2 hours ago</p>
              </div>
            </div>

            <p className="desc">
              Passionate full-stack developer with experience in React, Node.js,
              and machine learning. Looking to collaborate on innovative
              projects that make a positive impact on student life and
              education.
            </p>

            <div className="tags">
              <strong>Skills:</strong>
              <span>React</span>
              <span>Node.js</span>
              <span>Python</span>
              <span>Machine Learning</span>
              <span>MongoDB</span>
            </div>

            <div className="tags">
              <strong>Interests:</strong>
              <span>Web Development</span>
              <span>AI/ML</span>
              <span>Hackathons</span>
            </div>

            <div className="footer">
              ⭐ 4.8 • 12 projects • 95% response rate
              <div className="actions">
                <button>Message</button>
                <button className="primary">Connect</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FindTeammates;
