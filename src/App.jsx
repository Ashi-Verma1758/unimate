import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios'; // Import axios for fetching initial projects
import moment from 'moment'; // Import moment for date formatting

// Import your components
import HomePage from './components/HomePage/HomePage';
import Login from './Log-In';
import ChatWindow from './components/ChatBox/ChatWindow.jsx';
import CreatePost from './components/createpost.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import CreateAccount from './components/CreateAcc.jsx';
import ProjectInfo from './components/ProjectInfo/ProjectInfo.jsx';


function App() {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [allProjectPosts, setAllProjectPosts] = useState([]); // Master state for all project posts
    const [loadingInitialProjects, setLoadingInitialProjects] = useState(true);
    const [initialProjectsError, setInitialProjectsError] = useState(null);

    const backendUrl = 'http://localhost:8000'; // Define backend URL once here

    // Callback function passed to CreatePost
    // This function adds a newly created project (from backend) to the global state
    const handleProjectCreated = (newProjectBackendData) => {
        // newProjectBackendData is the raw project object returned directly from your backend's createProject API
        // We re-format it here to match the structure that ProjectCard and ProjectInfo expect from `getAllProjects`
        const formattedNewProject = {
            id: newProjectBackendData._id,
            // These fields (createdBy.firstName, etc.) must be returned populated by your backend's createProject API
            // For example, your createProject controller should potentially populate `createdBy` before sending response.
            // If not, it will fall back to 'Unknown' or 'N/A' as defined here.
            author: newProjectBackendData.createdBy ? `${newProjectBackendData.createdBy.firstName || ''} ${newProjectBackendData.createdBy.lastName || ''}`.trim() : 'Unknown',
            university: newProjectBackendData.createdBy ? newProjectBackendData.createdBy.university : 'N/A',
            timeAgo: moment(newProjectBackendData.createdAt).fromNow(), // Use actual creation time from backend
            title: newProjectBackendData.title,
            description: newProjectBackendData.description,
            technologies: newProjectBackendData.requiredSkills || [], // ProjectCard expects 'technologies'
            responseCount: newProjectBackendData.joinRequests ? newProjectBackendData.joinRequests.length : 0,
            avatar: newProjectBackendData.createdBy?.avatar || null, // From populated 'createdBy'
            fullProjectData: { // This structure is passed to ProjectInfo
                projectTitle: newProjectBackendData.title,
                projectDescription: newProjectBackendData.description,
                domain: newProjectBackendData.domain,
                projectType: newProjectBackendData.projectType || 'N/A',
                requiredSkills: newProjectBackendData.requiredSkills || [],
                niceToHaveSkills: newProjectBackendData.niceToHaveSkills || [],
                timeCommitment: newProjectBackendData.timeCommitment,
                projectDuration: newProjectBackendData.projectDuration,
                teamSize: newProjectBackendData.teamSize,
                location: newProjectBackendData.location,
                startDate: moment(newProjectBackendData.startDate).format('YYYY-MM-DD'),
                applicationDeadline: moment(newProjectBackendData.applicationDeadline).format('YYYY-MM-DD'),
                remoteWorkOkay: newProjectBackendData.remote,
                githubRepo: newProjectBackendData.githubRepo || '',
                figmaLink: newProjectBackendData.figmaLink || '',
                demoLink: newProjectBackendData.demoLink || '',
                createdAt: newProjectBackendData.createdAt, // Important for ProjectInfo's postedDate
                responseCount: newProjectBackendData.joinRequests ? newProjectBackendData.joinRequests.length : 0,
                viewsCount: newProjectBackendData.views || 0,
                currentTeamCount: newProjectBackendData.currentTeamCount || (newProjectBackendData.createdBy ? 1 : 0), // Use virtual or derive
                authorDetails: {
                    name: newProjectBackendData.createdBy ? `${newProjectBackendData.createdBy.firstName || ''} ${newProjectBackendData.createdBy.lastName || ''}`.trim() : 'Unknown',
                    university: newProjectBackendData.createdBy ? newProjectBackendData.createdBy.university : 'N/A',
                    year: newProjectBackendData.createdBy ? newProjectBackendData.createdBy.academicYear : 'N/A',
                    rating: newProjectBackendData.createdBy ? newProjectBackendData.createdBy.rating : 0,
                    projectsCompleted: newProjectBackendData.createdBy ? newProjectBackendData.projectsCompleted : 0,
                    avatar: newProjectBackendData.createdBy?.avatar || null,
                }
            }
        };
        // Add the newly created and formatted project to the beginning of the list (most recent first)
        setAllProjectPosts(prevPosts => [formattedNewProject, ...prevPosts]);
    };

    // Function to fetch all projects initially when the App component mounts
    useEffect(() => {
        const fetchAllProjects = async () => {
            setLoadingInitialProjects(true);
            setInitialProjectsError(null);
            try {
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get(`${backendUrl}/api/projects`, { headers }); // Calls your getAllProjects API

                // Map fetched projects to the format HomePage's ProjectCard expects
                const formattedProjects = res.data.map(project => ({
                    id: project._id,
                    author: project.createdBy ? `${project.createdBy.firstName || ''} ${project.createdBy.lastName || ''}`.trim() : 'Unknown',
                    university: project.createdBy ? project.createdBy.university : 'N/A',
                    timeAgo: moment(project.createdAt).fromNow(),
                    title: project.title,
                    description: project.description,
                    technologies: project.requiredSkills || [],
                    responseCount: project.joinRequests ? project.joinRequests.length : 0,
                    avatar: project.createdBy?.avatar || null,
                    fullProjectData: { // This nested object is passed to ProjectInfo
                        projectTitle: project.title,
                        projectDescription: project.description,
                        domain: project.domain,
                        projectType: project.projectType || 'N/A',
                        requiredSkills: project.requiredSkills || [],
                        niceToHaveSkills: project.niceToHaveSkills || [],
                        timeCommitment: project.timeCommitment,
                        projectDuration: project.projectDuration, // Use this for ProjectInfo's duration
                        teamSize: project.teamSize,
                        location: project.location,
                        startDate: moment(project.startDate).format('YYYY-MM-DD'),
                        applicationDeadline: moment(project.applicationDeadline).format('YYYY-MM-DD'),
                        remoteWorkOkay: project.remote,
                        githubRepo: project.githubRepo || '',
                        figmaLink: project.figmaLink || '',
                        demoLink: project.demoLink || '',
                        createdAt: project.createdAt, // Important for postedDate in ProjectInfo
                        responseCount: project.joinRequests ? project.joinRequests.length : 0,
                        viewsCount: project.views || 0,
                        currentTeamCount: project.currentTeamCount || (project.createdBy ? 1 : 0),
                        authorDetails: {
                            name: project.createdBy ? `${project.createdBy.firstName || ''} ${project.createdBy.lastName || ''}`.trim() : 'Unknown',
                            university: project.createdBy ? project.createdBy.university : 'N/A',
                            year: project.createdBy ? project.createdBy.academicYear : 'N/A',
                            rating: project.createdBy ? project.createdBy.rating : 0,
                            projectsCompleted: project.createdBy ? project.createdBy.projectsCompleted : 0,
                            avatar: project.createdBy?.avatar || null,
                        }
                    }
                }));
                setAllProjectPosts(formattedProjects);
            } catch (err) {
                console.error('Error fetching all projects for App.js:', err);
                setInitialProjectsError(err.response?.data?.message || 'Failed to load initial projects.');
            } finally {
                setLoadingInitialProjects(false);
            }
        };

        fetchAllProjects();
    }, [backendUrl]); // Dependency array: rerun when backendUrl changes (unlikely)


    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/signup" element={<CreateAccount />} />
                    <Route path="/login" element={<Login />} />

                    {/* HomePage route: Pass global project data and related states/callbacks */}
                    <Route
                        path="/homepage"
                        element={
                            <HomePage
                                projectPosts={allProjectPosts} // Pass the global list to HomePage
                                loadingProjects={loadingInitialProjects} // Pass loading state
                                projectsError={initialProjectsError} // Pass error state
                                setSelectedConversationId={setSelectedConversationId}
                                backendUrl={backendUrl}
                                // HomePage no longer has its own fetchProjectPosts, it receives the data.
                                // If HomePage needs to *refresh* all projects (e.g., via a "refresh" button),
                                // you could pass `fetchAllProjects` as a prop too.
                            />
                        }
                    />

                    {/* CreatePost route: Pass the callback to add newly created projects */}
                    <Route
                        path="/CreatePost" // Consistent casing for route path
                        element={
                            <CreatePost
                                onProjectCreated={handleProjectCreated} // Pass the callback function
                                backendUrl={backendUrl}
                            />
                        }
                    />

                    {/* ProjectInfo route: No special props needed, it uses useLocation state */}
                    <Route path="/ProjectInfo" element={<ProjectInfo />} />

                    {/* ChatWindow route: Pass conversation ID state */}
                    <Route
                        path="/chat"
                        element={<ChatWindow selectedConversationId={selectedConversationId} />}
                    />
                    {/* Removed duplicate routes: /create, /fullpost */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;