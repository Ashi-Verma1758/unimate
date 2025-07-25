import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Your global App CSS
import axios from 'axios';
import moment from 'moment';


import HomePage from './components/HomePage/HomePage';
import Login from './Log-In'; // Assuming directly in src/
import ChatWindow from './components/ChatBox/ChatWindow.jsx'; // Assuming in src/components/ChatBox/
import CreatePost from './components/createpost.jsx'; // Assuming directly in src/components/
import { AuthProvider } from './context/AuthContext.jsx'; // Assuming in src/context/
import HeroSection from './components/HeroSection/HeroSection.jsx'; // Assuming in src/components/HeroSection/
import CreateAccount from './components/CreateAcc.jsx'; // Assuming directly in src/components/
import ProjectInfo from './components/ProjectInfo/ProjectInfo.jsx'; // Assuming in src/components/HomePage/

import AllProjectsPage from './components/HomePage/AllProjects.jsx'; // Assuming in src/components/HomePage/
import TeamInvitations from './components/teamInvite/TeamInvite.jsx';

function App() {

    const backendUrl = 'http://localhost:8000'; // IMPORTANT: Replace with your actual backend URL

    // CONSOLIDATED STATE FOR ALL PROJECT POSTS - SINGLE SOURCE OF TRUTH
    const [projectPosts, setProjectPosts] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState(null);

    const [selectedConversationId, setSelectedConversationId] = useState(null);

    // Function to fetch all projects (can be called to refresh data)
    const fetchAllProjectsData = async () => {
        setLoadingProjects(true);
        setProjectsError(null);
        console.log('App.js: fetchAllProjectsData started. Setting loadingProjects to true.');

        try {
            const token = localStorage.getItem('accessToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`${backendUrl}/api/projects`, config);

            // Ensure createdBy is populated in your backend's getAllProjects controller
            // for author details on frontend.
            const formattedProjects = res.data.map(project => ({
                id: project._id,
                // These details come from the populated 'createdBy' field
                author: project.createdBy ? `${project.createdBy.firstName || ''} ${project.createdBy.lastName || ''}`.trim() : 'Unknown User',
                university: project.createdBy?.university || 'N/A',
                timeAgo: moment(project.createdAt).fromNow(),
                title: project.title,
                description: project.description,
                technologies: project.requiredSkills, // Using requiredSkills for display
                responseCount: project.joinRequests?.length || 0, // Use safe access
                avatar: project.createdBy?.avatar || null,
                fullProjectData: project, // Pass the raw backend object for ProjectInfo
            }));
            setProjectPosts(formattedProjects);
            console.log('App.js: Projects fetched successfully. Count:', formattedProjects.length);
        } catch (err) {
            console.error('App.js: Error fetching project posts:', err);
            setProjectsError(err.response?.data?.message || 'Failed to load projects.');
        } finally {
            setLoadingProjects(false);
            console.log('App.js: fetchAllProjectsData finished. Setting loadingProjects to false.');
        }
    };

    // Fetch all projects initially when the App component mounts
    useEffect(() => {
        fetchAllProjectsData();
    }, [backendUrl]); // Depend on backendUrl if it can change

    // Callback function passed to CreatePost to update global state immediately
    const handleProjectCreated = (newProjectBackendData) => {
        const formattedNewProject = {
            id: newProjectBackendData._id,
            author: newProjectBackendData.createdBy ? `${newProjectBackendData.createdBy.firstName || ''} ${newProjectBackendData.createdBy.lastName || ''}`.trim() : 'Unknown',
            university: newProjectBackendData.createdBy ? newProjectBackendData.createdBy.university : 'N/A',
            timeAgo: moment(newProjectBackendData.createdAt).fromNow(),
            title: newProjectBackendData.title,
            description: newProjectBackendData.description,
            technologies: newProjectBackendData.requiredSkills || [],
            responseCount: newProjectBackendData.joinRequests ? newProjectBackendData.joinRequests.length : 0,
            avatar: newProjectBackendData.createdBy?.avatar || null,
            fullProjectData: newProjectBackendData, // Pass the raw data back for consistency
        };
        // Add the newly created and formatted project to the beginning of the list
        setProjectPosts(prevPosts => [formattedNewProject, ...prevPosts]);
    };

    console.log('App.js: Rendering App component. projectPosts count:', projectPosts.length, 'loadingProjects:', loadingProjects, 'projectsError:', projectsError);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/signup" element={<CreateAccount />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/homepage"
                        element={
                            <HomePage
                                projectPosts={projectPosts} // Pass the consolidated state
                                loadingProjects={loadingProjects} // Pass the consolidated state
                                projectsError={projectsError} // Pass the consolidated state
                                setSelectedConversationId={setSelectedConversationId}
                                backendUrl={backendUrl}
                            />
                        }
                    />
                    <Route
                        path="/all-projects"
                        element={
                            <AllProjectsPage
                                projectPosts={projectPosts} // Pass the consolidated state
                                loadingProjects={loadingProjects}
                                projectsError={projectsError}
                                backendUrl={backendUrl}
                                setSelectedConversationId={setSelectedConversationId}
                            />
                        }
                    />

                    <Route
                        path="/CreatePost"
                        element={
                            <CreatePost
                                onProjectCreated={handleProjectCreated} // Pass callback
                                backendUrl={backendUrl}
                            />
                        }
                    />

                    <Route path="/ProjectInfo" element={<ProjectInfo />} />
                    <Route path="/Team" element={<TeamInvitations />} />


                    <Route
                        path="/chat"
                        element={<ChatWindow selectedConversationId={selectedConversationId} />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );

}

export default App;