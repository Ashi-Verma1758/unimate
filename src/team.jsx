import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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

const FindTeammates = () => {
  const [teammates, setTeammates] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = useMemo(getCurrentUserId, []);

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

              return (
                <div className="carduu" key={user._id}>
                  <div className="card-header">
                    <div className="author-avatar">
                      {user.avatar || user.avatarUrl ? (
                        <img src={user.avatar || user.avatarUrl} alt={`${userName}'s avatar`} className="avatar-img" />
                      ) : (
                        <div className="avatar-placeholder">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="user-info">
                      <h3 className="user-name">
                        {userName} {isCurrentUser && <span className="self-badge">You</span>}
                      </h3>
                      <p>{user.academicYear || "Year N/A"} &bull; {user.major || "Major N/A"} &bull; {user.university || "University N/A"}</p>
                      <p>{user.location || "Location N/A"} &bull; Active recently</p>
                    </div>
                  </div>

                  <p className="desc">
                    {user.bio || "This user hasn't added a bio yet."}
                  </p>

                  <div className="tags">
                    <strong>Skills:</strong>
                    {user.skills?.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span key={`${skill}-${index}`}>{skill}</span>
                      ))
                    ) : (
                      <span>No skills listed</span>
                    )}
                  </div>

                  <div className="tags">
                    <strong>Interests:</strong>
                    {(user.interests?.length ? user.interests : ["Web Development", "AI/ML", "Hackathons"]).map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))}
                  </div>

                  <div className="footer">
                    <span>{user.projectCount || 0} projects</span>
                    <div className="actions">
                      <button
                        type="button"
                        className="primary"
                        onClick={() => handleConnectClick(user)}
                        disabled={isCurrentUser}
                      >
                        {isCurrentUser ? "Your Profile" : "Connect"}
                      </button>
                    </div>
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
