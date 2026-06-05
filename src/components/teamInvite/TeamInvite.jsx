import React,{useEffect,useState,useCallBack} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import "./TeamInvite.css";
import Navbar from "../HomePage/Navbar";

export default function TeamInvitations() {
     const [receivedInvites, setReceivedInvites] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);

    // State for UI control
    const [activeTab, setActiveTab] = useState('received');
  const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamInvitations, setTeamInvitations] = useState([]);
    const navigate = useNavigate();
    const backendUrl = "http://localhost:8000";

 
 useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setError("You must be logged in to view invitations.");
                setLoading(false);
                return;
            }

            try {
                // Fetch both sets of data in parallel for efficiency
                const [receivedRes, sentRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/invites/received`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${backendUrl}/api/invites/sent`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setReceivedInvites(receivedRes.data?.data && Array.isArray(receivedRes.data.data) ? receivedRes.data.data : []);
                setSentRequests(sentRes.data?.data && Array.isArray(sentRes.data.data) ? sentRes.data.data : []);

            } catch (err) {
                setError("Failed to fetch team invitations and requests.");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [backendUrl]); // Dependency array ensures this runs only once

    // Handler for accepting or declining an invitation
    const handleRespondToInvitation = async (projectId, fromUserId, status) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Authentication required to respond.');
            return;
        }
        try {
            const res = await axios.put(`${backendUrl}/api/invites/respond/${projectId}/${fromUserId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Remove the processed invitation from the list
            setReceivedInvites(prev => prev.filter(invite => invite.projectId !== projectId));

            alert(res.data.message || `Invitation ${status}!`);

            // // If accepted, try to navigate to the chat
            // if (status === 'accepted') {
            //     const conversationRes = await axios.get(`${backendUrl}/api/chats/get-or-create-conversation?otherUserId=${fromUserId}&projectId=${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
            //     const conversation = conversationRes.data;
            //     if (conversation?._id) {
            //         navigate('/chat'); // Assuming your chat page can handle the context
            //     } else {
            //          console.error("Failed to get or create conversation.");
            //     }
            // }
        } catch (err) {
            console.error(`Error responding to invitation:`, err);
           
         alert(err.response?.data?.message || `Failed to ${status} invitation.`);
       return;
        }
    };

    // Placeholder for canceling a sent request
    const handleCancelRequest = async (projectId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Authentication required to cancel a request.');
            return;
        }
        try {
            // Note: You need to implement this endpoint on your backend
            // It would typically be a DELETE or PUT/PATCH request
            await axios.delete(`${backendUrl}/api/invites/cancel/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
            
            // Remove the canceled request from the list
            setSentRequests(prev => prev.filter(req => req.projectId !== projectId));
            alert("Request cancelled successfully.");

        } catch (err) {
            console.error(`Error canceling request:`, err);
            alert(err.response?.data?.message || `Failed to cancel request.`);
        }
    };

   

    if (loading) return <> <Navbar /> <div className="team-container"><h2>Loading...</h2></div> </>;
    if (error) return <> <Navbar /> <div className="team-container"><h2>Error</h2><p>{error}</p></div> </>;

  return (
    <>
    <Navbar/>
    <div className="team-containesr">
      <h1>Team Invitations</h1>
      <p>Manage your team invitations and collaboration requests</p>

      <div className="tabs">
        
       <div 
                        className={`tabu ${activeTab === 'received' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('received')}
                    >
                        👥 Received
                    </div>
                    <div 
                        className={`tabu ${activeTab === 'sent' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('sent')}
                    >
                        💬 Sent Requests
                    </div>
      </div>
      {activeTab === 'received' ? (
                    <>

      <h2>Pending Invitations({invitations.length})</h2>
<div className="carddd">
  {/* {invitations.length>0?(
      invitations.map((invite) => ( */}
      {receivedInvites.length > 0 ? (
                                receivedInvites.map((invite) => (
        <div className="cardss" key={invite.invitationid || invite._id}>
          <div className="card-header">
            <div className="user">
              <img src={invite.fromAvatar || `https://via.plalder.com/60?text=${invite.fromName?.charAt(0)}`} alt={invite.fromName} className="avatar" />
                                        <div>
                <h3>{invite.fromName}</h3>
                <span className="university">{invite.fromUniversity}</span>
              </div>
            </div>
 <span className="time">{invite.timeAgo}</span>
                                        </div>
                                        <h4>{invite.projectName}</h4>
                                        <div className="actions">
                                            <button className="accept" onClick={() => handleRespondToInvitation(invite.projectId, invite.fromUserId, 'accepted')}>✔ Accept</button>
                                            <button className="decline" onClick={() => handleRespondToInvitation(invite.projectId, invite.fromUserId, 'declined')}>✖ Decline</button>
                                            <button className="view" onClick={() => navigate(`/ProjectInfo/${invite.projectId}`)}>View Project</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>You have no pending invitations.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Sent Requests ({sentRequests.length})</h2>
                        <div className="carddd">
                            {sentRequests.length > 0 ? (
                                sentRequests.map((request) => (
                                    // NOTE: Adapt this card to your 'sent request' data structure
                                    <div className="cardss" key={request.invitationId || request._id}>
                                        <div className="card-header">
                                            <div className="user">
                                                 {/* Assuming 'toAvatar' and 'toName' exist on your sent request object */}
                                                <img src={request.toAvatar || `https://via.placeholder.com/60?text=${request.toName?.charAt(0)}`} alt={request.toName} className="avatar" />
                                                <div>
                                                    <h3>{request.toName}</h3>
                                                    <span className="university">{request.toUniversity}</span>
                                                </div>
                                            </div>
                                            <span className="time">{request.timeAgo}</span>
                                        </div>
                                        <h4>{request.projectName}</h4>
                                        <div className="actions">
                                          
                                            <button className="view" onClick={() => navigate(`/ProjectInfo/${invite.projectId}`)}>View Project</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>You have not sent any team requests.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
  }
          