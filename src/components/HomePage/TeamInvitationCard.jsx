import React from 'react';
import './TeamInvitationCard.css'; // Ensure this CSS file exists and has styles for .avatar-img etc.

const TeamInvitationCard = ({
  projectId, // This prop is passed from HomePage for backend interaction
  projectName,
  fromName,
  fromUniversity, // New prop: University of the project creator
  // fromAvatar,     // New prop: Avatar URL of the project creator
  timeAgo,
  onAccept,
  onDecline
}) => {
  return (
    <div className="inviuutation-card">
      <div className="invitation-header"> {/* Added a header div for better layout control */}
        {/* <div className="from-avatar">
          
          {fromAvatar ? (
            <img src={fromAvatar} alt={`${fromName}'s avatar`} className="avatar-img" />
          ) : (
            fromName ? fromName.charAt(0).toUpperCase() : '?'
          )}
        </div> */}
        <div className="from-details">
          <h4 className="invitation-titleee">
            {projectName}
          </h4>
          <p className="invitation-details">
            From {fromName}
            {/* Only display university if it's not 'N/A' or empty */}
            {fromUniversity && fromUniversity !== 'N/A' ? ` (${fromUniversity})` : ''} • {timeAgo}
          </p>
        </div>
      </div>

      <div className="invitation-actions">
        <button
          onClick={onAccept} // Calls HomePage's handleRespondToInvitation with projectId and 'accepted'
          className="accept-button"
        >
          Accept
        </button>
        <button
          onClick={onDecline} // Calls HomePage's handleRespondToInvitation with projectId and 'rejected'
          className="decline-button"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default TeamInvitationCard;