// src/components/JoinRequestCard.jsx
import React from 'react';
import { Mail, Star, Users } from 'lucide-react'; // Assuming you have lucide-react installed
import './JoinRequestCard.css'; // Make sure to create this CSS file

const JoinRequestCard = ({
  requestId,       // ID of the specific join request (for backend actions)
  projectId,       // ID of the project the request is for
  requesterAvatar, // Avatar URL of the user who sent the request
  requesterName,
  requesterMajor,
  requesterAcademicYear,
  requesterUniversity,
//   requesterRating, // e.g., 4.8
  requesterProjectsCount, // e.g., 12 projects
  timeAgo,         // e.g., "2 hours ago"
  projectTitle,
  requestMessage,
  skills = [],     // Array of skills (e.g., ['React', 'Python'])
  onAccept,        // Function to call on Accept button click
  onDecline        // Function to call on Decline button click
}) => {
  return (
    <div className="join-request-card">
      <div className="card-header">
        <div className="requester-info">
          <div className="requester-avatar">
            {requesterAvatar ? (
              <img src={requesterAvatar} alt={`${requesterName}'s avatar`} className="avatar-img" />
            ) : (
              requesterName ? requesterName.charAt(0).toUpperCase() : '?'
            )}
          </div>
          <div className="requester-details">
            <h4 className="requester-name">{requesterName}</h4>
            <span className="requester-major">{requesterMajor}</span>
            <span className="requester-academic-year">{requesterAcademicYear}</span>
            <span className="requester-university">{requesterUniversity}</span>
            <div className="requester-meta">
              {/* <span className="requester-rating">
                <Star size={14} fill="currentColor" strokeWidth={0} /> {requesterRating}
              </span> */}
              <span className="requester-projects-count">
                <Users size={14} /> {requesterProjectsCount} projects
              </span>
            </div>
          </div>
        </div>
        <div className="request-actions">
          <button className="acceppt-button" onClick={() => onAccept(projectId, requestId)}>
            Accept
          </button>
          <button className="decliine-button" onClick={() => onDecline(projectId, requestId)}>
            Decline
          </button>
        </div>
      </div>

      <div className="project-detailsss">
        <h4 className="project-title-request">Requesting to join: {projectTitle}</h4>
      </div>

      <div className="request-message-section">
        <Mail size={16} />
        <p className="request-message">"{requestMessage}"</p>
      </div>

      {skills.length > 0 && (
        <div className="skills-section">
          <span className="skills-label">Skills:</span>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="request-time">
        <span className="time-ago">{timeAgo}</span>
      </div>
    </div>
  );
};

export default JoinRequestCard;