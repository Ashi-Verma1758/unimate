import React, { useState,useRef,useEffect } from "react";
import './chatwindow.css'; 
// import { Sidebar } from "lucide-react";
import Sidebar from "./SideBar.jsx";
import TeamMembers from "./TeamMembers.jsx"
import Navbar from "../HomePage/Navbar.jsx";
const ChatWindow = () => {
  
  return (
   <>
   <Navbar/>
   <div className="noopt">
   <Sidebar/>
    <div className="chat-window-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div>
            <h3 className="chat-header-title">AI Study Assistant</h3>
            <p className="chat-header-members">3 members</p>
          </div>
        </div>
      </div>

     {/* message area */}
      <div className="chat-messages-area custom-scrollbar">
        
        {/* one chat */}
        <div className="chat-message">
        
          <div className="chat-message-content">
            <div className="chat-message-info">
              <span className="chat-message-sender">Sarah Chen</span>
              <span className="chat-message-time">10:30 AM</span>
            </div>
            <div className="chat-bubble">
              <p>Hey everyone! I just pushed the latest changes to the ML model. The accuracy is now up to 92%!</p>
            </div>
          </div>
        </div>
      </div>

      {/* convo input area */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          className="chat-input-field"
        />
        <button className="chat-input-send-button">
          {/* Send Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M15 15 22 2"/></svg>
        </button>
      </div>
    </div>
    <TeamMembers/>
    </div>
  </>
  );
};

export default ChatWindow;
