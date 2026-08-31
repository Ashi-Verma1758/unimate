import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CalendarDays, MessageCircle, Plus, Search, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import './HomePage.css';
import Navbar from './Navbar.jsx';
import StatsCard from './StatsCard.jsx';
import ProjectCard from './ProjectCard.jsx';
import TeamInvitationCard from './TeamInvitationCard.jsx';
import JoinRequestCard from './JoinRequestCard.jsx';

const HomePage = ({
    setSelectedConversationId,
    setProjectPosts,
    projectPosts,
    loadingProjects,
    projectsError,
    backendUrl
}) => {
    const navigate = useNavigate();

    const [dashboardSummary, setDashboardSummary] = useState({
        activeProjects: 0,
        completedProjects: 0,
        teamMembers: 0,
    });
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState(null);

    const [teamInvitations, setTeamInvitations] = useState([]);
    const [invitationsLoading, setInvitationsLoading] = useState(true);
    const [invitationsError, setInvitationsError] = useState(null);

    const [joinRequests, setJoinRequests] = useState([]);
    const [joinRequestsLoading, setJoinRequestsLoading] = useState(true);
    const [joinRequestsError, setJoinRequestsError] = useState(null);

    const [selectedMainTab, setSelectedMainTab] = useState('recentPosts');

    const handleViewAllProjects = () => {
        navigate('/all-projects');
    };

    const handleViewAllInvitations = () => {
        navigate('/all-invitations');
    };

    const handleSendJoinRequest = async (projectId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('You must be logged in to send a join request.');
            return;
        }

        const message = prompt('Optional: Add a message with your join request:');
        if (message === null) return;

        try {
            const res = await axios.post(
                `${backendUrl}/api/projects/${projectId}/join`,
                { message },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate('/success', {
                state: { message: res.data.message || 'Join request sent successfully!' }
            });
        } catch (err) {
            console.error('Error sending join request:', err);

            if (err.response?.status === 400 && err.response?.data?.message === 'You have already requested to join this project') {
                setProjectPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === projectId
                            ? { ...post, hasUserSentRequest: true, responseCount: post.responseCount + 1 }
                            : post
                    )
                );
                alert('You have already sent a request to join this project.');
                return;
            }

            navigate('/error', {
                state: { message: err.response?.data?.message || 'Failed to send join request.' }
            });
        }
    };

    const handleRespondToInvitation = async (projectId, fromUserId, status) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Authentication required to respond to invitation.');
            return;
        }

        try {
            const res = await axios.put(
                `${backendUrl}/api/invites/respond/${projectId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTeamInvitations((prevInvitations) =>
                prevInvitations.filter((invite) => invite.projectId !== projectId)
            );

            if (status === 'accepted' && fromUserId) {
                const conversationRes = await axios.get(
                    `${backendUrl}/api/chats/get-or-create-conversation?otherUserId=${fromUserId}&projectId=${projectId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const conversation = conversationRes.data;

                if (conversation?._id) {
                    setSelectedConversationId?.(conversation._id);
                    localStorage.setItem('pendingChatConversationId', conversation._id);
                    navigate('/chat');
                    return;
                }
            }

            navigate('/success', {
                state: { message: res.data.message || `Invitation ${status}` }
            });
        } catch (err) {
            console.error(`Error ${status} invitation:`, err);
            navigate('/error', {
                state: { message: err.response?.data?.message || `Failed to ${status} invitation.` }
            });
        }
    };

    const handleRespondToJoinRequest = async (projectId, requestId, status) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Authentication required to respond.');
            return;
        }

        try {
            const requestToRespond = joinRequests.find((req) => req.requestId === requestId);
            const userIdToRespond = requestToRespond?.requesterUserId;

            if (!userIdToRespond) {
                alert('Could not find user associated with this request.');
                return;
            }

            const res = await axios.patch(
                `${backendUrl}/api/projects/${projectId}/requests/${requestId}/respond/${userIdToRespond}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setJoinRequests((prevRequests) => prevRequests.filter((req) => req.requestId !== requestId));
            navigate('/success', {
                state: { message: res.data.message || `Request ${status}` }
            });
        } catch (err) {
            console.error(`Error ${status} request:`, err);
            navigate('/error', {
                state: { message: err.response?.data?.message || `Failed to ${status} request.` }
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        const fetchDashboardSummary = async () => {
            setSummaryLoading(true);
            setSummaryError(null);

            if (!token) {
                setSummaryError('Authentication required to view dashboard summary. Please log in.');
                setSummaryLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${backendUrl}/api/dashboard/summary`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDashboardSummary(res.data);
            } catch (err) {
                console.error('Error fetching dashboard summary:', err);
                setSummaryError(err.response?.data?.message || 'Failed to load summary.');
            } finally {
                setSummaryLoading(false);
            }
        };

        const fetchTeamInvitations = async () => {
            setInvitationsLoading(true);
            setInvitationsError(null);

            if (!token) {
                setInvitationsError('Authentication required to view team invitations. Please log in.');
                setInvitationsLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${backendUrl}/api/invites/received`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const rawInvites = res.data.data || [];

                setTeamInvitations(rawInvites.map((item) => ({
                    id: item.invitationId,
                    projectId: item.projectId,
                    projectName: item.projectName,
                    fromUserId: item.fromUserId,
                    fromName: item.fromName,
                    fromUniversity: item.fromUniversity,
                    fromAvatar: item.fromAvatar,
                    timeAgo: item.timeAgo,
                })));
            } catch (err) {
                console.error('Error fetching team invitations:', err);
                setInvitationsError(err.response?.data?.message || 'Failed to load invitations.');
            } finally {
                setInvitationsLoading(false);
            }
        };

        const fetchJoinRequests = async () => {
            setJoinRequestsLoading(true);
            setJoinRequestsError(null);

            if (!token) {
                setJoinRequestsError('Authentication required. Please log in to view join requests.');
                setJoinRequestsLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${backendUrl}/api/projects/me/incoming-request`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const allRequests = [];
                (res.data.data || []).forEach((item) => {
                    if (item.request.status === 'pending' && item.requesterDetails) {
                        allRequests.push({
                            requestId: item.request._id,
                            projectId: item.project._id,
                            requesterAvatar: item.requesterDetails.avatar || null,
                            requesterName:
                                item.requesterDetails.firstName && item.requesterDetails.lastName
                                    ? `${item.requesterDetails.firstName} ${item.requesterDetails.lastName}`.trim()
                                    : 'Unknown',
                            requesterMajor: item.requesterDetails.major || 'N/A',
                            requesterAcademicYear: item.requesterDetails.academicYear || 'N/A',
                            requesterUniversity: item.requesterDetails.university || 'N/A',
                            requesterRating: item.requesterDetails.rating || 0,
                            requesterProjectsCount: item.requesterDetails.projectsCount || 0,
                            timeAgo: moment(item.request.sentAt).fromNow(),
                            projectTitle: item.project.title,
                            requestMessage: item.request.message || '',
                            skills: item.requesterDetails.skills || [],
                            requesterUserId: item.requesterDetails._id,
                        });
                    }
                });

                setJoinRequests(allRequests);
            } catch (err) {
                console.error('Error fetching join requests:', err);
                setJoinRequestsError(err.response?.data?.message || 'Failed to load join requests.');
            } finally {
                setJoinRequestsLoading(false);
            }
        };

        fetchDashboardSummary();
        fetchTeamInvitations();
        fetchJoinRequests();
    }, [backendUrl]);

    return (
        <div className="homepage">
            <Navbar />

            <div className="homepage-container">
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">Welcome back!</h1>
                        <p className="welcome-subtitle">Ready to collaborate and build something amazing today?</p>
                    </div>
                    <Link to="/CreatePost">
                        <button className="create-project-button">
                            <Plus size={18} />
                            <span>Create Project</span>
                        </button>
                    </Link>
                </div>

                <div className="stats-grid">
                    {summaryLoading ? (
                        <p className="activity-state">Loading summary stats...</p>
                    ) : summaryError ? (
                        <p className="error-message">{summaryError}</p>
                    ) : (
                        <>
                            <StatsCard number={dashboardSummary.activeProjects} label="Active Projects" />
                            <StatsCard number={dashboardSummary.teamMembers} label="Team Members" />
                            <StatsCard number={dashboardSummary.completedProjects} label="Completed Projects" />
                        </>
                    )}
                </div>

                <div className="homepage-grid">
                    <section className="mains-content">
                        <div className="project-activity-header">
                            <h2 className="project-activity-title">Project Activity</h2>
                            <button type="button" className="view-all-projects-button" onClick={handleViewAllProjects}>
                                View all projects
                            </button>
                        </div>

                        <div className="tabs-container">
                            <button
                                type="button"
                                className={`tab-button ${selectedMainTab === 'recentPosts' ? 'active' : ''}`}
                                onClick={() => setSelectedMainTab('recentPosts')}
                            >
                                Recent Posts
                            </button>
                            <button
                                type="button"
                                className={`tab-button ${selectedMainTab === 'joinRequests' ? 'active' : ''}`}
                                onClick={() => setSelectedMainTab('joinRequests')}
                            >
                                <span>Join Requests</span>
                                {joinRequests.length > 0 && <span className="tab-badge">{joinRequests.length}</span>}
                            </button>
                        </div>

                        {selectedMainTab === 'recentPosts' && (
                            <div className="projects-list">
                                {loadingProjects ? (
                                    <p className="activity-state">Loading project posts...</p>
                                ) : projectsError ? (
                                    <p className="error-message">{projectsError}</p>
                                ) : projectPosts.length === 0 ? (
                                    <p className="activity-state">No project posts found. Time to create one!</p>
                                ) : (
                                    projectPosts.slice(0, 3).map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            projectId={project.id}
                                            author={project.author}
                                            university={project.university}
                                            timeAgo={project.timeAgo}
                                            title={project.title}
                                            description={project.description}
                                            technologies={project.technologies || []}
                                            responseCount={project.responseCount}
                                            avatar={project.avatar}
                                            onSendRequest={handleSendJoinRequest}
                                            hasUserSentRequest={project.hasUserSentRequest}
                                            projectData={project.fullProjectData}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {selectedMainTab === 'joinRequests' && (
                            <div className="join-requests-list">
                                {joinRequestsLoading ? (
                                    <p className="activity-state">Loading join requests...</p>
                                ) : joinRequestsError ? (
                                    <p className="error-message">{joinRequestsError}</p>
                                ) : joinRequests.length === 0 ? (
                                    <p className="activity-state">No new join requests. All caught up!</p>
                                ) : (
                                    joinRequests.map((request) => (
                                        <JoinRequestCard
                                            key={request.requestId}
                                            requestId={request.requestId}
                                            projectId={request.projectId}
                                            requesterAvatar={request.requesterAvatar}
                                            requesterName={request.requesterName}
                                            requesterMajor={request.requesterMajor}
                                            requesterAcademicYear={request.requesterAcademicYear}
                                            requesterUniversity={request.requesterUniversity}
                                            requesterRating={request.requesterRating}
                                            requesterProjectsCount={request.requesterProjectsCount}
                                            timeAgo={request.timeAgo}
                                            projectTitle={request.projectTitle}
                                            requestMessage={request.requestMessage}
                                            skills={request.skills}
                                            onAccept={(projId, reqId) => handleRespondToJoinRequest(projId, reqId, 'accepted')}
                                            onDecline={(projId, reqId) => handleRespondToJoinRequest(projId, reqId, 'rejected')}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </section>

                    <aside className="activity-sidebar">
                        <div className="side-bar-card">
                            <div className="sidebar-header">
                                <Users size={17} />
                                <h3 className="sidebar-title">Team Invitations</h3>
                            </div>
                            <div className="invitations-list">
                                {invitationsLoading ? (
                                    <p className="activity-state compact">Loading invitations...</p>
                                ) : invitationsError ? (
                                    <p className="error-message">{invitationsError}</p>
                                ) : teamInvitations.length === 0 ? (
                                    <p className="activity-state compact">No new team invitations.</p>
                                ) : (
                                    teamInvitations.map((invitation) => (
                                        <TeamInvitationCard
                                            key={invitation.id}
                                            projectId={invitation.projectId}
                                            projectName={invitation.projectName}
                                            fromName={invitation.fromName}
                                            fromUniversity={invitation.fromUniversity}
                                            fromAvatar={invitation.fromAvatar}
                                            timeAgo={invitation.timeAgo}
                                            onAccept={() => handleRespondToInvitation(invitation.projectId, invitation.fromUserId, 'accepted')}
                                            onDecline={() => handleRespondToInvitation(invitation.projectId, invitation.fromUserId, 'rejected')}
                                        />
                                    ))
                                )}
                            </div>
                            <button type="button" className="view-all-invitati" onClick={handleViewAllInvitations}>
                                View All Invitations
                            </button>
                        </div>

                        <div className="side-bar-card quick-actions-card">
                            <h3 className="sidebar-title">Quick Actions</h3>
                            <div className="quick-actions-list">
                                <button type="button" className="quick-action-button" onClick={() => navigate('/Find-Teammates')}>
                                    <Search size={15} />
                                    <span>Find Teammates</span>
                                </button>
                                <button type="button" className="quick-action-button" onClick={() => navigate('/chat')}>
                                    <MessageCircle size={15} />
                                    <span>Open Chat</span>
                                </button>

                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
