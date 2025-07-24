import React, { useState, useRef, useEffect, useContext } from "react";
import './chatwindow.css';
import Sidebar from "./SideBar.jsx";
import TeamMembers from "./TeamMembers.jsx";
import Navbar from "../HomePage/Navbar.jsx";
import api from '../../api'; // Import your configured Axios instance
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { Send } from 'lucide-react'; // Import the Send icon from lucide-react

const ChatWindow = ({ selectedConversationId, setSelectedConversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  const { currentUserId } = useContext(AuthContext); // Get current user ID from AuthContext

  // Effect to fetch messages when selectedConversationId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId) {
        setMessages([]); // Clear messages if no conversation is selected
        return;
      }
      try {
        setLoadingMessages(true);
        setMessagesError(null);
        // Endpoint: GET /api/chats/messages/:conversationId
        const response = await api.get(`/chats/messages/${selectedConversationId}`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err.response?.data || err.message);
        setMessagesError(err.response?.data?.message || 'Failed to load messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  // Effect to scroll to the bottom of the chat window
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll whenever messages array changes

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedConversationId || !currentUserId) {
      // console.log("Cannot send message: Missing text, conversation ID, or user ID.");
      return; // Don't send empty messages or if no conversation/user
    }
    try {
      // Endpoint: POST /api/chats/messages/:conversationId
      const response = await api.post(`/chats/messages/${selectedConversationId}`, {
        text: newMessageText,
      });
      // Add the new message to the local state
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessageText(""); // Clear input field
      setMessagesError(null);
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      setMessagesError(err.response?.data?.message || 'Failed to send message.');
    }
  };

  // Helper to format message time (you might have a utility for this)
  const formatMessageTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Navbar />
      <div className="noopt">
        {/* Pass setSelectedConversationId to Sidebar */}
        <Sidebar setSelectedConversationId={setSelectedConversationId} /> 
        <div className="chat-window-container">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div>
                <h3 className="chat-header-title">
                  {selectedConversationId ? "AI Study Assistant" : "Select a Conversation"}
                </h3>
                <p className="chat-header-members">3 members</p> {/* This will need to be dynamic */}
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="chat-messages-area custom-scrollbar">
            {loadingMessages && <div className="text-center text-gray-500">Loading messages...</div>}
            {messagesError && <div className="text-center text-red-500">{messagesError}</div>}
            {!selectedConversationId && !loadingMessages && (
              <div className="text-center text-gray-500 p-4">Please select a conversation from the sidebar.</div>
            )}
            {selectedConversationId && !loadingMessages && messages.length === 0 && (
              <div className="text-center text-gray-500 p-4">No messages in this conversation yet.</div>
            )}

            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat-message ${message.sender === currentUserId ? 'sent' : 'received'}`}
              >
                <div className="chat-message-content">
                  <div className="chat-message-info">
                    {/* Display sender name - you'll need to populate sender in backend getMessages */}
                    <span className="chat-message-sender">
                      {/* Assuming message.sender is populated with user object, or just use ID for 'You' */}
                      {message.sender === currentUserId ? "You" : (message.sender?.firstName || "Unknown")}
                    </span>
                    <span className="chat-message-time">{formatMessageTime(message.sentAt)}</span>
                  </div>
                  <div className="chat-bubble">
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
          </div>

          {/* Conversation Input Area */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              className="chat-input-field"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={!selectedConversationId || loadingMessages} // Disable if no convo selected
            />
            <button
              className="chat-input-send-button"
              onClick={handleSendMessage}
              disabled={!selectedConversationId || loadingMessages || !newMessageText.trim()}
            >
              {/* Lucide Send Icon */}
              <Send className="send" /> {/* Replaced SVG with Lucide Send component */}
            </button>
          </div>
        </div>
        <TeamMembers />
      </div>
    </>
  );
};

export default ChatWindow;
