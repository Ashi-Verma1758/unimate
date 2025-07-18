import React from 'react';
import { Plus, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, John!
            </h1>
            <p className="text-gray-600">
              Ready to collaborate and build something amazing today?
            </p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={20} />
            <span>Create Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard number="3" label="Active Projects" color="blue" />
              <StatsCard number="12" label="Team Members" color="green" />
              <StatsCard number="7" label="Completed Projects" color="purple" />
              <StatsCard number="2" label="Hackathons Won" color="orange" />
            </div>

            {/* Recent Project Posts */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Project Posts
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View all
                </button>
              </div>
              
              <div className="space-y-6">
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Invitations
                </h3>
              </div>
              
              <div className="space-y-4">
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
              
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm text-center py-2">
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