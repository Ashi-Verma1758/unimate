import React from 'react';
import { Users } from 'lucide-react';
import './ProjectCard.css'; // Assuming your CSS file is correctly linked

const ProjectCard = ({
  projectId, // New prop: The ID of the project
  author,
  university,
  timeAgo,
  title,
  description,
  technologies = [],
  responseCount,
  avatar,
  onSendRequest // New prop: Function to call when "Send Request" is clicked
}) => {
  return (
    <div className="project-card">

      <div className="project-header">
        <div className="author-info">
          <div className="author-avatar">
            {/* Conditional rendering for avatar: display image if avatar URL exists, else fallback to first letter */}
            {avatar ? (
              <img src={avatar} alt={`${author}'s avatar`} className="avatar-img" />
            ) : (
              // Fallback to first letter of author's name if no avatar URL
              author ? author.charAt(0).toUpperCase() : '?' // Ensure uppercase for better aesthetics
            )}
          </div>
          <div className='author-details'>
            <div className="author-name">{author}</div>
            <div className="author-meta">
              {university} • {timeAgo}
            </div>
          </div>
        </div>
        <button className="view-button">
          View
        </button>
      </div>


      <h3 className="project-title">
        {title}
      </h3>


      <p className="project-description">
        {description}
      </p>


      {technologies.length > 0 && (
        <div className="technologies">
          {technologies.map((tech, index) => (
            <span
              key={tech} // Changed key to 'tech' assuming technologies are unique strings
              className="tech-tag"
            >
              {tech}
            </span>
          ))}
        </div>
      )}


      <div className="project-footer">
        <div className="response-count">
          <Users size={16} />
          <span>{responseCount} responses</span>
        </div>
        <button
          className="send-request-button"
          onClick={() => onSendRequest(projectId)} // Call the handler with projectId
        >
          Send Request
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;