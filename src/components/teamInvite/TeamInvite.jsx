import React from "react";
import "./TeamInvite.css";

const invitations = [
  {
    id: 1,
    name: "Alex Rodriguez",
    university: "MIT",
    projectTitle: "AI Study Assistant",
    message:
      "Hi! We saw your profile and think you'd be a great fit for our AI project. We're building a study assistant using machine learning.",
    hours: "10-15 hours/week",
    duration: "3 months",
    skills: ["React", "Python", "Machine Learning"],
    team: "CodeCrafters",
    time: "2 hours ago",
    avatar:
      "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: 2,
    name: "Jessica Kim",
    university: "Stanford",
    projectTitle: "Campus Food Delivery App",
    message:
      "Your mobile development skills are exactly what we need! We're creating a food delivery app specifically for university campuses.",
    hours: "8-12 hours/week",
    duration: "4 months",
    skills: ["React Native", "Node.js", "Firebase"],
    team: "DeliveryDevs",
    time: "1 day ago",
    avatar:
      "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

export default function TeamInvitations() {
  return (
    <div className="team-container">
      <h1>Team Invitations</h1>
      <p>Manage your team invitations and collaboration requests</p>

      <div className="tabs">
        <button className="tab active">👥 Received (2)</button>
        <button className="tab">💬 Sent Requests</button>
      </div>

      <h2>Pending Invitations</h2>

      {invitations.map((invite) => (
        <div className="card" key={invite.id}>
          <div className="card-header">
            <div className="user">
              <img src={invite.avatar} alt={invite.name} className="avatar" />
              <div>
                <h3>{invite.name}</h3>
                <span className="university">{invite.university}</span>
              </div>
            </div>
            <div className="badge-area">
              <span className="badge">{invite.team}</span>
              <span className="time">{invite.time}</span>
            </div>
          </div>

          <h4>{invite.projectTitle}</h4>
          <p className="message">{invite.message}</p>

          <div className="meta">
            <span>🕒 {invite.hours}</span>
            <span>📅 {invite.duration}</span>
          </div>

          <div className="skills">
            {invite.skills.map((skill) => (
              <span key={skill} className="skill">
                {skill}
              </span>
            ))}
          </div>

          <div className="actions">
            <button className="accept">✔ Accept</button>
            <button className="decline">✖ Decline</button>
            <button className="view">View Project</button>
          </div>
        </div>
      ))}
    </div>
  );
}
