import React from 'react'

const TeamInvitationCard = ({
   projectName, 
  fromName, 
  timeAgo, 
  onAccept, 
  onDecline
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 mb-1">
          {projectName}
        </h4>
        <p className="text-sm text-gray-600">
          From {fromName} • {timeAgo}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={onAccept}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Accept
        </button>
        <button 
          onClick={onDecline}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default TeamInvitationCard;