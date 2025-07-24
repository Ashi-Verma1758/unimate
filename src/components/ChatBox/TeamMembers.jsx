import React, { useState, useEffect, useContext } from 'react';
import api from '../../api'; // Import your configured Axios instance
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUserId } = useContext(AuthContext); // Get current user ID from context

  // IMPORTANT: Replace with a valid projectId from your database
  // In a real app, this would be dynamic (e.g., from URL params, or selected project)
  const MOCK_PROJECT_ID = '60d0fe4f5311236168a109cb'; // Replace with an actual project ID from your DB

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!currentUserId || !MOCK_PROJECT_ID) {
        setLoading(false);
        // Optionally, handle case where user/project ID is not available
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Endpoint: GET /api/projects/:projectId/members (assuming this exists)
        // If not, you might need to create such an endpoint on your backend
        const response = await api.get(`/projects/${MOCK_PROJECT_ID}/members`);
        setMembers(response.data.members || []); // Assuming response.data has a 'members' array
      } catch (err) {
        console.error('Error fetching team members:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load team members.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [currentUserId, MOCK_PROJECT_ID]); // Re-fetch when dependencies change

  if (loading) return <div className="team-members-container">Loading team members...</div>;
  if (error) return <div className="team-members-container text-red-500">{error}</div>;

  return (
    <div className="team-members-container">
      <h2 className="team-members-title">Team Members</h2>
      <div className="member-list custom-scrollbar">
        {members.length === 0 ? (
          <p className="text-gray-500 text-sm p-4">No team members found for this project.</p>
        ) : (
          members.map((member) => (
            <div key={member._id} className="member-item">
              <span className="member-name">{member.firstName} {member.lastName}</span>
              <span className="member-email">{member.email}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
