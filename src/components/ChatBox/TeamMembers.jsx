import React from 'react';
import './TeamMembers.css'; // Import the component-specific CSS

const TeamMembers = () => {
  return (
    <div className="team-members-container">
      <h2 className="team-members-title">Team Members</h2>

      {/* Team Member 1: Sarah Chen */}
      <div className="team-member-card">
       <div>
          <p className="team-member-name">Sarah Chen</p>
          <p className="team-member-status">Online</p>
        </div>
      </div>

      {/* Team Member 2: John Doe */}
      <div className="team-member-card">
        <div>
          <p className="team-member-name">John Doe</p>
          <p className="team-member-status">Offline</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;