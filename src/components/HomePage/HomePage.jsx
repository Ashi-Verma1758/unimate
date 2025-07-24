import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react';
import moment from 'moment'; // Import moment.js for timeAgo calculations
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
// Import your components
import Navbar from './Navbar.jsx';
import StatsCard from './StatsCard.jsx';
import ProjectCard from './ProjectCard.jsx';
import TeamInvitationCard from './TeamInvitationCard.jsx';
import CreatePost from '../createpost.jsx';
const HomePage = ({ setSelectedConversationId }) => {
  // State for Dashboard Summary
   const navigate = useNavigate();
  const [dashboardSummary, setDashboardSummary] = useState({
    activeProjects: 0,
    completedProjects: 0,
    teamMembers: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  // State for Project Posts
  const [projectPosts, setProjectPosts] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  // State for Team Invitations
  const [teamInvitations, setTeamInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);
  const [invitationsError, setInvitationsError] = useState(null);

  // Hardcoded backend URL for all API calls
  const backendUrl = 'http://localhost:8000'; // Ensure this matches your backend's running port

  // Handler for sending a join request to a project
  const handleSendJoinRequest = async (projectId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('You must be logged in to send a join request.');
      return;
    }

    const message = prompt('Optional: Add a message with your join request:');
    if (message === null) {
      return; // User cancelled the prompt
    }

    try {
      const res = await axios.post(`${backendUrl}/api/projects/${projectId}/join`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || 'Join request sent successfully!');
      // Consider logic to update the ProjectCard to reflect the sent request
    } catch (err) {
      console.error('Error sending join request:', err);
      alert(err.response?.data?.message || 'Failed to send join request. Please try again.');
    }
  };

  // Handlers for accepting/declining team invitations
  const handleRespondToInvitation = async (projectId, fromUserId, status) => { // <--- Receive fromUserId
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Authentication required to respond to invitation.');
      return;
    }

    try {
      // 1. Respond to the invitation (accept/reject)
      const res = await axios.put(`${backendUrl}/api/invites/respond/${projectId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || `Invitation ${status} successfully!`);

      // Update UI: Remove the invitation from the list
      setTeamInvitations(prevInvitations =>
        prevInvitations.filter(invite => invite.projectId !== projectId)
      );

      // 2. If accepted, get or create the conversation and navigate
      if (status === 'accepted') {
        console.log("Attempting to get or create conversation...");
        const conversationRes = await axios.get(
          `${backendUrl}/api/chats/get-or-create-conversation?otherUserId=${fromUserId}&projectId=${projectId}`, // <--- Pass otherUserId and projectId
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const conversation = conversationRes.data; // Assuming your backend returns the conversation directly
        console.log("Conversation obtained:", conversation);

        if (conversation && conversation._id) {
          setSelectedConversationId(conversation._id); // Update selected conversation ID in App.jsx
          navigate('/chat'); // Navigate to the chat window
        } else {
          console.error("Failed to get or create conversation: No conversation ID returned.");
          alert("Invitation accepted, but could not open chat. Please navigate to chat manually.");
        }
      }

    } catch (err) {
      console.error(`Error ${status} invitation:`, err);
      alert(err.response?.data?.message || `Failed to ${status} invitation. Please try again.`);
    }
  };

  // --- All Data Fetching Logic (consolidated in one useEffect) ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Get token once

    // Function to fetch Dashboard Summary
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardSummary(res.data);
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setSummaryError(err.response?.data?.message || 'Failed to load summary.');
      } finally {
        setSummaryLoading(false);
      }
    };

    // Function to fetch Project Posts
    const fetchProjectPosts = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${backendUrl}/api/projects`, { headers });

        // Map the backend response to match ProjectCard props
        const formattedProjects = res.data.map(project => ({
          id: project._id, // Use _id as 'id' for key and prop
          // ASSUMPTION: 'createdBy' is populated with 'name', 'email'.
          // 'university' and 'avatar' are NOT populated by your current backend 'getAllProjects'.
         author: project.createdBy ? `${project.createdBy.firstName || ''} ${project.createdBy.lastName || ''}`.trim() : 'Unknown',
         university: project.createdBy ? project.createdBy.university : 'N/A',// Cannot get from current backend `getAllProjects` without change
          timeAgo: moment(project.createdAt).fromNow(), // Uses moment.js for formatting
          title: project.title,
          description: project.description,
          technologies: project.requiredSkills || [],
          responseCount: project.joinRequests ? project.joinRequests.length : 0,
          avatar: null // Cannot get from current backend `getAllProjects` without change
        }));
        setProjectPosts(formattedProjects);
      } catch (err) {
        console.error('Error fetching project posts:', err);
        setProjectsError(err.response?.data?.message || 'Failed to load projects.');
      } finally {
        setProjectsLoading(false);
      }
    };

    // Function to fetch Team Invitations
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
          headers: { Authorization: `Bearer ${token}` },
        });

        // Your `getReceivedInvites` controller returns data wrapped in `ApiResponse` { success, data, message }
        // and the `data` field contains an array of { project: {...}, invite: {...} }
        const rawInvites = res.data.data;

        // Map the raw backend response to match TeamInvitationCard props
        const formattedInvites = rawInvites.map(item => ({
          // Use item.invite._id as key if available, else item.project._id
          id: item.invite?._id || item.project?._id || Math.random().toString(36).substring(7),
          projectId: item.project?._id, // Pass project ID for response actions
          projectName: item.project?.title,
          // ASSUMPTION: 'createdBy' in 'project' within 'item' is populated with 'name', 'email'.
          // 'university' and 'avatar' are NOT populated by your current backend 'getReceivedInvites'.
         fromName: item.project?.createdBy ? (item.project.createdBy.name || `${item.project.createdBy.firstName} ${item.project.createdBy.lastName}`).trim() : 'Unknown',
        fromUniversity: item.project?.createdBy?.university || 'N/A',// Cannot get from current backend `getReceivedInvites` without change
          fromAvatar: null,      // Cannot get from current backend `getReceivedInvites` without change
          timeAgo: moment(item.invite?.sentAt).fromNow(), // Uses moment.js for formatting
        })).filter(invite => invite.projectId); // Filter out any incomplete entries

        setTeamInvitations(formattedInvites);
      } catch (err) {
        console.error('Error fetching team invitations:', err);
        setInvitationsError(err.response?.data?.message || 'Failed to load invitations.');
      } finally {
        setInvitationsLoading(false);
      }
    };

    // Call all fetch functions when the component mounts
    fetchDashboardSummary();
    fetchProjectPosts();
    fetchTeamInvitations();

  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <div className="homepage">
      <Navbar />

      <div className="homepage-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className='welcome-content'>
            <h1 className="welcome-title">
              Welcome back!! 👋
            </h1>
            <p className="welcome-subtitle">
              Ready to collaborate and build something amazing today?
            </p>
          </div>
          <Link to ="/CreatePost">
          <button className="create-project-button">
            <Plus size={20} />
            <span>Create Project</span>
          </button>
          </Link>
        </div>

        {/* Stats Cards Section - fetches from backend */}
        <div className="stats-grid">
          {summaryLoading ? (
            <p>Loading summary stats...</p>
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

        {/* Homepage Grid */}
        <div className="homepage-grid">
          {/* Main Content - fetches projectPosts from backend */}
          <div className="main-content">
            <div className="recent-projects">
              <div className="section-header">
                <h2 className="section-title">
                  Recent Project Posts 🚀
                </h2>
                <button className="view-all-button">
                  View all
                </button>
              </div>

              <div className="projects-list">
                {projectsLoading ? (
                  <p>Loading project posts...</p>
                ) : projectsError ? (
                  <p className="error-message">{projectsError}</p>
                ) : projectPosts.length === 0 ? (
                  <p>No project posts found. Time to create one! 🌟</p>
                ) : (
                  projectPosts.map((project) => (
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
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - fetches teamInvitations from backend */}
          <div className="side-bar">
            <div className="side-bar-card">
              <div className="sidebar-header">
                <Users size={20} />
                <h3 className="sidebar-title">
                  Team Invitations 📧
                </h3>
              </div>

              <div className="invitations-list">
                {invitationsLoading ? (
                  <p>Loading invitations...</p>
                ) : invitationsError ? (
                  <p className="error-message">{invitationsError}</p>
                ) : teamInvitations.length === 0 ? (
                  <p>No new team invitations. All caught up! 🎉</p>
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
        fromUserId={invitation.fromUserId} // <--- Pass fromUserId from fetched data
        onAccept={() => handleRespondToInvitation(invitation.projectId, invitation.fromUserId, 'accepted')} // <--- Pass fromUserId here
        onDecline={() => handleRespondToInvitation(invitation.projectId, invitation.fromUserId, 'rejected')} // <--- Pass fromUserId here if needed for decline logic, or remove if not.
      />
    ))
                )}
              </div>

              <button className="view-all-invitations">
                View All Invitations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;