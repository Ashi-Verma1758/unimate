import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Clock,
  Code2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Star,
  Trophy,
  User,
  UserPlus,
} from "lucide-react";
import "./team.css";
import Navbar from "./components/HomePage/Navbar";

const backendUrl = "http://localhost:8000";

const getCurrentUserId = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("accessToken");
  let userId = storedUser?._id || storedUser?.id || null;

  if (!userId && token) {
    try {
      userId = JSON.parse(atob(token.split(".")[1]))?.id || null;
    } catch (error) {
      console.error("Failed to decode user token:", error);
    }
  }

  return userId;
};

const getUserName = (user) =>
  user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const visibleItems = (items = [], limit = 5) => {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  return {
    shown: safeItems.slice(0, limit),
    hiddenCount: Math.max(safeItems.length - limit, 0),
  };
};

const FindTeammates = () => {
  const [teammates, setTeammates] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = useMemo(getCurrentUserId, []);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [teammatesRes, myProjectsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/users/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/projects/me/created`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTeammates(teammatesRes.data?.data || teammatesRes.data || []);
        setMyProjects(myProjectsRes.data?.data || myProjectsRes.data || []);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConnectClick = async (userToInvite) => {
    if (userToInvite._id === currentUserId) {
      alert("This is your profile.");
      return;
    }

    if (myProjects.length === 0) {
      alert("You must create a project before you can invite teammates.");
      return;
    }

    const mostRecentProject = myProjects[0];

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${backendUrl}/api/invites/send/${mostRecentProject._id}/${userToInvite._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(`Invitation for project '${mostRecentProject.title}' sent to ${getUserName(userToInvite)}!`);
    } catch (err) {
      console.error("Failed to send invitation:", err);
      alert(`Error: ${err.response?.data?.message || "Could not send invitation."}`);
    }
  };

  const handleChatClick = async (userToChat) => {
    if (userToChat._id === currentUserId) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/chats/conversation`,
        { otherUserId: userToChat._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const conversation = response.data;
      if (conversation?._id) {
        localStorage.setItem("pendingChatConversationId", conversation._id);
        navigate("/chat");
      }
    } catch (err) {
      console.error("Failed to open direct chat:", err);
      alert(err.response?.data?.message || "Could not open chat.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="teammates"><h2>Loading users...</h2></section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="teammates"><h2>Error</h2><p>{error}</p></section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="teammates">
        <h2>Find Teammates</h2>
        <p className="subtext">
          Discover talented students to collaborate with on your next project
        </p>

        <div className="cardsrr">
          {teammates.length === 0 ? (
            <p className="empty-teammates">No users found.</p>
          ) : (
            teammates.map((user) => {
              const userName = getUserName(user);
              const isCurrentUser = user._id === currentUserId;
              const skillList = visibleItems(user.skills);
              const interestList = visibleItems(user.interests, 3);
              const projectCount = user.projectCount || user.projectsCount || user.projects?.length || 0;
              const responseRate = user.responseRate || user.response_rate;
              const rating = user.rating;
              const timeCommitment = user.timeCommitment || user.availability;
              const activity = user.activeStatus || user.lastActive;
              const location = user.location || "Location N/A";
              const isVerified = user.verified || user.isVerified;

              return (
                <div className="carduu" key={user._id}>
                  <div className="card-header">
                    <div className="profile-block">
                      <div className="author-avatar">
                        {user.avatar || user.avatarUrl ? (
                          <img src={user.avatar || user.avatarUrl} alt={`${userName}'s avatar`} className="avatar-img" />
                        ) : (
                          <div className="avatar-placeholder">
                            {getInitials(userName) || "S"}
                          </div>
                        )}
                        {isVerified && (
                          <span className="avatar-status" aria-label="Verified user">
                            <BadgeCheck size={12} />
                          </span>
                        )}
                      </div>

                      <div className="user-info">
                        <h3 className="user-name">
                          {userName}
                          {isVerified && (
                            <span className="verified-badge">
                              <BadgeCheck size={12} />
                              Verified
                            </span>
                          )}
                          {isCurrentUser && <span className="self-badge">You</span>}
                        </h3>
                        <div className="meta-line">
                          <span>{user.academicYear || "Year N/A"}</span>
                          <span>{user.major || "Major N/A"}</span>
                          <span>{user.university || "University N/A"}</span>
                        </div>
                        <div className="meta-line">
                          <span><MapPin size={12} />{location}</span>
                          {activity && <span><Clock size={12} />{activity}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="actions">
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => navigate(isCurrentUser ? "/profile" : `/profile/${user._id}`)}
                      >
                        <User size={15} />
                        View Profile
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => handleChatClick(user)}
                        disabled={isCurrentUser}
                      >
                        <MessageCircle size={15} />
                        {isCurrentUser ? "You" : "Message"}
                      </button>
                      <button
                        type="button"
                        className="primary"
                        onClick={() => handleConnectClick(user)}
                        disabled={isCurrentUser}
                      >
                        <UserPlus size={15} />
                        {isCurrentUser ? "Your Profile" : "Connect"}
                      </button>
                    </div>
                  </div>

                  <p className="desc">
                    {user.bio || "This user hasn't added a bio yet."}
                  </p>

                  <div className="tag-section">
                    <strong><Code2 size={12} /> Skills</strong>
                    <div className="tags">
                      {skillList.shown.length > 0 ? (
                        skillList.shown.map((skill, index) => (
                          <span key={`${skill}-${index}`}>{skill}</span>
                        ))
                      ) : (
                        <span className="empty-tag">No skills listed</span>
                      )}
                      {skillList.hiddenCount > 0 && <span className="more-tag">+{skillList.hiddenCount} more</span>}
                    </div>
                  </div>

                  <div className="tag-section">
                    <strong><GraduationCap size={12} /> Looking for</strong>
                    <div className="interest-tags">
                      {interestList.shown.length > 0 ? (
                        interestList.shown.map((interest) => (
                          <span key={interest}>{interest}</span>
                        ))
                      ) : (
                        <span className="empty-tag">No interests listed</span>
                      )}
                    </div>
                  </div>

                  <div className="footer">
                    <div className="profile-stats">
                      {rating && <span><Star size={13} />{rating}</span>}
                      <span><Trophy size={13} />{projectCount} projects</span>
                      {responseRate && <span><BadgeCheck size={13} />{responseRate} response rate</span>}
                    </div>
                    {timeCommitment && <span className="weekly-time"><Clock size={13} />{timeCommitment}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
};

export default FindTeammates;
