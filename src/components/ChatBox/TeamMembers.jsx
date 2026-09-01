import React from 'react';
import { Settings, UserPlus, Users } from 'lucide-react';

const TeamMembers = ({ members = [], currentUserId, loading = false }) => {
  const getMemberName = (member) =>
    member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email || 'Member';

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U';

  return (
    <aside className="team-members-container">
      <h2 className="team-members-title">
        <Users size={17} />
        <span>Team Members</span>
      </h2>

      <div className="member-list custom-scrollbar">
        {loading ? (
          <p className="empty-state">Loading team members...</p>
        ) : members.length === 0 ? (
          <p className="empty-state">Select a team to view members.</p>
        ) : (
          members.map((member) => {
            const memberName = getMemberName(member);
            const isCurrentUser = member._id === currentUserId;

            return (
              <div key={member._id} className="member-item">
                <div className="member-avatar-wrap">
                  <span className="member-avatar">{getInitials(memberName)}</span>
                  <span className={`member-status-dot ${isCurrentUser ? 'online' : ''}`}></span>
                </div>
                <div className="member-copy">
                  <span className="member-name">{memberName}</span>
                  <span className="member-status">{isCurrentUser ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="member-actions">
        <button type="button" className="member-action-button">
          <Settings size={14} />
          <span>Team Settings</span>
        </button>
        <button type="button" className="member-action-button">
          <UserPlus size={14} />
          <span>Invite Members</span>
        </button>
      </div>
    </aside>
  );
};

export default TeamMembers;
