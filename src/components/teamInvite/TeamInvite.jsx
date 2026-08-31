import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  UsersRound,
  XCircle,
} from "lucide-react";
import "./TeamInvite.css";
import Navbar from "../HomePage/Navbar";

export default function TeamInvitations() {
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const [receivedRes, sentRes] = await Promise.all([
          axios.get(`${backendUrl}/api/invites/received`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/invites/sent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setReceivedInvites(Array.isArray(receivedRes.data?.data) ? receivedRes.data.data : []);
        setSentRequests(Array.isArray(sentRes.data?.data) ? sentRes.data.data : []);
      } catch (err) {
        setError("Failed to fetch team invitations and requests.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  const handleRespondToInvitation = async (projectId, fromUserId, status) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication required to respond.");
      return;
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/invites/respond/${projectId}/${fromUserId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReceivedInvites((prev) => prev.filter((invite) => String(invite.projectId) !== String(projectId)));
      alert(res.data.message || `Invitation ${status}!`);
    } catch (err) {
      console.error("Error responding to invitation:", err);
      alert(err.response?.data?.message || `Failed to ${status} invitation.`);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const buildProjectForNavigation = (invite) => (
    invite.project || {
      _id: invite.projectId,
      title: invite.projectName,
      description: invite.projectDescription,
      domain: invite.domain,
      timeCommitment: invite.timeCommitment,
      projectDuration: invite.projectDuration,
      requiredSkills: invite.requiredSkills || [],
      createdBy: {
        _id: invite.fromUserId,
        firstName: invite.fromName?.split(" ")[0] || invite.fromName,
        lastName: invite.fromName?.split(" ").slice(1).join(" ") || "",
        university: invite.fromUniversity,
        avatar: invite.fromAvatar,
      },
    }
  );

  const openProject = (invite) => {
    navigate("/ProjectInfo", { state: { project: buildProjectForNavigation(invite) } });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="team-invite-page">
          <h2>Loading...</h2>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="team-invite-page">
          <h2>Error</h2>
          <p className="team-invite-subtitle">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="team-invite-page">
        <h1>Team Invitations</h1>
        <p className="team-invite-subtitle">Manage your team invitations and collaboration requests</p>

        <div className="tabs" role="tablist" aria-label="Invitation views">
          <button
            type="button"
            className={`tabu ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            <UsersRound size={15} />
            Received ({receivedInvites.length})
          </button>
          <button
            type="button"
            className={`tabu ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            <MessageCircle size={15} />
            Sent Requests
          </button>
        </div>

        {activeTab === "received" ? (
          <>
            <h2>Pending Invitations</h2>
            <div className="carddd">
              {receivedInvites.length > 0 ? (
                receivedInvites.map((invite) => (
                  <article className="cardss" key={invite.invitationId || invite._id || invite.projectId}>
                    <div className="card-header">
                      <div className="user">
                        <div className="avatar">
                          {invite.fromAvatar ? (
                            <img src={invite.fromAvatar} alt={invite.fromName} />
                          ) : (
                            getInitial(invite.fromName)
                          )}
                        </div>
                        <div>
                          <h3>{invite.fromName}</h3>
                          <span className="university">{invite.fromUniversity || "University not listed"}</span>
                        </div>
                      </div>
                      <div className="team-info">
                        <span className="team-name">{invite.domain || invite.project?.domain || "Project Team"}</span>
                        <span className="time">{invite.timeAgo}</span>
                      </div>
                    </div>

                    <h4 className="project-title">{invite.projectName}</h4>
                    <p className="message">
                      {invite.message
                        || invite.projectDescription
                        || invite.project?.description
                        || "You've been invited to collaborate on this project."}
                    </p>

                    <div className="meta">
                      <span>
                        <Clock3 size={14} />
                        {invite.timeCommitment || invite.project?.timeCommitment || "Flexible"}
                      </span>
                      <span>
                        <CalendarDays size={14} />
                        {invite.projectDuration || invite.project?.projectDuration || "Open ended"}
                      </span>
                    </div>

                    <div className="skills">
                      {(invite.requiredSkills || invite.project?.requiredSkills || []).slice(0, 4).map((skill) => (
                        <span className="skill" key={skill}>{skill}</span>
                      ))}
                    </div>

                    <div className="actions">
                      <button
                        type="button"
                        className="accept"
                        onClick={() => handleRespondToInvitation(invite.projectId, invite.fromUserId, "accepted")}
                      >
                        <CheckCircle2 size={15} />
                        Accept
                      </button>
                      <button
                        type="button"
                        className="decline"
                        onClick={() => handleRespondToInvitation(invite.projectId, invite.fromUserId, "rejected")}
                      >
                        <XCircle size={15} />
                        Decline
                      </button>
                      <button type="button" className="view" onClick={() => openProject(invite)}>
                        View Project
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-state">You have no pending invitations.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Sent Requests</h2>
            <div className="sent-request-list">
              {sentRequests.length > 0 ? (
                sentRequests.map((request) => (
                  <article
                    className="sent-request-card"
                    key={request.invitationId || `${request.projectId}-${request.toUserId}`}
                    onClick={() => openProject(request)}
                  >
                    <div className="sent-request-info">
                      <h3>{request.projectName}</h3>
                      <p>
                        to {request.toName || "Unknown User"} at {request.toUniversity || "University not listed"} &bull; {request.timeAgo}
                      </p>
                    </div>
                    <span className={`request-status ${request.status || "pending"}`}>
                      {request.status || "pending"}
                    </span>
                  </article>
                ))
              ) : (
                <p className="empty-state">You have not sent any team requests.</p>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
