import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Users, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

import './HomePage.css';
// import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


// Import your components - adjust paths based on your actual structure
import Navbar from './Navbar.jsx';
import StatsCard from './StatsCard.jsx';
import ProjectCard from './ProjectCard.jsx';
import TeamInvitationCard from './TeamInvitationCard.jsx';
import JoinRequestCard from './JoinRequestCard.jsx';


const HomePage = ({
    setSelectedConversationId,
    projectPosts,      // Received from App.js's consolidated state
    loadingProjects,   // Received from App.js's consolidated state
    projectsError,     // Received from App.js's consolidated state
    backendUrl
}) => {

    const navigate = useNavigate();

    // Dashboard Summary and other states remain local to HomePage
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

const location=useLocation();
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

const handleViewAllProjects = () => {
        navigate('/all-projects');
    };
    const handleViewAllInvitations = () => {
    navigate('/all-invitations');
};

    const handleSendJoinRequest = async (projectId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) { alert('You must be logged in to send a join request.'); return; }
        const message = prompt('Optional: Add a message with your join request:');
        if (message === null) { return; }
        try {
            const res = await axios.post(`${backendUrl}/api/projects/${projectId}/join`, { message }, { headers: { Authorization: `Bearer ${token}` } });
            navigate('/success', {
  state: { message: res.data.message || 'Join request sent successfully!' }
});

            // You might want to refresh joinRequests or project info here if the status changes immediately
        } catch (err) {
            console.error('Error sending join request:', err);
            navigate('/error', {
  state: { message: err.response?.data?.message || `Failed to ${status} invitation.` }
});

        }
    };

    const handleRespondToInvitation = async (projectId, fromUserId, status) => {
        const token = localStorage.getItem('accessToken');
        if (!token) { alert('Authentication required to respond to invitation.'); return; }
        try {
            const res = await axios.put(`${backendUrl}/api/invites/respond/${projectId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
           navigate('/success', {
  state: { message: res.data.message || 'Join request sent successfully!' }
});
;
            // Update invitations list on successful response
            setTeamInvitations(prevInvitations => prevInvitations.filter(invite => invite.projectId !== projectId));
            if (status === 'accepted') {
                const conversationRes = await axios.get(`${backendUrl}/api/chats/get-or-create-conversation?otherUserId=${fromUserId}&projectId=${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
                const conversation = conversationRes.data;
                if (conversation && conversation._id) {
                    setSelectedConversationId(conversation._id);
                    navigate('/chat');
                } else {
                    console.error("Failed to get or create conversation: No conversation ID returned.");
                    alert("Invitation accepted, but could not open chat. Please navigate to chat manually.");
                }
            }
        } catch (err) {
            console.error(`Error ${status} invitation:`, err);
            navigate('/error', {
  state: { message: err.response?.data?.message || `Failed to ${status} invitation.` }
});

        }
    };

    const handleRespondToJoinRequest = async (projectId, requestId, status) => {
        const token = localStorage.getItem('accessToken');
        if (!token) { alert('Authentication required to respond.'); return; }
        try {
            const requestToRespond = joinRequests.find(req => req.requestId === requestId);
           const userIdToRespond = requestToRespond?.requesterUserId;
            // const userIdToRespond = requestToRespond?.requesterDetails?._id;
            if (!userIdToRespond) { alert('Could not find user associated with this request for backend processing.'); return; }
            const res = await axios.patch(`${backendUrl}/api/projects/${projectId}/requests/${requestId}/respond/${userIdToRespond}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            navigate('/success', {
  state: { message: res.data.message || 'Join request sent successfully!' }
});

            // Update join requests list on successful response
            setJoinRequests(prevRequests => prevRequests.filter(req => req.requestId !== requestId));
        } catch (err) {
            console.error(`Error ${status} request:`, err);
            navigate('/error', {
  state: { message: err.response?.data?.message || `Failed to ${status} invitation.` }
});

        }
    };

    

    // Data Fetching Logic for local states (summary, invites, requests)
   // 2. Main fetching logic — runs only when refreshTrigger changes
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
            const rawInvites = res.data.data;
            setTeamInvitations(rawInvites.map(item => ({
                id: item.invitationId,
                projectId: item.projectId,
                projectName: item.projectName,
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
            res.data.data.forEach(item => {
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

    // Call all fetch functions
    fetchDashboardSummary();
    fetchTeamInvitations();
    fetchJoinRequests();
}, [refreshTrigger]); // Runs only when refresh is triggered



    useEffect(() => {
        console.log("DEBUG: Current teamInvitations state:", teamInvitations);
        console.log("DEBUG: Current teamInvitations length:", teamInvitations.length);
    }, [teamInvitations]);

    // Debugging logs for props received from App.js
    useEffect(() => {
        console.log('HomePage.jsx: Rerendering/Props Update.');
        console.log('  Received projectPosts count:', projectPosts.length);
        console.log('  Received loadingProjects:', loadingProjects);
        console.log('  Received projectsError:', projectsError);
        console.log('  Sliced projectPosts count for display:', projectPosts.slice(0, 3).length);
        if (projectPosts.length > 0 && !loadingProjects && !projectsError) {
            console.log('  HomePage should now display posts!');
        }
    }, [projectPosts, loadingProjects, projectsError]);


    return (
        <div className="homepage">
            <Navbar />

            <div className="homepage-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className='welcome-content'>
                        <h1 className="welcome-title">Welcome back!! 👋</h1>
                        <p className="welcome-subtitle">Ready to collaborate and build something amazing today?</p>
                    </div>
                    <Link to="/CreatePost">
                        <button className="create-project-button">
                            <Plus size={20} />
                            <span>Create Project</span>
                        </button>
                    </Link>
                </div>

                {/* Stats Cards Section - uses HomePage's local state for Dashboard Summary */}
                <div className="stats-grid">
                    {summaryLoading ? (<p>Loading summary stats...</p>) : summaryError ? (<p className="error-message">{summaryError}</p>) : (
                        <>
                            <StatsCard number={dashboardSummary.activeProjects} label="Active Projects" />
                            <StatsCard number={dashboardSummary.teamMembers} label="Team Members" />
                            <StatsCard number={dashboardSummary.completedProjects} label="Completed Projects" />
                        </>
                    )}
                </div>

                {/* Homepage Grid */}
                <div className="homepage-grid">
                    <div className="mains-content">
                        <div className="section-header tabs-container">
                            <button className={`tab-button ${selectedMainTab === 'recentPosts' ? 'active' : ''}`} onClick={() => setSelectedMainTab('recentPosts')}>Recent Posts</button>
                            <button className={`tab-button ${selectedMainTab === 'joinRequests' ? 'active' : ''}`} onClick={() => setSelectedMainTab('joinRequests')}>
                                Join Requests {joinRequests.length > 0 && <span className="tab-badge">{joinRequests.length}</span>}
                            </button>
                        </div>
                        {selectedMainTab === 'recentPosts' && (
                            <div className="view-all-button-container">
                                <span className="view-all-buttonlala" onClick={handleViewAllProjects}>View all Projects</span>
                            </div>
                        )}

                        {selectedMainTab === 'recentPosts' && (
                            <div className="projects-list">
                                {loadingProjects ? (
                                    <p>Loading project posts...</p>
                                ) : projectsError ? (
                                    <p className="error-message">{projectsError}</p>
                                ) : projectPosts.length === 0 ? (
                                    <p>No project posts found. Time to create one! 🌟</p>
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
                                            projectData={project.fullProjectData} // Passing full data for ProjectInfo
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {selectedMainTab === 'joinRequests' && (
                            <div className="join-requests-list">
                                {joinRequestsLoading ? (<p>Loading join requests...</p>) : joinRequestsError ? (<p className="error-message">{joinRequestsError}</p>) : joinRequests.length === 0 ? (<p>No new join requests. All caught up! 🎉</p>) : (
                                    joinRequests.map((request) => (
                                        <JoinRequestCard
                                            key={request.requestId} requestId={request.requestId} projectId={request.projectId}
                                            requesterAvatar={request.requesterAvatar} requesterName={request.requesterName}
                                            requesterMajor={request.requesterMajor} requesterAcademicYear={request.requesterAcademicYear}
                                            requesterUniversity={request.requesterUniversity} requesterRating={request.requesterRating}
                                            requesterProjectsCount={request.requesterProjectsCount} timeAgo={request.timeAgo}
                                            projectTitle={request.projectTitle} requestMessage={request.requestMessage} skills={request.skills}
                                            onAccept={(projId, reqId) => handleRespondToJoinRequest(projId, reqId, 'accepted')}
                                            onDecline={(projId, reqId) => handleRespondToJoinRequest(projId, reqId, 'rejected')}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    {/* Sidebar - fetches teamInvitations from backend */}
                    <div className="side-bar">
                        <div className="side-bar-card">
                            <div className="sidebar-header">
                                <Users size={20} />
                                <h3 className="sidebar-title">Team Invitations 📧</h3>
                            </div>
                            <div className="invitations-list">
                                {invitationsLoading ? (<p>Loading invitations...</p>) : invitationsError ? (<p className="error-message">{invitationsError}</p>) : teamInvitations.length === 0 ? (<p>No new team invitations. All caught up! 🎉</p>) : (
                                    teamInvitations.map((invitation) => (
                                        <TeamInvitationCard
                                            key={invitation.id} projectId={invitation.projectId} projectName={invitation.projectName}
                                            fromName={invitation.fromName} fromUniversity={invitation.fromUniversity} fromAvatar={invitation.fromAvatar}
                                            timeAgo={invitation.timeAgo}
                                            onAccept={() => handleRespondToInvitation(invitation.projectId, 'accepted')}
                                            onDecline={() => handleRespondToInvitation(invitation.projectId, 'rejected')}
                                        />
                                    ))
                                )}
                            </div>
                            <button className="view-all-invitations" onClick={handleViewAllInvitations}>View All Invitations</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;