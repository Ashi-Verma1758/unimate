import React from 'react';
import './TeamCard.css';
import {CircleCheckBig, CircleX } from 'lucide-react'
const TeamCard = ({ team, onAccept, onReject }) => {
  return (
    <div className="pending-invite-card">
      <div className="pending-invite-top">
        <div>
          <h3 className="invite-team-name">
            {/* {team.name} */}fdgdfg
            </h3>
          <p className="invite-domain">
            {/* {team.domain} */}fgdf
            </p>
        </div>
        <span className="invite-status">Pending</span>
      </div>

      <div className="invite-actions">
        <button className="btns" 
        // onclick={() => onReject(team._id)}
        ><CircleX className='circle'/>Reject</button>
        <button className="btns" 
        // onclick={() => onAccept(team._id)}
        ><CircleCheckBig className='circle'/>Accept</button>
      </div>
    </div>
  );
};

export default TeamCard;
