import React from 'react';
import { Users } from 'lucide-react';
import './ProjectCard.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of Link

const ProjectCard = ({
    projectId,
    author,
    university,
    timeAgo,
    title,
    description,
    technologies = [],
    responseCount,
    avatar,
    onSendRequest,
    hasUserSentRequest,
    projectData // <-- This prop is crucial and must contain the full project object
}) => {
    const navigate = useNavigate(); // Initialize useNavigate
//  const buttonText = hasUserSentRequest ? 'Request Sent' : 'Send Request';
  const isButtonDisabled = hasUserSentRequest; 
    const handleViewClick = () => {
        // Navigate to the ProjectInfo page, passing the entire projectData object
        // in the 'state' property of the navigation.
        navigate('/ProjectInfo', { state: { project: projectData } });
    };

    return (
        <div className="projecct-card">

            <div className="project-header">
                <div className="author-info">
                    <div className="author-avatar">
                        {avatar ? (
                            <img src={avatar} alt={`${author}'s avatar`} className="avatar-img" />
                        ) : (
                            author ? author.charAt(0).toUpperCase() : '?'
                        )}
                    </div>
                    <div className='author-details'>
                        <div className="author-name">{author}</div>
                        <div className="author-meta">
                            {university} • {timeAgo}
                        </div>
                    </div>
                </div>
                {/* Use a regular button and attach the navigate function to its onClick */}
                <button
                    className="view-button"
                    onClick={handleViewClick} // Call the new handler
                >
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
                            key={index} // Use index as key when tech strings might not be unique
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
                    onClick={() => 
                        onSendRequest(projectId)}
                 disabled={isButtonDisabled} 
          style={{ backgroundColor: isButtonDisabled ? '#ccc' : '#2563eb',
                   cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}
        >
       Send Request
   
      
                </button>
                {/* <button
    className="send-request-button"
    onClick={() => 
        onSendRequest(projectId)
    }
    disabled={isButtonDisabled} 
    style={{ 
        backgroundColor: isButtonDisabled ? '#ccc' : '#2563eb',
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer' 
    }}
>
    {buttonText} 
</button> */}
            </div>
        </div>
    );
};

export default ProjectCard;