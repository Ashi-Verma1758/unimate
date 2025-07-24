import React from 'react';
import './createpost.css';

const CreatePost = () => {
  return (
    <div className='body'>
      <header>
        <div className="nav-left">
          <h1>Unimate</h1>
        </div>
      </header>

      <div className="container">
        <h2>Create New Project Post</h2>
        <p>Find the perfect teammates for your next project</p>

        <div className="section">
          <h2>Basic Information</h2>
          <p>Start with the fundamentals of your project</p>
          <label>Project Title *</label>
          <input type="text" placeholder="e.g., AI-Powered Study Assistant" />

          <label>Project Description *</label>
          <textarea
            rows="4"
            placeholder="Describe your project, its goals, and what you hope to achieve..."
          ></textarea>

          <div className="two-col">
            <div>
              <label>Domain *</label>
              <input type="text" placeholder="e.g., Software Development" />
            </div>
            <div>
              <label>Project Type</label>
              <input type="text" placeholder="e.g., Academic Project" />
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Skills & Requirements</h2>
          <p>What skills are you looking for in your teammates?</p>

          <label>Required Skills *</label>
          <div className="input-with-button">
            <input type="text" placeholder="Add a required skill" />
            <button className="plus-btn">+</button>
          </div>

          <label>Nice to Have Skills</label>
          <div className="input-with-button">
            <input type="text" placeholder="Add a nice-to-have skill" />
            <button className="plus-btn">+</button>
          </div>
        </div>

        <div className="section">
          <h2>Timeline & Logistics</h2>
          <p>When and how will your team work together?</p>

          <div className="two-col">
            <div>
              <label>Time Commitment *</label>
              <input type="text" placeholder="Expected time commitment" />
            </div>
            <div>
              <label>Project Duration *</label>
              <input type="text" placeholder="How long is the project?" />
            </div>
          </div>

          <div className="two-col">
            <div>
              <label>Team Size *</label>
              <input type="text" placeholder="How many people do you need?" />
            </div>
            <div>
              <label>Location</label>
              <input type="text" placeholder="e.g., Remote, Campus" />
            </div>
          </div>

          <div className="two-col">
            <div>
              <label>Start Date *</label>
              <input type="text" placeholder="dd-mm-yyyy" />
            </div>
            <div>
              <label>Application Deadline *</label>
              <input type="text" placeholder="dd-mm-yyyy" />
            </div>
          </div>

          <div className="checkbox-row">
            <input type="checkbox" id="remote" />
            <label htmlFor="remote">Remote work is okay</label>
          </div>
        </div>

        <div className="section">
          <h2>Additional Resources (Optional)</h2>
          <p>Share any existing work or resources related to your project</p>

          <label>GitHub Repository</label>
          <input type="text" placeholder="https://github.com/username/repo" />

          <label>Figma Design</label>
          <input type="text" placeholder="https://figma.com/..." />

          <label>Demo/Prototype</label>
          <input type="text" placeholder="https://demo.example.com" />
        </div>

        <div className="footer-buttons">
          <button className="cancel">Cancel</button>
          <button className="preview">Preview</button>
          <button className="publish">Publish Project</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
