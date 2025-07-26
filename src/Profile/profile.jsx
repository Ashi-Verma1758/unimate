import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import './profile.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    major: '',
    year: '',
    university: '',
    joinedDate: '',
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    connections: 0,
    avatarUrl: '',
    skills: [],
    interests: [],
    projects: [],
    achievements: [],
    reviews: []
  });

  const [loading, setLoading] = useState(true);
  const backendUrl = "http://localhost:8000"; // Change this if needed

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${backendUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data ?? {});
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">

      {/* Profile Header */}
      <div className="profile-header">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} className="avatar" alt="avatar" />
        ) : (
          <div className="avatar-placeholder">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="info">
          <h2>{profile.name}</h2>
          <p>{profile.major} • {profile.year}</p>
          <p>🎓 {profile.university} • 📍 {profile.joinedDate}</p>
          <div className="meta">
            <span>({profile.totalProjects} projects)</span> •
            <span>👥 {profile.connections} connections</span>
          </div>
        </div>
        <Link to="/edit-profile" className="edit-btn">✏ Edit Profile</Link>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat"><strong>{profile.totalProjects}</strong><p>Total Projects</p></div>
        <div className="stat"><strong className="green">{profile.completedProjects}</strong><p>Completed</p></div>
        <div className="stat"><strong className="orange">{profile.inProgressProjects}</strong><p>In Progress</p></div>
      </div>

      {/* Content */}
      <div className="content">

        {/* Projects */}
        <div className="projects">
          {Array.isArray(profile.projects) && profile.projects.map((project, idx) => (
            <div className="project-card" key={idx}>
              <img src={project.image || "https://via.placeholder.com/300x150"} alt="project" />
              <div className={`badge ${project.status === "Completed" ? "green" : "blue"}`}>{project.status}</div>
              <p><strong>{project.name}</strong></p>
              <p>{project.role}</p>
            </div>
          ))}
        </div>

        {/* Skills & Interests */}
        <div className="skills-interests">
          <div className="skills-card">
            <h3>Technical Skills</h3>
            <p>Programming languages and technologies</p>
            {Array.isArray(profile.skills) && profile.skills.length > 0 ? profile.skills.map((skill, i) => (
              <span className="tag" key={i}>{skill}</span>
            )) : <p className="no-data">No skills listed.</p>}
          </div>

          <div className="skills-card">
            <h3>Interests</h3>
            <p>Areas of focus and passion</p>
            {Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.map((interest, i) => (
              <span className="tag" key={i}>{interest}</span>
            )) : <p className="no-data">No interests listed yet.</p>}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements">
          {Array.isArray(profile.achievements) && profile.achievements.map((achieve, i) => (
            <div className="achievement" key={i}>
              <div className="icon">{achieve.icon}</div>
              <div>
                <strong>{achieve.title}</strong>
                <p>{achieve.description}</p>
              </div>
              <span>{achieve.date}</span>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="reviews">
          {Array.isArray(profile.reviews) && profile.reviews.map((review, i) => (
            <div className="review" key={i}>
              {review.reviewerAvatar ? (
                <img src={review.reviewerAvatar} alt="reviewer" />
              ) : (
                <div className="reviewer-placeholder">
                  {review.reviewerName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <strong>{review.reviewerName}</strong>
                <p>{review.project}</p>
                <p>{review.comment}</p>
              </div>
              <span>
                {'⭐'.repeat(review.rating)}<br />
                <small>{review.date}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
