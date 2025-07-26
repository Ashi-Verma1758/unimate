import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import "./TeamInvite.css";
import Navbar from "../HomePage/Navbar";

export default function TeamInvitations() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamInvitations, setTeamInvitations] = useState([]);
    const navigate = useNavigate();
    const backendUrl = "http://localhost:8000";

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("You must be logged in to view invitations.");
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`${backendUrl}/api/invites/received`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && Array.isArray(res.data.data)) {
                    setInvitations(res.data.data);
                } else {
                    setInvitations([]); // Ensure it's always an array
                }
            } catch (err) {
                setError("Failed to fetch invitations.");
                console.error("Error fetching invitations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
    }, []);

   const handleRespondToInvitation = async (projectId, fromUserId, status) => {
        const token = localStorage.getItem('accessToken');
        if (!token) { alert('Authentication required to respond to invitation.'); return; }
        try {
            const res = await axios.put(`${backendUrl}/api/invites/respond/${projectId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
           navigate('/success', {
  state: { message: res.data.message || 'Join request sent successfully!' }
});
;
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

    // const handleViewProject = (projectId) => {
    //     // You need to implement the navigation logic to your project details page
    //     navigate(`/ProjectInfo/${projectId}`);
    // };

    if (loading) return <> <Navbar /> <div className="team-container"><h2>Loading...</h2></div> </>;
    if (error) return <> <Navbar /> <div className="team-container"><h2>Error</h2><p>{error}</p></div> </>;

  return (
    <>
    <Navbar/>
    <div className="team-containesr">
      <h1>Team Invitations</h1>
      <p>Manage your team invitations and collaboration requests</p>

      <div className="tabs">
        <button className="tabu active">👥 Received </button>
        <button className="tabu">💬 Sent Requests</button>
      </div>

      <h2>Pending Invitations({invitations.length})</h2>
<div className="carddd">
  {invitations.length>0?(
      invitations.map((invite) => (
        <div className="cardss" key={invite.invitationid}>
          <div className="card-header">
            <div className="user">
              <img src={invite.fromAvatar || `https://via.plalder.com/60?text=${invite.fromName?.charAt(0)}`} alt={invite.fromName} className="avatar" />
                                        <div>
                <h3>{invite.fromName}</h3>
                <span className="university">{invite.fromUniversity}</span>
              </div>
            </div>
            <div className="badge-area">
              <span className="badge">{invite.team}</span>
              <span className="time">{invite.timeAgo}</span>
            </div>
          </div>

          <h4>{invite.projectName}</h4>
          <p className="message">{invite.message}</p>

          <div className="meta">
            <span>🕒 {invite.hours}</span>
            <span>📅 {invite.duration}</span>
          </div>

          <div className="skills">
             {Array.isArray(invite.skills) && invite.skills.map((skill, index) => (
        // By combining the skill name and its index, the key is always unique
        <span key={`${skill}-${index}`} className="skill">
            {skill}
        </span>
            ))}
          </div>

          <div className="actions">
            {/* <button className="accept">✔ Accept</button>
            <button className="decline">✖ Decline</button>
            <button className="view">View Project</button> */}
          <button className="accept" onClick={() => handleResponse(invite.projectId, 'accepted')}>✔ Accept</button>
                                    <button className="decline" onClick={() => handleRespondToInvitation(invite.projectId, 'declined')}>✖ Decline</button>
                                    <button className="view" onClick={() =>  {
            // This now correctly uses the 'project' for this specific card
            navigate(`/ProjectInfo/`, { state: { project: project } });
                                    }}
            
            >View Project</button>
                                </div>
        
        </div>
      ))
    )  : (
                        <p>You have no pending invitations.</p>
     
      )}
    </div>
    </div>
    </>
  );
  
}
