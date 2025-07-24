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
import HomePage from '../HomePage/HomePage';

export default function ProjectInfo() {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');

    // Mock project data
    const project = {
        title: 'AI-Powered Study Assistant',
        description: `We're building an innovative machine learning application designed to revolutionize how students organize their study materials and create personalized learning plans. The platform will use natural language processing to analyze study content, identify knowledge gaps, and recommend optimal learning paths.

Our goal is to create a comprehensive solution that adapts to each student's learning style, tracks progress over time, and integrates with popular educational platforms. This project combines cutting-edge AI technology with practical educational applications.

We're looking for passionate teammates who want to make a real impact on education technology. This is a great opportunity to work with modern ML frameworks, build scalable web applications, and potentially turn this into a startup after the initial development phase.`,
        author: {
            name: 'Sarah Chen',
            university: 'Stanford University',
            year: 'Junior',
            rating: 4.8,
            projectsCompleted: 12
        },
        domain: 'Artificial Intelligence',
        status: 'Recruiting',
        postedDate: '2 hours ago',
        timeCommitment: '10-15 hours/week',
        duration: '3 months',
        teamSize: { current: 2, target: 5 },
        location: 'Remote + Weekly Stanford meetups',
        startDate: 'February 1, 2025',
        deadline: 'January 25, 2025',
        responses: 15,
        views: 234,
        skills: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL', 'Natural Language Processing'],
        requiredSkills: [
            { skill: 'Python', level: 'Intermediate', required: true },
            { skill: 'Machine Learning', level: 'Beginner', required: true },
            { skill: 'React', level: 'Intermediate', required: false },
            { skill: 'UI/UX Design', level: 'Any', required: false }
        ],
        currentTeam: [
            {
                name: 'Sarah Chen',
                role: 'Project Lead & ML Engineer',
                skills: ['Python', 'TensorFlow', 'Leadership']
            },
            {
                name: 'David Kim',
                role: 'Backend Developer',
                skills: ['Node.js', 'PostgreSQL', 'API Design']
            }
        ]
    };

    const handleJoinRequest = () => {
        alert('Join request sent!');
        setShowJoinDialog(false);
        setJoinMessage('');
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };
    const handleBack = () =>{
        
    }

    return (
        <div className="project-info">
            <Navbar />
            <div className="project-details">

                {/* Back button */}
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
                                    <div className="avatar">{project.author.name.charAt(0)}</div>
                                    <div className="author-details">
                                        <h3>{project.author.name}</h3>
                                        <p>{project.author.university} • {project.author.year}</p>
                                        <div className="rating">
                                            <Star size={20} className="star-icon" />
                                            {project.author.rating} ({project.author.projectsCompleted} projects)
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
                                <span className="badge recruiting">{project.status}</span>
                                <span className="badge domain">{project.domain}</span>
                                <span className="badge posted">Posted {project.postedDate}</span>
                            </div>

                            <div className="project-description">
                                {project.description.split('\n\n').map((paragraph, index) => (
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
                                        <p>{project.location || ''}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="required-skills">
                                <h4>Required Skills</h4>
                                {project.requiredSkills.map((item, index) => (
                                    <div key={index} className="skill-item">
                                        <div className="skill-info">
                                            <span className="skill-name">{item.skill}</span>
                                            <span className={`skill-badge ${item.required ? 'required' : 'optional'}`}>
                                                {item.required ? 'Required' : 'Nice to have'}
                                            </span>
                                        </div>
                                        <span className="skill-level">{item.level}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="project-links">
                                <h4>Project Links</h4>
                                <button className="link-btn">
                                    <Github size={20} />
                                    GitHub
                                </button>
                                <button className="link-btn">
                                    <Globe size={20} />
                                    Demo
                                </button>
                            </div>
                        </div>

                        {/* Current Team */}

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
                            {project.currentTeam.map((member, index) => (
                                <div key={index} className="team-member">
                                    <div className="member-avatar">{member.name[0]}</div>
                                    <div className="member-info">
                                        <h4>{member.name}</h4>
                                        <p>{member.role}</p>

                                    </div>
                                    <button className="message-btn">
                                        <MessageCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Join Dialog */}
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