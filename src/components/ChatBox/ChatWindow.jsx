import React, { useState, useRef, useEffect, useContext } from "react";
import './chatwindow.css';
import Sidebar from "./SideBar.jsx";
import TeamMembers from "./TeamMembers.jsx";
import Navbar from "../HomePage/Navbar.jsx";
import api from '../../api'; // Import your configured Axios instance
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { Send } from 'lucide-react'; // Import the Send icon from lucide-react

// NEW: Import Socket.IO client
import { io } from 'socket.io-client';

const ChatWindow = ({ selectedConversationId, setSelectedConversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  const { currentUserId } = useContext(AuthContext); // Get current user ID from AuthContext

  // IMPORTANT: Define your Socket.IO backend URL
  // Replace with your actual backend URL (e.g., 'http://localhost:5000', 'https://your-api.com')
  // If your React app and Socket.IO server are on the same origin (same domain and port)
  // you might just use `const socket = io();`
  const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Or your specific backend URL

  const socket = useRef(null); // Use useRef to persist the socket instance

  // --- Socket.IO Connection and Event Handling ---
  useEffect(() => {
    // Initialize Socket.IO connection
    // Pass options if needed, e.g., for authentication headers
    socket.current = io(SOCKET_SERVER_URL, {
      // You might need to pass tokens or other auth info here
      // withCredentials: true, // If your backend sets cookies
      // extraHeaders: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}` // Example for JWT
      // }
    });

    // Event listener for successful connection
    socket.current.on('connect', () => {
      console.log('Connected to Socket.IO server:', socket.current.id);
      // Emit an event to join a room for the current user, if your backend supports it
      // This is often done to map socket IDs to user IDs on the backend
      socket.current.emit('userConnected', currentUserId);
    });

    // Event listener for receiving a new message from the server
    socket.current.on('receiveMessage', (newMessage) => {
      console.log('Received new message:', newMessage);
      // Only add message if it belongs to the currently selected conversation
      if (newMessage.conversation === selectedConversationId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Event listener for disconnection
    socket.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Event listener for connection errors
    socket.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      // Optionally display an error to the user
    });

    // Clean up socket connection on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [currentUserId, SOCKET_SERVER_URL, selectedConversationId]); // Reconnect if user changes or server URL changes, or if selectedConversationId changes to update room joining logic if any

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
        const response = await api.get(`/chats/messages/${selectedConversationId}`);
        setMessages(response.data);

        // After fetching initial messages, join the specific conversation room
        // This is important so the user only receives messages for the active conversation
        if (socket.current) {
          socket.current.emit('joinConversation', selectedConversationId);
          console.log(`Joined conversation room: ${selectedConversationId}`);
        }

      } catch (err) {
        console.error('Error fetching messages:', err.response?.data || err.message);
        setMessagesError(err.response?.data?.message || 'Failed to load messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Clean up when conversation changes
    return () => {
      if (socket.current && selectedConversationId) {
        socket.current.emit('leaveConversation', selectedConversationId);
        console.log(`Left conversation room: ${selectedConversationId}`);
      }
    };

  }, [selectedConversationId]); // Depend on selectedConversationId to re-fetch and join room

  // Effect to scroll to the bottom of the chat window
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll whenever messages array changes

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedConversationId || !currentUserId) {
      return; // Don't send empty messages or if no conversation/user
    }

    const messageToSend = {
      conversationId: selectedConversationId,
      text: newMessageText,
      sender: currentUserId, // Include sender for backend validation/processing
      // Add any other temporary fields your backend expects or for optimistic UI updates
      tempId: Date.now(), // For optimistic UI, before real _id from backend
      sentAt: new Date().toISOString(), // Temporary timestamp
    };

    // Optimistically add message to UI
    setMessages((prevMessages) => [...prevMessages, {
      ...messageToSend,
      _id: messageToSend.tempId, // Use tempId as _id for now
      sender: currentUserId // Ensure sender is correctly set for 'sent' class
    }]);

    setNewMessageText(""); // Clear input field immediately

    try {
      // 1. Send message via Socket.IO for real-time delivery
      // Your backend should receive this, save it to DB, and then broadcast it
      socket.current.emit('sendMessage', messageToSend);
      setMessagesError(null); // Clear any previous errors

      // Optional: If your backend only sends new messages via Socket.IO,
      // and doesn't return the full message object from the API POST,
      // you might not need the API.post call here.
      // However, it's good practice to also save it via REST API for persistence
      // and to ensure all data is consistent if Socket.IO fails temporarily.
      // If your backend broadcasts the message after saving, you'll receive it
      // via `socket.on('receiveMessage')` and update state there.

      // If your backend responds with the saved message, you can replace the temp message:
      // const response = await api.post(`/chats/messages/${selectedConversationId}`, { text: messageToSend.text });
      // setMessages((prevMessages) => prevMessages.map(msg =>
      //   msg.tempId === messageToSend.tempId ? response.data : msg
      // ));

    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      setMessagesError(err.response?.data?.message || 'Failed to send message.');
      // If optimistic update was done, you might want to revert it or mark as failed
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageToSend.tempId));
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
                key={message._id || message.tempId} // Use tempId for new messages before they get _id
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
              <Send className="send" />
            </button>
          </div>
        </div>
        <TeamMembers />
      </div>
    </>
  );
};

export default ChatWindow;