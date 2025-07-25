import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Plus, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom'
// import { Plus, Users } from 'lucide-react';
import moment from 'moment'; // Import moment.js for timeAgo calculations
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
// Import your components
import Navbar from './Navbar.jsx';
import StatsCard from './StatsCard.jsx';
import ProjectCard from './ProjectCard.jsx';
import TeamInvitationCard from './TeamInvitationCard.jsx';

import JoinRequestCard from './JoinRequestCard.jsx';


// import CreatePost from '../createpost.jsx';
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

  // <--- NEW STATES FOR JOIN REQUESTS --->
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(true);
  const [joinRequestsError, setJoinRequestsError] = useState(null);
  // <--- NEW STATE FOR TABS --->
  const [selectedMainTab, setSelectedMainTab] = useState('recentPosts'); // 'recentPosts' or 'joinRequests'
  
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

  const handleRespondToJoinRequest = async (projectId, requestId, status) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('Authentication required to respond.');
    return;
  }


    try {
      // Find the user ID associated with this request.
      // This assumes your joinRequests state contains `requesterDetails._id`
      const requestToRespond = joinRequests.find(req => req.requestId === requestId);
      const userIdToRespond = requestToRespond?.requesterDetails?._id;

      if (!userIdToRespond) {
          alert('Could not find user associated with this request for backend processing.');
          return;
      }

      // Backend endpoint: PATCH /api/projects/:projectId/requests/:userId/respond
      // This requires the requester's userId in the URL.
      // If your backend `respondToRequest` was updated to use `requestId` instead of `userId` in the URL:
      // const res = await axios.patch(`${backendUrl}/api/projects/${projectId}/requests/${requestId}/respond`,

       const res = await axios.patch(`${backendUrl}/api/projects/${projectId}/requests/${requestId}/respond`, // <-- UPDATED URL
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.message || `Request ${status} successfully!`);


      // Update UI: Remove the processed request from the list
      setJoinRequests(prevRequests =>
        prevRequests.filter(req => req.requestId !== requestId)
      );
      // Optional: Refetch dashboard summary if accepting a request adds to team members etc.
      // fetchDashboardSummary(); // You might want to call this here
    } catch (err) {
      console.error(`Error ${status} request:`, err);
      alert(err.response?.data?.message || `Failed to ${status} request. Please try again.`);
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

       
        const rawInvites = res.data.data;
console.log("Raw Invites from Backend (before mapping):", rawInvites); // <-- NEW CONSOLE.LOG

     setTeamInvitations(rawInvites.map(item => ({
          id: item.invitationId, // Use invitationId as the key
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
      const token = localStorage.getItem('accessToken'); // Re-fetch token here, or pass as arg

      if (!token) {
        setJoinRequestsError('Authentication required. Please log in to view join requests.');
        setJoinRequestsLoading(false);
        return;
      }

      try {
        // This endpoint maps to your getSentRequests controller in project.controller.js
         const res = await axios.get(`${backendUrl}/api/projects/me/incoming-request`, { // <-- UPDATED URL
      headers: { Authorization: `Bearer ${token}` },
    });


        const allRequests = [];
        // Assuming your backend getSentRequests returns { success: true, data: [{ project: {...}, request: {...}, requesterDetails: {...} }] }
        res.data.data.forEach(item => {
          // 'item' here is the combined object { project, request, requesterDetails }
          // We only want to show 'pending' requests on this list
          if (item.request.status === 'pending' && item.requesterDetails) {
            allRequests.push({
              requestId: item.request._id,
              projectId: item.project._id,
              requesterAvatar: item.requesterDetails.avatar || null,
              requesterName: item.requesterDetails.name || `${item.requesterDetails.firstName || ''} ${item.requesterDetails.lastName || ''}`.trim(),
              requesterMajor: item.requesterDetails.major || 'N/A',
              requesterAcademicYear: item.requesterDetails.academicYear || 'N/A',
              requesterUniversity: item.requesterDetails.university || 'N/A',
              requesterRating: item.requesterDetails.rating || 0,
              requesterProjectsCount: item.requesterDetails.projectsCount || 0,
              timeAgo: moment(item.request.sentAt).fromNow(),
              projectTitle: item.project.title,
              requestMessage: item.request.message || '',
              skills: item.requesterDetails.skills || [],
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


    // Call all fetch functions when the component mounts
    fetchDashboardSummary();
    fetchProjectPosts();
    fetchTeamInvitations();
    fetchJoinRequests();

  }, []); // Empty dependency array ensures this effect runs only once on component mount

useEffect(() => {
    console.log("DEBUG: Current teamInvitations state:", teamInvitations);
    console.log("DEBUG: Current teamInvitations length:", teamInvitations.length);
  }, [teamInvitations]);
  
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
  <div className="section-header tabs-container">
    <button
      className={`tab-button ${selectedMainTab === 'recentPosts' ? 'active' : ''}`}
      onClick={() => setSelectedMainTab('recentPosts')}
    >
      Recent Posts
    </button>
    <button
      className={`tab-button ${selectedMainTab === 'joinRequests' ? 'active' : ''}`}
      onClick={() => setSelectedMainTab('joinRequests')}
    >
      Join Requests {joinRequests.length > 0 && <span className="tab-badge">{joinRequests.length}</span>}
    </button>
    {/* {selectedMainTab === 'recentPosts' && (
      <button className="view-all-button ml-auto">
        View all
      </button>
    )} */}
  </div>
  {selectedMainTab === 'recentPosts' && (
    <div className="view-all-button-container"> {/* <--- NEW DIV */}
      <button className="view-all-button">
        View all
      </button>
    </div>
  )}

  {selectedMainTab === 'recentPosts' && ( // <--- ADD THIS CONDITIONAL WRAPPER
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
  )}

  {selectedMainTab === 'joinRequests' && (
    <div className="join-requests-list">
      {joinRequestsLoading ? (
        <p>Loading join requests...</p>
      ) : joinRequestsError ? (
        <p className="error-message">{joinRequestsError}</p>
      ) : joinRequests.length === 0 ? (
        <p>No new join requests. All caught up! 🎉</p>
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
</div>
{/* Sidebar - fetches teamInvitations from backend */} {/* <--- RE-ADD THIS ENTIRE DIV BLOCK */}
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
                      onAccept={() => handleRespondToInvitation(invitation.projectId, 'accepted')}
                      onDecline={() => handleRespondToInvitation(invitation.projectId, 'rejected')}
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