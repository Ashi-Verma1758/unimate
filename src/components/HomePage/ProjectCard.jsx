import React from 'react';
import { Users } from 'lucide-react';
import './ProjectCard.css';
const ProjectCard = ({
  author,
  university,
  timeAgo,
  title,
  description,
  technologies = [],
  responseCount,
  avatar
}) => {
  return (
    <div className="project-card">

      <div className="project-header">
        <div className="author-info">
          <div className="author-avatar">
            {avatar || author.charAt(0)}
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
              key={index}
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
        <button className="send-request-button">
          Send Request
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;