import React from 'react';
import { Plus, Users } from 'lucide-react';
import './HomePage.css'

import Navbar from './Navbar.jsx';
import StatsCard from './StatsCard.jsx';
import ProjectCard from './ProjectCard.jsx';
import TeamInvitationCard from './TeamInvitationCard.jsx';


const HomePage = () => {
    // Sample data
    const projectPosts = [
        {
            id: 1,
            author: 'Sarah Chen',
            university: 'Stanford',
            timeAgo: '2 hours ago',
            title: 'Looking for React Developer for Hackathon',
            description: 'Building a social impact app for climate change awareness. Need someone with React and Node.js experience.',
            technologies: ['React', 'Node.js', 'MongoDB'],
            responseCount: 12,
            avatar: 'S'
        },
        {
            id: 2,
            author: 'Mike Johnson',
            university: 'MIT',
            timeAgo: '4 hours ago',
            title: 'AI Study Group Formation',
            description: 'Looking to form a study group for advanced machine learning concepts. We\'ll work on projects together.',
            technologies: ['Python', 'TensorFlow', 'PyTorch'],
            responseCount: 8,
            avatar: 'M'
        }
    ];
     const handleAcceptInvitation = (id) => {
    console.log('Accepted invitation:', id);
  };

  const handleDeclineInvitation = (id) => {
    console.log('Declined invitation:', id);
  };

    const teamInvitations = [
        {
            id: 1,
            projectName: 'AI Study Assistant',
            fromName: 'Alex Rodriguez',
            timeAgo: '1 hour ago'
        },
        {
            id: 2,
            projectName: 'Campus Food Delivery',
            fromName: 'Jessica Kim',
            timeAgo: '3 hours ago'
        }
    ];

     return (
    <div className="homepage">
      <Navbar />
      
      <div className="homepage-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className='welcome-content'>
            <h1 className="welcome-title">
              Welcome back!!
            </h1>
            <p className="welcome-subtitle">
              Ready to collaborate and build something amazing today?
            </p>
          </div>
           
          <button className="create-project-button">
            <Plus size={20} />
            <span>Create Project</span>
          </button>
          
        </div>
        {/* Stats Cards */}
            <div className="stats-grid">
              <StatsCard number="3" label="Active Projects"  />
              <StatsCard number="12" label="Team Members"  />
              <StatsCard number="7" label="Completed Projects"  />
              <StatsCard number="2" label="Hackathons Won"  />
            </div>
        <div className="homepage-grid">
          {/* Main Content */}
          <div className="main-content">
          
            

            {/* Recent Project Posts */}
            <div className="recent-projects">
              <div className="section-header">
                <h2 className="section-title">
                  Recent Project Posts
                </h2>
                <button className="view-all-button">
                  View all
                </button>
              </div>
              
              <div className="projects-list">
                {projectPosts.map((project) => (
                  <ProjectCard
                    key={project.id}
                    author={project.author}
                    university={project.university}
                    timeAgo={project.timeAgo}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    responseCount={project.responseCount}
                    avatar={project.avatar}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="side-bar">
            <div className="side-bar-card">
              <div className="sidebar-header">
                <Users size={20} />
                <h3 className="sidebar-title">
                  Team Invitations
                </h3>
              </div>
              
              <div className="invitations-list">
                {teamInvitations.map((invitation) => (
                  <TeamInvitationCard
                    key={invitation.id}
                    projectName={invitation.projectName}
                    fromName={invitation.fromName}
                    timeAgo={invitation.timeAgo}
                    onAccept={() => handleAcceptInvitation(invitation.id)}
                    onDecline={() => handleDeclineInvitation(invitation.id)}
                  />
                ))}
              </div>
              
              <button className="view-all-invitations">
                View All Invitations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage