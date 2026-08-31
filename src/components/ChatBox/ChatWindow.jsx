import React, { useState, useRef, useEffect } from "react";
import './ChatWindow.css';
import Navbar from "../HomePage/Navbar.jsx";
import TeamMembers from './TeamMembers.jsx';
import {
  Image,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const backendUrl = 'http://localhost:8000';

const ChatWindow = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('accessToken');
    let userId = storedUser?._id || storedUser?.id || null;

    if (!userId && token) {
      try {
        userId = JSON.parse(atob(token.split('.')[1]))?.id || null;
      } catch (error) {
        console.error('Failed to decode user token:', error);
      }
    }

    setCurrentUserId(userId);

    if (!token) {
      setMessagesError('Please log in to access chat.');
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/chats/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const convos = response.data || [];
        setConversations(convos);

        const pendingConversationId = localStorage.getItem('pendingChatConversationId');
        const pendingConversationExists = convos.some((conversation) => conversation._id === pendingConversationId);
        const targetConversationId = pendingConversationExists ? pendingConversationId : convos[0]?._id;

        if (pendingConversationId && !pendingConversationExists) {
          localStorage.removeItem('pendingChatConversationId');
        }

        if (targetConversationId) {
          setSelectedConversationId(targetConversationId);
          localStorage.removeItem('pendingChatConversationId');
        }
      } catch (err) {
        console.error('Error fetching conversations:', err.response?.data || err.message);
        setMessagesError(err.response?.data?.message || 'Failed to load conversations.');
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setTeamMembers([]);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        setMessagesError(null);

        const response = await axios.get(`${backendUrl}/api/chats/${selectedConversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const chatMessages = response.data?.messages || response.data || [];
        setMessages(chatMessages);

        socketRef.current?.emit('joinRoom', { conversationId: selectedConversationId });
      } catch (err) {
        console.error('Error fetching messages:', err.response?.data || err.message);
        setMessagesError(err.response?.data?.message || 'Failed to load messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  useEffect(() => {
    const selectedConversation = conversations.find((conversation) => conversation._id === selectedConversationId);
    const projectId = selectedConversation?.project?._id || selectedConversation?.project;
    const token = localStorage.getItem('accessToken');

    if (!selectedConversationId) {
      setTeamMembers([]);
      return;
    }

    if (!projectId || !token) {
      setTeamMembers(selectedConversation?.members || []);
      return;
    }

    const fetchSelectedTeamMembers = async () => {
      try {
        setLoadingTeamMembers(true);
        setTeamMembers(selectedConversation?.members || []);
        const response = await axios.get(`${backendUrl}/api/projects/${projectId}/team`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const team =
          response.data?.data?.team ||
          response.data?.team ||
          response.data?.members ||
          [];

        setTeamMembers(team.length > 0 ? team : selectedConversation?.members || []);
      } catch (error) {
        console.error('Error fetching selected team members:', error.response?.data || error.message);
        setTeamMembers(selectedConversation?.members || []);
      } finally {
        setLoadingTeamMembers(false);
      }
    };

    fetchSelectedTeamMembers();
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    const socket = io(`${backendUrl}`);
    socketRef.current = socket;

    socket.on('connect', () => {
      if (selectedConversationId) {
        socket.emit('joinRoom', { conversationId: selectedConversationId });
      }
    });

    socket.on('receiveMessage', (newMessage) => {
      const conversationId = newMessage.conversationId || newMessage.conversation;

      if (conversationId === selectedConversationId) {
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg._id === newMessage._id || msg.tempId === newMessage.tempId);
          if (exists) return prevMessages;
          return [...prevMessages, newMessage];
        });
      }

      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation._id === conversationId
            ? { ...conversation, lastMessage: newMessage.text, updatedAt: newMessage.sentAt || new Date().toISOString() }
            : conversation
        )
      );
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedConversationId || !currentUserId) return;

    const trimmedText = newMessageText.trim();
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `${backendUrl}/api/chats/${selectedConversationId}/messages`,
        { text: trimmedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMessage = response.data;
      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg._id === savedMessage._id);
        if (exists) return prevMessages;
        return [...prevMessages, savedMessage];
      });

      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation._id === selectedConversationId
            ? { ...conversation, lastMessage: trimmedText, updatedAt: savedMessage.sentAt || new Date().toISOString() }
            : conversation
        )
      );

      setNewMessageText('');
      setMessagesError(null);
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      setMessagesError(err.response?.data?.message || 'Failed to send message.');
    }
  };

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U';

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getMemberName = (member) =>
    member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email || 'Member';

  const selectedConversation = conversations.find((conversation) => conversation._id === selectedConversationId);
  const selectedMembers = selectedConversation?.members || [];
  const selectedTeamMembers = teamMembers.length > 0 ? teamMembers : selectedMembers;
  const otherMembers = selectedMembers.filter((member) => member._id !== currentUserId);
  const memberNameById = selectedTeamMembers.reduce((names, member) => {
    names[member._id] = getMemberName(member);
    return names;
  }, {});

  const conversationTitle =
    selectedConversation?.project?.title ||
    otherMembers.map(getMemberName).join(', ') ||
    'Select a conversation';

  return (
    <>
      <Navbar />
      <main className="chat-page-shell">
        <aside className="sidebar-container team-list-panel">
          <h2 className="sidebar-title">Your Teams</h2>

          <div className="conversation-list custom-scrollbar">
            {conversations.length === 0 ? (
              <p className="empty-state">No conversations found.</p>
            ) : (
              conversations.map((convo) => {
                const title =
                  convo.project?.title ||
                  convo.members
                    ?.filter((member) => member._id !== currentUserId)
                    .map(getMemberName)
                    .join(', ') ||
                  'Unnamed Chat';

                return (
                  <button
                    type="button"
                    key={convo._id}
                    className={`conversation-item ${selectedConversationId === convo._id ? 'active' : ''}`}
                    onClick={() => setSelectedConversationId(convo._id)}
                  >
                    <div className="conversation-info">
                      <div className="conversation-text">
                        <div className="conversation-topline">
                          <h4 className="conversation-name">{title}</h4>
                          {convo.unreadCount > 0 && <span className="conversation-badge">{convo.unreadCount}</span>}
                        </div>
                        <p className="last-message">{convo.lastMessage || 'No messages yet.'}</p>
                        <div className="conversation-meta-row">
                          <span>{getRelativeTime(convo.updatedAt)}</span>
                          <div className="conversation-mini-avatars" aria-hidden="true">
                            {(convo.members || []).slice(0, 3).map((member) => (
                              <span key={member._id} className="mini-avatar">
                                {getInitials(getMemberName(member))}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="chat-window-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-stack" aria-hidden="true">
                {(selectedTeamMembers.length ? selectedTeamMembers : [{ _id: 'empty', firstName: 'S' }]).slice(0, 3).map((member) => (
                  <span key={member._id} className="chat-avatar">
                    {getInitials(getMemberName(member))}
                  </span>
                ))}
              </div>
              <div>
                <h3 className="chat-header-title">{conversationTitle}</h3>
                <p className="chat-header-members">
                  {loadingTeamMembers ? 'Loading members...' : `${selectedTeamMembers.length || 0} members`}
                </p>
              </div>
            </div>

            <div className="chat-header-actions">
              <button className="header-icon-button" type="button" aria-label="Start voice call" title="Voice call">
                <Phone size={16} />
              </button>
              <button className="header-icon-button" type="button" aria-label="Start video call" title="Video call">
                <Video size={16} />
              </button>
              <button className="header-icon-button" type="button" aria-label="More options" title="More options">
                <MoreVertical size={17} />
              </button>
            </div>
          </div>

          <div className="chat-messages-area custom-scrollbar">
            {loadingMessages && <div className="chat-state-message">Loading messages...</div>}
            {messagesError && <div className="chat-state-message error">{messagesError}</div>}
            {!selectedConversationId && !loadingMessages && (
              <div className="chat-state-message">Please select a conversation.</div>
            )}
            {selectedConversationId && !loadingMessages && messages.length === 0 && (
              <div className="chat-state-message">No messages in this conversation yet.</div>
            )}

            {messages.map((message) => {
              const senderId = message.sender?._id || message.sender || message.userId;
              const isSent = senderId === currentUserId;
              const senderName =
                message.sender?.firstName || message.sender?.lastName
                  ? `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`.trim()
                  : memberNameById[senderId] || 'Unknown';

              return (
                <div key={message._id || message.tempId} className={`chat-message ${isSent ? 'sent' : 'received'}`}>
                  {!isSent && (
                    <div className="message-avatar" aria-hidden="true">
                      {getInitials(senderName)}
                    </div>
                  )}
                  <div className="chat-message-content">
                    <div className="message-meta-line">
                      {!isSent && <span className="chat-message-sender">{senderName}</span>}
                      <span className="chat-message-time">{formatMessageTime(message.sentAt || message.createdAt)}</span>
                    </div>
                    <div className="chat-bubble-wrap">
                      <div className="chat-bubble">
                        <p>{message.text}</p>
                      </div>
                    </div>
                  </div>
                  {isSent && <div className="message-avatar sent-avatar" aria-hidden="true">S</div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <button className="chat-utility-button" type="button" aria-label="Attach file" title="Attach file">
              <Paperclip size={16} />
            </button>
            <button className="chat-utility-button" type="button" aria-label="Add image" title="Add image">
              <Image size={16} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="chat-input-field"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={!selectedConversationId || loadingMessages}
            />
            <button className="chat-utility-button" type="button" aria-label="Add emoji" title="Add emoji">
              <Smile size={16} />
            </button>
            <button
              className="chat-input-send-button"
              type="button"
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={!selectedConversationId || loadingMessages || !newMessageText.trim()}
            >
              <Send className="send" />
            </button>
          </div>
        </section>

        <TeamMembers members={selectedTeamMembers} currentUserId={currentUserId} loading={loadingTeamMembers} />
      </main>
    </>
  );
};

export default ChatWindow;
