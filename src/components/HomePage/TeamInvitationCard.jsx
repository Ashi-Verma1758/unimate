import React from 'react';
import './TeamInvitationCard.css';

const TeamInvitationCard = ({ 
  projectName, 
  fromName, 
  timeAgo, 
  onAccept, 
  onDecline 
}) => {
  return (
    <div className="invitation-card">
      <div className="invitation-content">
        <h4 className="invitation-title">
          {projectName}
        </h4>
        <p className="invitation-details">
          From {fromName} • {timeAgo}
        </p>
      </div>
      
      <div className="invitation-actions">
        <button 
          onClick={onAccept}
          className="accept-button"
        >
          Accept
        </button>
        <button 
          onClick={onDecline}
          className="decline-button"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default TeamInvitationCard;