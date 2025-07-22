import React from 'react';
import './Sidebar.css'; 

const Sidebar = () => {
  const teams = [
    {
      id: 1,
      name: "AI Study Assistant",
      message: "Great progress on the ML model!",
      time: "2 min ago",
      notifications: 3,
      members: [
        "https://placehold.co/32x32/FFD700/000000?text=S",
        "https://placehold.co/32x32/4CAF50/FFFFFF?text=J",
        "https://placehold.co/32x32/2196F3/FFFFFF?text=M",
      ],
      isActive: true,
    },
    {
      id: 2,
      name: "Campus Food Delivery",
      message: "When can we schedule the next meeting?",
      time: "1 hour ago",
      notifications: 0,
      members: [
        "https://placehold.co/32x32/FF5722/FFFFFF?text=A",
        "https://placehold.co/32x32/9C27B0/FFFFFF?text=B",
      ],
      isActive: false,
    },
    {
      id: 3,
      name: "Mental Health Platform",
      message: "The user interface looks amazing!",
      time: "2 days ago",
      notifications: 1,
      members: [
        "https://placehold.co/32x32/00BCD4/FFFFFF?text=A",
      ],
      isActive: false,
    },
  ];

  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">Your Teams</h2>
      <div className="sidebar-teams-list">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`team-item ${team.isActive ? "team-item-active" : ""}`}
          >
            <div className="team-content">
              <div className="team-header">
                <h3 className="team-name">{team.name}</h3>
                {team.notifications > 0 && (
                  <span className="team-notification">
                    {team.notifications}
                  </span>
                )}
              </div>
              <p className="team-message">{team.message}</p>
              <p className="team-time">{team.time}</p>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;