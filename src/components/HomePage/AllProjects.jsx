import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './AllProjects.css'; // Your AllProjectsPage specific CSS

// Import your components - adjust paths based on your actual structure
import Navbar from './Navbar.jsx';
import ProjectCard from './ProjectCard.jsx';

const AllProjectsPage = ({
    projectPosts,
    loadingProjects,
    projectsError,
    backendUrl,
    setSelectedConversationId // Passed from App.js if needed for chat redirection
}) => {
    const navigate = useNavigate();

    // Re-use the same handleSendJoinRequest from HomePage
    const handleSendJoinRequest = async (projectId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('You must be logged in to send a join request.');
            return;
        }
        const message = prompt('Optional: Add a message with your join request:');
        if (message === null) { return; }
        try {
            const res = await axios.post(`${backendUrl}/api/projects/${projectId}/join`, { message }, { headers: { Authorization: `Bearer ${token}` } });
            alert(res.data.message || 'Join request sent successfully!');
        } catch (err) {
            console.error('Error sending join request from AllProjectsPage:', err);
            alert(err.response?.data?.message || 'Failed to send join request. Please try again.');
        }
    };

    return (
        <div className="all-projects-page">
            <Navbar />

            <div className="all-projects-container">
                <div className="all-projects-header">
                    <div onClick={() => navigate(-1)} className="back-button ppp">
                      <span> &larr; Back to Home</span> 
                    </div>
                    <h1 className="page-title">All Project Posts</h1>
                </div>

                <div className="project-list">
                    {loadingProjects ? (
                        <p>Loading all project posts...</p>
                    ) : projectsError ? (
                        <p className="error-message">{projectsError}</p>
                    ) : projectPosts.length === 0 ? (
                        <p>No project posts found. Be the first to create one! 🚀</p>
                    ) : (
                        projectPosts.map((project) => ( // No slicing here, display all
                            <ProjectCard
                                key={project.id}
                                projectId={project.id}
                                author={project.author}
                                university={project.university}
                                timeAgo={project.timeAgo}
                                title={project.title}
                                description={project.description}
                                technologies={project.technologies || []}
                                responseCount={project.responseCount}
                                avatar={project.avatar}
                                onSendRequest={handleSendJoinRequest}
                                projectData={project.fullProjectData} // Passing full data for ProjectInfo
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProjectsPage;