import React, { useState, useRef, useEffect, useContext } from "react";
import './chatwindow.css';
// import Sidebar from "./SideBar.jsx";
// import TeamMembers from "./TeamMembers.jsx";
import Navbar from "../HomePage/Navbar.jsx";
// import api from '../../api'; 
// import { AuthContext } from '../../context/AuthContext'; 
import { Send } from 'lucide-react';

// NEW: Import Socket.IO client
import { io } from 'socket.io-client';

const ChatWindow = (
  // { selectedConversationId, setSelectedConversationId }
) => {
  // const [messages, setMessages] = useState([]);
  // const [newMessageText, setNewMessageText] = useState("");
  // const [loadingMessages, setLoadingMessages] = useState(false);
  // const [messagesError, setMessagesError] = useState(null);
  // const messagesEndRef = useRef(null); 
  // const { currentUserId } = useContext(AuthContext); 
  // const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; 
  // const socket = useRef(null); 
  // useEffect(() => {
  //   socket.current = io(SOCKET_SERVER_URL, {
  //   });
  //   socket.current.on('connect', () => {
  //     console.log('Connected to Socket.IO server:', socket.current.id);
  //     socket.current.emit('userConnected', currentUserId);
  //   });
  //   socket.current.on('receiveMessage', (newMessage) => {
  //     console.log('Received new message:', newMessage);
  //     if (newMessage.conversation === selectedConversationId) {
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     }
  //   });
  //   socket.current.on('disconnect', () => {
  //     console.log('Disconnected from Socket.IO server');
  //   });
  //   socket.current.on('connect_error', (err) => {
  //     console.error('Socket.IO connection error:', err.message);

  //   });
  //   return () => {
  //     if (socket.current) {
  //       socket.current.disconnect();
  //       socket.current = null;
  //     }
  //   };
  // }, [currentUserId, SOCKET_SERVER_URL, selectedConversationId]); 
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!selectedConversationId) {
  //       setMessages([]);
  //       return;
  //     }
  //     try {
  //       setLoadingMessages(true);
  //       setMessagesError(null);
  //       const response = await api.get(`/chats/messages/${selectedConversationId}`);
  //       setMessages(response.data);
  //       if (socket.current) {
  //         socket.current.emit('joinConversation', selectedConversationId);
  //         console.log(`Joined conversation room: ${selectedConversationId}`);
  //       }

  //     } catch (err) {
  //       console.error('Error fetching messages:', err.response?.data || err.message);
  //       setMessagesError(err.response?.data?.message || 'Failed to load messages.');
  //     } finally {
  //       setLoadingMessages(false);
  //     }
  //   };

  //   fetchMessages();
  //   return () => {
  //     if (socket.current && selectedConversationId) {
  //       socket.current.emit('leaveConversation', selectedConversationId);
  //       console.log(`Left conversation room: ${selectedConversationId}`);
  //     }
  //   };

  // }, [selectedConversationId]);
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]); 
  // const handleSendMessage = async () => {
  //   if (!newMessageText.trim() || !selectedConversationId || !currentUserId) {
  //     return; }

  //   const messageToSend = {
  //     conversationId: selectedConversationId,
  //     text: newMessageText,
  //     sender: currentUserId, 
  //     tempId: Date.now(), 
  //     sentAt: new Date().toISOString(), 
  //   };

  //   setMessages((prevMessages) => [...prevMessages, {
  //     ...messageToSend,
  //     _id: messageToSend.tempId, 
  //     sender: currentUserId 
  //   }]);

  //   setNewMessageText("");

  //   try {
  //     socket.current.emit('sendMessage', messageToSend);
  //     setMessagesError(null); // Clear any previous errors

  //   } catch (err) {
  //     console.error('Error sending message:', err.response?.data || err.message);
  //     setMessagesError(err.response?.data?.message || 'Failed to send message.');
  //     setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageToSend.tempId));
  //   }
  // };
  // const formatMessageTime = (isoString) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

  return (
    <>
      <Navbar />
      <div className="comsoon">
        COMING <br/>
       SOON!!!
      </div>
      {/* <div className="noopt">
        <Sidebar setSelectedConversationId={setSelectedConversationId} />
        <div className="chat-window-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <div>
                <h3 className="chat-header-title">
                  {selectedConversationId ? "AI Study Assistant" : "Select a Conversation"}
                </h3>
                <p className="chat-header-members">3 members</p> 
              </div>
            </div>
          </div>
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
                key={message._id || message.tempId} 
                className={`chat-message ${message.sender === currentUserId ? 'sent' : 'received'}`}
              >
                <div className="chat-message-content">
                  <div className="chat-message-info">
                    <span className="chat-message-sender">
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
            <div ref={messagesEndRef} />
          </div>
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
              disabled={!selectedConversationId || loadingMessages} 
            />
            <button
              className="chat-input-send-button"
              onClick={handleSendMessage}
              disabled={!selectedConversationId || loadingMessages || !newMessageText.trim()}
            >
              <Send className="send" />
            </button>
          </div>
        </div>
        <TeamMembers />
      </div> */}
    </>
  );
};

export default ChatWindow;