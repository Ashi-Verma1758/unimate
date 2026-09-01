import React from 'react';
import { Check, Mail, Star, Users, X } from 'lucide-react';
import './JoinRequestCard.css';

const JoinRequestCard = ({
  requestId,
  projectId,
  requesterAvatar,
  requesterName,
  requesterMajor,
  requesterAcademicYear,
  requesterUniversity,
  requesterProjectsCount,
  timeAgo,
  projectTitle,
  requestMessage,
  skills = [],
  onAccept,
  onDecline,
}) => {
  const safeName = requesterName || 'Unknown';
  const safeMajor = requesterMajor || 'Computer Science';
  const safeUniversity = requesterUniversity || 'University';
  const safeYear = requesterAcademicYear || 'Junior';
  const safeProjectsCount = requesterProjectsCount || 0;
  const safeRequestMessage = requestMessage || 'I would love to contribute to this project.';

  return (
    <div className="join-request-card">
      <div className="join-request-header">
        <div className="requester-info">
          <div className="requester-avatar">
            {requesterAvatar ? (
              <img src={requesterAvatar} alt={`${safeName}'s avatar`} className="avatar-img" />
            ) : (
              safeName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="requester-details">
            <div className="requester-name-line">
              <h4 className="requester-name">{safeName}</h4>
              <span className="requester-year">{safeYear}</span>
            </div>

            <div className="requester-meta-row">
              <span className="requester-major">{safeMajor}</span>
              <span className="meta-dot">•</span>
              <span className="requester-university">{safeUniversity}</span>
              <span className="meta-dot">•</span>
              <span className="requester-time">{timeAgo}</span>
            </div>

            <div className="requester-stats-row">
              <span className="requester-rating">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <span>4.8</span>
              </span>
              <span className="meta-dot">•</span>
              <span className="requester-projects-count">
                <Users size={14} /> {safeProjectsCount} projects
              </span>
            </div>
          </div>
        </div>

        <div className="request-actions">
          <button className="accept-button" type="button" onClick={() => onAccept(projectId, requestId)}>
            <Check size={15} />
            <span>Accept</span>
          </button>
          <button className="decline-button" type="button" onClick={() => onDecline(projectId, requestId)}>
            <X size={15} />
            <span>Decline</span>
          </button>
        </div>
      </div>

      <div className="project-detail-row">
        <span className="project-detail-label">Requesting to join:</span>
        <span className="project-detail-title">{projectTitle}</span>
      </div>

      <div className="request-message-section">
        <span className="quote-mark">“</span>
        <p className="request-message">{safeRequestMessage}</p>
      </div>

      {skills.length > 0 && (
        <div className="skills-section">
          <span className="skills-label">Skills</span>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRequestCard;