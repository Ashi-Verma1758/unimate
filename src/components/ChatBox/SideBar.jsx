import React, { useState, useEffect, useContext } from 'react';
import api from '../../api'; // Import your configured Axios instance
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const Sidebar = ({ setSelectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUserId } = useContext(AuthContext); // Get current user ID from context

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) {
        setLoading(false);
        // Optionally, handle case where user is not logged in/ID not available
        return; 
      }
      try {
        setLoading(true);
        setError(null);
        // Endpoint: GET /api/chats/conversations
        const response = await api.get('/chats/conversations');
        setConversations(response.data);
      } catch (err) {
        console.error('Error fetching conversations:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]); // Re-fetch when currentUserId changes

  if (loading) return <div className="sidebar-container">Loading conversations...</div>;
  if (error) return <div className="sidebar-container text-red-500">{error}</div>;

  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">Conversations</h2>
      <div className="conversation-list custom-scrollbar">
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm p-4">No conversations found.</p>
        ) : (
          conversations.map((convo) => (
            <div
              key={convo._id}
              className="conversation-item"
              onClick={() => setSelectedConversationId(convo._id)}
            >
              <div className="conversation-info">
                {/* Display members (excluding current user) */}
                <h4 className="conversation-name">
                  {convo.members
                    .filter(member => member._id !== currentUserId)
                    .map(member => `${member.firstName} ${member.lastName}`)
                    .join(', ') || 'Unnamed Chat'}
                </h4>
                <p className="last-message">{convo.lastMessage || 'No messages yet.'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
