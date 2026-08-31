import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import './ProjectCard.css';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({
    variant = 'default',
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
    projectData,
}) => {
    const navigate = useNavigate();
    const isDiscovery = variant === 'discovery';
    const isButtonDisabled = hasUserSentRequest;
    const visibleTechnologies = isDiscovery ? technologies.slice(0, 4) : technologies;
    const hiddenTechnologyCount = Math.max(technologies.length - visibleTechnologies.length, 0);
    const teamSize = projectData?.teamSize ? `1-${projectData.teamSize} people` : university;
    const timeNeeded = projectData?.timeCommitment || 'Flexible';
    const duration = projectData?.projectDuration || projectData?.duration || 'Open ended';

    const handleViewClick = () => {
        navigate('/ProjectInfo', { state: { project: projectData } });
    };

    return (
        <div className={`projecct-card ${isDiscovery ? 'projecct-card-discovery' : ''}`}>
            <div className="project-header">
                <div className="author-info">
                    <div className="author-avatar">
                        {avatar ? (
                            <img src={avatar} alt={`${author}'s avatar`} className="avatar-img" />
                        ) : (
                            author ? author.charAt(0).toUpperCase() : '?'
                        )}
                    </div>
                    <div className="author-details">
                        <div className="author-name">{author}</div>
                        <div className="author-meta">
                            {isDiscovery ? (
                                <>
                                    <span className="project-type-pill">{projectData?.projectType || 'project'}</span>
                                    <span>{timeAgo}</span>
                                </>
                            ) : (
                                <>{university} &bull; {timeAgo}</>
                            )}
                        </div>
                    </div>
                </div>
                <button className="view-button" onClick={handleViewClick}>
                    {isDiscovery ? 'View Details' : 'View'}
                </button>
            </div>

            <h3 className="project-title">{title}</h3>

            <p className="project-description">{description}</p>

            {technologies.length > 0 && (
                <div className="technologies">
                    {visibleTechnologies.map((tech, index) => (
                        <span key={index} className="tech-tag">
                            {tech}
                        </span>
                    ))}
                    {hiddenTechnologyCount > 0 && (
                        <span className="tech-tag">+{hiddenTechnologyCount} more</span>
                    )}
                </div>
            )}

            <div className="project-footer">
                <div className="project-card-meta">
                    <span className="response-count">
                        <Users size={16} />
                        <span>{isDiscovery ? teamSize : `${responseCount} responses`}</span>
                    </span>
                    {isDiscovery && (
                        <>
                            <span className="response-count">
                                <Clock size={16} />
                                <span>{timeNeeded}</span>
                            </span>
                            <span className="response-count">
                                <Calendar size={16} />
                                <span>{duration}</span>
                            </span>
                        </>
                    )}
                </div>
                <div className="project-card-actions">
                    {isDiscovery && <span className="project-card-response-text">{responseCount} responses</span>}
                    <button
                        className="send-request-button"
                        onClick={() => onSendRequest(projectId)}
                        disabled={isButtonDisabled}
                    >
                        {isButtonDisabled ? 'Request Sent' : 'Send Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
