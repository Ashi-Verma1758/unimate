import React, { useState } from 'react';
import {
    ArrowLeft,
    Bookmark,
    Share2,
    Clock,
    Calendar,
    Users,
    MapPin,
    Star,
    Send,
    MessageCircle,
    Github,
    Globe
} from 'lucide-react';
import './ProjectInfo.css';
import Navbar from '../HomePage/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function ProjectInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');

    // FIX: Correctly retrieve the passed data using the 'project' key
    const passedProjectData = location.state?.project; // Changed from 'fullProjectData' to 'project'

    // Define a default project structure for when no data is passed
    const defaultProject = {
        title: 'No Project Selected',
        description: 'No description available. Please navigate from a project card or create a new project.',
        author: {
            name: 'N/A',
            university: 'N/A',
            year: 'N/A',
            rating: 0,
            projectsCompleted: 0,
            avatar: null
        },
        domain: 'General',
        status: 'N/A',
        postedDate: 'N/A',
        timeCommitment: 'N/A',
        duration: 'N/A',
        teamSize: { current: 0, target: 0 },
        location: 'N/A',
        startDate: 'N/A',
        deadline: 'N/A',
        responses: 0,
        views: 0,
        requiredSkills: [],
        niceToHaveSkills: [],
        currentTeam: [],
        githubRepo: '',
        figmaLink: '',
        demoLink: ''
    };

    // Determine which project data to use: passed data or default
    const project = passedProjectData ? {
        title: passedProjectData.title,
        description: passedProjectData.description,
        domain: passedProjectData.domain,
        projectType: passedProjectData.projectType,
        status: 'Recruiting',
        postedDate: passedProjectData.createdAt ? moment(passedProjectData.createdAt).fromNow() : 'Just now',
        timeCommitment: passedProjectData.timeCommitment,
        duration: passedProjectData.projectDuration,
        teamSize: {
            current: passedProjectData.currentTeamCount || (passedProjectData.createdBy ? 1 : 0),
            target: parseInt(passedProjectData.teamSize) || 1
        },
        location: passedProjectData.remote ? `${passedProjectData.location} (Remote Friendly)` : passedProjectData.location,
        startDate: passedProjectData.startDate ? moment(passedProjectData.startDate).format('YYYY-MM-DD') : 'N/A',
        deadline: passedProjectData.applicationDeadline ? moment(passedProjectData.applicationDeadline).format('YYYY-MM-DD') : 'N/A',
        responses: passedProjectData.joinRequests?.length || 0,
        views: passedProjectData.views || 0,

        // FIX FOR AUTHOR DETAILS: Reconstruct from 'createdBy' (populated user object)
        author: {
            name: passedProjectData.createdBy ? `${passedProjectData.createdBy.firstName || ''} ${passedProjectData.createdBy.lastName || ''}`.trim() : 'Unknown',
            university: passedProjectData.createdBy?.university || 'N/A',
            year: passedProjectData.createdBy?.academicYear || 'N/A',
            rating: passedProjectData.createdBy?.rating || 0,
            projectsCompleted: passedProjectData.createdBy?.projectsCompleted || 0,
            avatar: passedProjectData.createdBy?.avatar || null
        },

        // Correctly map skills. Backend sends string arrays
        requiredSkills: (passedProjectData.requiredSkills || []).map(skill => ({ skill, level: 'Any', required: true }))
            .concat((passedProjectData.niceToHaveSkills || []).map(skill => ({ skill, level: 'Any', required: false }))),

        // FIX FOR CURRENT TEAM: Ensure creator is listed and other accepted members if populated
        currentTeam: passedProjectData.currentTeam ? passedProjectData.currentTeam.map(member => ({
            name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
            role: 'Member', // Or actual role if available
            skills: member.skills || [],
            avatar: member.avatar || null
        })) : (passedProjectData.createdBy ? [{ // Add project creator as first member if no specific team array
            name: `${passedProjectData.createdBy.firstName || ''} ${passedProjectData.createdBy.lastName || ''}`.trim(),
            role: 'Project Lead',
            skills: passedProjectData.createdBy.skills || [],
            avatar: passedProjectData.createdBy.avatar || null
        }] : []),

        githubRepo: passedProjectData.githubRepo,
        figmaLink: passedProjectData.figmaLink,
        demoLink: passedProjectData.demoLink
    } : defaultProject;

    // DEBUGGING: Log the final 'project' object used for rendering
    console.log('ProjectInfo: Final project object used for rendering:', project);

    const handleJoinRequest = () => {
        alert('Join request sent!'); // This needs actual API call logic
        setShowJoinDialog(false);
        setJoinMessage('');
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleBack = () => {
        navigate('/homepage');
    }

    return (
        <div className="project-info">
            <Navbar />
            <div className="project-details">

                <div className="back-button" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    <span>Back to search</span>
                </div>

                <div className="main-content">
                    <div className="left-section">
                        {/* Project Header Card */}
                        <div className="project-header-card">
                            <div className="project-header">
                                <div className="author-info">
                                    <div className="avatar">{project.author?.name?.charAt(0) || '?'}</div>
                                    <div className="author-details">
                                        <h3>{project.author?.name}</h3>
                                        <p>{project.author?.university} • {project.author?.year}</p>
                                        <div className="rating">
                                            <Star size={20} className="star-icon" />
                                            {project.author?.rating} ({project.author?.projectsCompleted} projects)
                                        </div>
                                    </div>
                                </div>
                                <div className="header-actions">
                                    <button
                                        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                                        onClick={handleBookmark}
                                    >
                                        <Bookmark size={22} className={isBookmarked ? 'filled' : ''} />
                                    </button>
                                    <button className="share-btn">
                                        <Share2 size={22} />
                                    </button>
                                </div>
                            </div>

                            <h1 className="project-title">{project.title}</h1>

                            <div className="badges">
                                {project.status && <span className="badge recruiting">{project.status}</span>}
                                {project.domain && <span className="badge domain">{project.domain}</span>}
                                {project.postedDate && <span className="badge posted">Posted {project.postedDate}</span>}
                            </div>

                            <div className="project-description">
                                {(project.description || '').split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="project-details-card">
                            <h3>Project Details</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <Clock size={20} className="detail-icon" />
                                    <div>
                                        <strong>Time Commitment</strong>
                                        <p>{project.timeCommitment}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Calendar size={20} className="detail-icon" />
                                    <div>
                                        <strong>Duration</strong>
                                        <p>{project.duration}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Users size={20} className="detail-icon" />
                                    <div>
                                        <strong>Team Size</strong>
                                        <p>{project.teamSize.current}/{project.teamSize.target} members</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={20} className="detail-icon" />
                                    <div>
                                        <strong>Location</strong>
                                        <p>{project.location || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="required-skills">
                                <h4>Required Skills</h4>
                                {(project.requiredSkills && project.requiredSkills.length > 0) ? (
                                    project.requiredSkills.map((item, index) => (
                                        <div key={index} className="skill-item">
                                            <div className="skill-info">
                                                <span className="skill-name">{item.skill}</span>
                                                <span className={`skill-badge ${item.required ? 'required' : 'optional'}`}>
                                                    {item.required ? 'Required' : 'Nice to have'}
                                                </span>
                                            </div>
                                            <span className="skill-level">{item.level}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No specific skills listed.</p>
                                )}
                            </div>

                            <div className="project-links">
                                <h4>Project Links</h4>
                                {project.githubRepo && (
                                    <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="link-btn">
                                        <Github size={20} />
                                        GitHub
                                    </a>
                                )}
                                {project.figmaLink && (
                                    <a href={project.figmaLink} target="_blank" rel="noopener noreferrer" className="link-btn">
                                        <Globe size={20} />
                                        Figma
                                    </a>
                                )}
                                {project.demoLink && (
                                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="link-btn">
                                        <Globe size={20} />
                                        Demo
                                    </a>
                                )}
                                {!project.githubRepo && !project.figmaLink && !project.demoLink && <p>No project links provided.</p>}
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div className="right-sidebar">
                        <div className="action-card">
                            <div className="interest-count">
                                <div className="count">{project.responses}</div>
                                <div className="count-label">people interested</div>
                            </div>
                            <div className="deadline-info">
                                <div className="deadline">Apply by {project.deadline}</div>
                                <div className="start-date">Starting {project.startDate}</div>
                            </div>
                            <button
                                className="join-btn"
                                onClick={() => setShowJoinDialog(true)}
                            >
                                <Send size={20} />
                                Send Join Request
                            </button>
                            <button className="chat-btn">
                                <MessageCircle size={20} />
                                Chat with Team
                            </button>
                        </div>

                        <div className="stats-card">
                            <h3>Project Stats</h3>
                            <div className="stat-row">
                                <span>Views</span>
                                <span>{project.views}</span>
                            </div>
                            <div className="stat-row">
                                <span>Applications</span>
                                <span>{project.responses}</span>
                            </div>
                            <div className="stat-row">
                                <span>Team Members</span>
                                <span>{project.teamSize.current}/{project.teamSize.target}</span>
                            </div>
                            <div className="stat-row">
                                <span>Posted</span>
                                <span>{project.postedDate}</span>
                            </div>
                        </div>
                        <div className="current-team">
                            <h3>Current Team</h3>
                            <p className="team-subtitle">Meet the team members already working on this project</p>
                            {(project.currentTeam && project.currentTeam.length > 0) ? (
                                project.currentTeam.map((member, index) => (
                                    <div key={index} className="team-member">
                                        <div className="member-avatar">{member.name?.charAt(0) || '?'}</div>
                                        <div className="member-info">
                                            <h4>{member.name}</h4>
                                            <p>{member.role}</p>
                                        </div>
                                        <button className="message-btn">
                                            <MessageCircle size={20} />
                                            Message
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No team members listed yet.</p>
                            )}
                        </div>

                    </div>
                </div>

                {showJoinDialog && (
                    <div className="dialog-overlay" onClick={() => setShowJoinDialog(false)}>
                        <div className="dialog" onClick={(e) => e.stopPropagation()}>
                            <h3>Join Request</h3>
                            <p>Tell the team why you'd be a great fit for this project.</p>
                            <textarea
                                placeholder="Hi! I'm interested in joining your project because..."
                                value={joinMessage}
                                onChange={(e) => setJoinMessage(e.target.value)}
                                rows={4}
                            />
                            <div className="dialog-actions">
                                <button onClick={handleJoinRequest} className="send-btn">Send Request</button>
                                <button onClick={() => setShowJoinDialog(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}