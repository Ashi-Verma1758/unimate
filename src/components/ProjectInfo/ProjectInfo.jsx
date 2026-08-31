import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
    ArrowLeft,
    Bookmark,
    Calendar,
    Clock,
    Github,
    Globe,
    MapPin,
    MessageCircle,
    Send,
    Share2,
    Star,
    Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Navbar from '../HomePage/Navbar';
import './ProjectInfo.css';

const fallbackProject = {
    id: null,
    title: 'No Project Selected',
    description: 'No description available. Please navigate from a project card or create a new project.',
    domain: 'General',
    projectType: 'project',
    status: 'Recruiting',
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
    currentTeam: [],
    githubRepo: '',
    figmaLink: '',
    demoLink: '',
    hasUserSentRequest: false,
    author: {
        id: null,
        name: 'N/A',
        university: 'N/A',
        year: 'N/A',
        rating: 0,
        projectsCompleted: 0,
        avatar: null,
        skills: [],
    },
};

const buildProject = (projectData) => {
    if (!projectData) return fallbackProject;

    const creator = projectData.createdBy || {};
    const creatorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || projectData.author || 'Unknown';
    const requiredSkills = (projectData.requiredSkills || []).map((skill) => ({
        skill,
        level: 'Intermediate',
        required: true,
    }));
    const niceToHaveSkills = (projectData.niceToHaveSkills || []).map((skill) => ({
        skill,
        level: 'Any',
        required: false,
    }));
    const currentTeam = projectData.currentTeam?.length
        ? projectData.currentTeam.map((member) => ({
            id: member._id || member.id,
            name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Team Member',
            role: member.role || 'Member',
            skills: member.skills || [],
            avatar: member.avatar || null,
        }))
        : [{
            id: creator._id || creator.id,
            name: creatorName,
            role: 'Project Lead',
            skills: creator.skills || projectData.requiredSkills?.slice(0, 3) || [],
            avatar: creator.avatar || projectData.avatar || null,
        }];

    return {
        id: projectData._id || projectData.id,
        title: projectData.title || fallbackProject.title,
        description: projectData.description || fallbackProject.description,
        domain: projectData.domain || fallbackProject.domain,
        projectType: projectData.projectType || 'project',
        status: projectData.status || 'Recruiting',
        postedDate: projectData.createdAt ? moment(projectData.createdAt).fromNow() : 'Just now',
        timeCommitment: projectData.timeCommitment || 'Flexible',
        duration: projectData.projectDuration || projectData.duration || 'Open ended',
        teamSize: {
            current: projectData.currentTeamCount || currentTeam.length || 1,
            target: parseInt(projectData.teamSize, 10) || 1,
        },
        location: projectData.remote
            ? `${projectData.location || 'Remote'} + Remote friendly`
            : projectData.location || 'Remote',
        startDate: projectData.startDate ? moment(projectData.startDate).format('MMMM D, YYYY') : 'To be decided',
        deadline: projectData.applicationDeadline ? moment(projectData.applicationDeadline).format('MMMM D, YYYY') : 'Rolling',
        responses: projectData.joinRequests?.length || projectData.responseCount || 0,
        views: projectData.views || 0,
        requiredSkills: [...requiredSkills, ...niceToHaveSkills],
        currentTeam,
        githubRepo: projectData.githubRepo || '',
        figmaLink: projectData.figmaLink || '',
        demoLink: projectData.demoLink || '',
        hasUserSentRequest: Boolean(projectData.hasUserSentRequest),
        author: {
            id: creator._id || creator.id,
            name: creatorName,
            university: creator.university || projectData.university || 'N/A',
            year: creator.academicYear || 'Student',
            rating: creator.rating || 4.8,
            projectsCompleted: creator.projectsCompleted || 0,
            avatar: creator.avatar || projectData.avatar || null,
            skills: creator.skills || [],
        },
    };
};

export default function ProjectInfo({ backendUrl = 'http://localhost:8000' }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [currentProject, setCurrentProject] = useState(() => buildProject(location.state?.project));
    const [openingChat, setOpeningChat] = useState(false);

    const project = currentProject;
    const skillTags = useMemo(
        () => project.requiredSkills.map((item) => item.skill).filter(Boolean).slice(0, 8),
        [project.requiredSkills],
    );

    const handleJoinRequest = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('You must be logged in to send a join request.');
            return;
        }

        const message = prompt('Optional: Add a message with your join request:');
        if (message === null) return;

        try {
            const res = await axios.post(
                `${backendUrl}/api/projects/${project.id}/join`,
                { message },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            alert(res.data.message || 'Join request sent successfully!');
            setCurrentProject((previousProject) => ({
                ...previousProject,
                hasUserSentRequest: true,
                responses: previousProject.responses + 1,
            }));
        } catch (err) {
            console.error('Error sending join request:', err);
            if (err.response?.status === 400) {
                setCurrentProject((previousProject) => ({
                    ...previousProject,
                    hasUserSentRequest: true,
                }));
            }
            alert(err.response?.data?.message || 'Failed to send join request. Please try again.');
        }
    };

    const getCurrentUserId = () => {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('accessToken');
        let userId = storedUser?._id || storedUser?.id || null;

        if (!userId && token) {
            try {
                userId = JSON.parse(atob(token.split('.')[1]))?.id || null;
            } catch (error) {
                console.error('Failed to decode user token:', error);
            }
        }

        return userId;
    };

    const handleChatWithTeam = async (preferredMemberId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('You must be logged in to chat with the team.');
            return;
        }

        const currentUserId = getCurrentUserId();
        const teamMemberIds = project.currentTeam
            .map((member) => member.id)
            .filter(Boolean);
        const safePreferredMemberId = preferredMemberId && preferredMemberId !== currentUserId
            ? preferredMemberId
            : null;
        const otherUserId = safePreferredMemberId
            || [project.author.id, ...teamMemberIds].find((memberId) => memberId && memberId !== currentUserId);

        if (!project.id) {
            alert('Project details are missing. Please open the project again.');
            return;
        }

        if (!otherUserId) {
            navigate('/chat');
            return;
        }

        try {
            setOpeningChat(true);
            const response = await axios.get(`${backendUrl}/api/chats/get-or-create`, {
                params: {
                    otherUserId,
                    projectId: project.id,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            const conversation = response.data?.data || response.data;
            if (conversation?._id) {
                localStorage.setItem('pendingChatConversationId', conversation._id);
            }
            navigate('/chat');
        } catch (err) {
            console.error('Error opening team chat:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Failed to open chat. Please try again.');
        } finally {
            setOpeningChat(false);
        }
    };

    return (
        <div className="project-info-page">
            <Navbar />
            <div className="pi-shell">
                <button type="button" className="pi-back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} />
                    Back to search
                </button>

                <div className="pi-layout">
                    <main className="pi-main">
                        <section className="pi-card pi-hero-card">
                            <div className="pi-hero-top">
                                <div className="pi-author">
                                    <div className="pi-avatar">
                                        {project.author.avatar ? (
                                            <img src={project.author.avatar} alt={`${project.author.name}'s avatar`} />
                                        ) : (
                                            project.author.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h2>{project.author.name}</h2>
                                        <p>{project.author.university} &bull; {project.author.year}</p>
                                        <span className="pi-rating">
                                            <Star size={14} />
                                            {project.author.rating} ({project.author.projectsCompleted} projects)
                                        </span>
                                    </div>
                                </div>
                                <div className="pi-icon-actions">
                                    <button
                                        type="button"
                                        className={isBookmarked ? 'active' : ''}
                                        onClick={() => setIsBookmarked((bookmarked) => !bookmarked)}
                                        aria-label="Save project"
                                    >
                                        <Bookmark size={17} />
                                    </button>
                                    <button type="button" aria-label="Share project">
                                        <Share2 size={17} />
                                    </button>
                                </div>
                            </div>

                            <h1>{project.title}</h1>
                            <div className="pi-badges">
                                <span className="pi-badge pi-badge-blue">{project.status}</span>
                                <span className="pi-badge">{project.domain}</span>
                                <span className="pi-badge">Posted {project.postedDate}</span>
                            </div>
                            <div className="pi-description">
                                {project.description.split('\n').filter(Boolean).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        <section className="pi-card pi-details-card">
                            <h2>Project Details</h2>
                            <div className="pi-details-grid">
                                <div className="pi-detail-item">
                                    <Clock size={18} />
                                    <div>
                                        <strong>Time Commitment</strong>
                                        <span>{project.timeCommitment}</span>
                                    </div>
                                </div>
                                <div className="pi-detail-item">
                                    <Calendar size={18} />
                                    <div>
                                        <strong>Duration</strong>
                                        <span>{project.duration}</span>
                                    </div>
                                </div>
                                <div className="pi-detail-item">
                                    <Users size={18} />
                                    <div>
                                        <strong>Team Size</strong>
                                        <span>{project.teamSize.current}/{project.teamSize.target} members</span>
                                    </div>
                                </div>
                                <div className="pi-detail-item">
                                    <MapPin size={18} />
                                    <div>
                                        <strong>Location</strong>
                                        <span>{project.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pi-section-block">
                                <h3>Required Skills</h3>
                                <div className="pi-skill-list">
                                    {project.requiredSkills.length > 0 ? project.requiredSkills.map((item, index) => (
                                        <div className="pi-skill-row" key={`${item.skill}-${index}`}>
                                            <div>
                                                <strong>{item.skill}</strong>
                                                <span className={item.required ? 'pi-skill-required' : 'pi-skill-optional'}>
                                                    {item.required ? 'Required' : 'Nice to have'}
                                                </span>
                                            </div>
                                            <span>{item.level}</span>
                                        </div>
                                    )) : (
                                        <p className="pi-muted">No specific skills listed.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pi-section-block">
                                <h3>Project Links</h3>
                                <div className="pi-links">
                                    {project.githubRepo && (
                                        <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                                            <Github size={15} />
                                            GitHub
                                        </a>
                                    )}
                                    {project.demoLink && (
                                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                                            <Globe size={15} />
                                            Demo
                                        </a>
                                    )}
                                    {project.figmaLink && (
                                        <a href={project.figmaLink} target="_blank" rel="noopener noreferrer">
                                            <Globe size={15} />
                                            Figma
                                        </a>
                                    )}
                                    {!project.githubRepo && !project.demoLink && !project.figmaLink && (
                                        <span className="pi-muted">No project links provided.</span>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="pi-card pi-team-card">
                            <h2>Current Team</h2>
                            <p>Meet the team members already working on this project</p>
                            <div className="pi-team-list">
                                {project.currentTeam.map((member, index) => (
                                    <div className="pi-team-member" key={`${member.name}-${index}`}>
                                        <div className="pi-member-avatar">
                                            {member.avatar ? <img src={member.avatar} alt="" /> : member.name.charAt(0)}
                                        </div>
                                        <div className="pi-member-info">
                                            <h3>{member.name}</h3>
                                            <p>{member.role}</p>
                                            <div>
                                                {member.skills.slice(0, 3).map((skill) => (
                                                    <span key={skill}>{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={`Message ${member.name}`}
                                            onClick={() => handleChatWithTeam(member.id)}
                                            disabled={openingChat}
                                        >
                                            <MessageCircle size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>

                    <aside className="pi-sidebar">
                        <section className="pi-card pi-action-card">
                            <strong>{project.responses}</strong>
                            <span>people interested</span>
                            <h2>Apply by {project.deadline}</h2>
                            <p>Starting {project.startDate}</p>
                            <button
                                type="button"
                                className="pi-join-button"
                                onClick={handleJoinRequest}
                                disabled={project.hasUserSentRequest}
                            >
                                <Send size={16} />
                                {project.hasUserSentRequest ? 'Request Sent' : 'Send Join Request'}
                            </button>
                            <button
                                type="button"
                                className="pi-chat-button"
                                onClick={() => handleChatWithTeam()}
                                disabled={openingChat}
                            >
                                <MessageCircle size={16} />
                                {openingChat ? 'Opening Chat...' : 'Chat with Team'}
                            </button>
                        </section>

                        <section className="pi-card pi-stats-card">
                            <h2>Project Stats</h2>
                            <div><span>Views</span><strong>{project.views}</strong></div>
                            <div><span>Applications</span><strong>{project.responses}</strong></div>
                            <div><span>Team Members</span><strong>{project.teamSize.current}/{project.teamSize.target}</strong></div>
                            <div><span>Posted</span><strong>{project.postedDate}</strong></div>
                        </section>

                        <section className="pi-card pi-tags-card">
                            <h2>Skills Tags</h2>
                            <div>
                                {skillTags.length > 0 ? skillTags.map((skill) => (
                                    <span key={skill}>{skill}</span>
                                )) : (
                                    <span>No skills listed</span>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
