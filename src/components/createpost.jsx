import React, { useState, useEffect } from 'react'; // Import useEffect
import './createpost.css';
import Navbar from './HomePage/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

function CreatePost() {
    const navigate = useNavigate();
    const backendUrl = 'http://localhost:8000'; // Make sure this matches your backend

    const [projectData, setProjectData] = useState({
        projectTitle: '',
        projectDescription: '',
        domain: '',
        projectType: '',
        requiredSkills: [],
        niceToHaveSkills: [],
        timeCommitment: '',
        projectDuration: '',
        teamSize: '',
        location: '',
        startDate: '',
        applicationDeadline: '',
        remoteWorkOkay: false,
        githubRepo: '',
        figmaLink: '',
        demoLink: '',
    });

    const [currentRequiredSkill, setCurrentRequiredSkill] = useState('');
    const [currentNiceToHaveSkill, setCurrentNiceToHaveSkill] = useState('');
    const [userProfile, setUserProfile] = useState(null); // State to store the logged-in user's profile
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState(null);

    // --- Fetch Logged-in User Profile on Component Mount ---
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoadingProfile(true);
            setProfileError(null);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setProfileError('Authentication required. Please log in.');
                setLoadingProfile(false);
                return;
            }

            try {
                const res = await axios.get(`${backendUrl}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserProfile(res.data); // Store the fetched user profile
            } catch (err) {
                console.error('Error fetching user profile in CreatePost:', err);
                setProfileError(err.response?.data?.message || 'Failed to load user profile.');
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, []); // Empty dependency array means this runs once on mount

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProjectData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddRequiredSkill = () => {
        if (currentRequiredSkill.trim() !== '') {
            setProjectData((prevData) => ({
                ...prevData,
                requiredSkills: [...prevData.requiredSkills, currentRequiredSkill.trim()],
            }));
            setCurrentRequiredSkill('');
        }
    };

    const handleAddNiceToHaveSkill = () => {
        if (currentNiceToHaveSkill.trim() !== '') {
            setProjectData((prevData) => ({
                ...prevData,
                niceToHaveSkills: [...prevData.niceToHaveSkills, currentNiceToHaveSkill.trim()],
            }));
            setCurrentNiceToHaveSkill('');
        }
    };

    const handleRemoveSkill = (skillType, skillToRemove) => {
        setProjectData((prevData) => ({
            ...prevData,
            [skillType]: prevData[skillType].filter((skill) => skill !== skillToRemove),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userProfile) {
            alert('User profile not loaded. Cannot create project. Please try again or log in.');
            return;
        }

        // Construct the project object to be passed, including authorDetails
       // In CreatePost.jsx, inside handleSubmit:
const projectToPass = {
    ...projectData,
    authorDetails: {
        // Use userProfile.firstName and userProfile.lastName if you prefer concatenated name,
        // or userProfile.name if your User model has a single 'name' field
        name: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
        university: userProfile.university || 'N/A', // <-- This must match your DB field
        year: userProfile.academicYear || 'N/A',     // <-- This must match your DB field
        rating: userProfile.rating || 5.0,
        projectsCompleted: userProfile.projectsCompleted || 1
    }
};

        navigate('/ProjectInfo', { state: { project: projectToPass } });
    };

    const handleCancel = () => {
        setProjectData({
            projectTitle: '',
            projectDescription: '',
            domain: '',
            projectType: '',
            requiredSkills: [],
            niceToHaveSkills: [],
            timeCommitment: '',
            projectDuration: '',
            teamSize: '',
            location: '',
            startDate: '',
            applicationDeadline: '',
            remoteWorkOkay: false,
            githubRepo: '',
            figmaLink: '',
            demoLink: '',
        });
        setCurrentRequiredSkill('');
        setCurrentNiceToHaveSkill('');
        navigate('/HomePage'); // Navigate to home page
    };

    // You might want to show a loading state for the form itself
    if (loadingProfile) {
        return (
            <div className="body">
                <Navbar />
                <div className="container">
                    <h2>Loading User Profile...</h2>
                    <p>Please wait while we fetch your details to create the post.</p>
                </div>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="body">
                <Navbar />
                <div className="container">
                    <h2>Error Loading Profile</h2>
                    <p className="error-message">{profileError}</p>
                    <p>Please ensure you are logged in and your backend is running correctly.</p>
                    <button onClick={() => navigate('/login')} className="send-btn">Go to Login</button>
                </div>
            </div>
        );
    }

    // Otherwise, display the form
    return (
        <div className="body">
            <Navbar /> {/* Ensure Navbar is displayed even when creating a post */}
            <div className="container">
                <h2>Create New Project Post</h2>
                <p>Find the perfect teammates for your next project</p>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
                    <div className="section">
                        <h2>Basic Information</h2>
                        <p>Start with the fundamentals of your project</p>

                        <label htmlFor="projectTitle">Project Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="projectTitle"
                            name="projectTitle"
                            placeholder="e.g., AI-Powered Study Assistant"
                            value={projectData.projectTitle}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="projectDescription">Project Description <span className="text-red-500">*</span></label>
                        <textarea
                            id="projectDescription"
                            name="projectDescription"
                            rows="4"
                            placeholder="Describe your project, its goals, and what you hope to achieve..."
                            value={projectData.projectDescription}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <div className="two-col">
                            <div>
                                <label htmlFor="domain">Domain <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="domain"
                                    name="domain"
                                    placeholder="e.g., Software Development"
                                    value={projectData.domain}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="projectType">Project Type</label>
                                <input
                                    type="text"
                                    id="projectType"
                                    name="projectType"
                                    placeholder="e.g., Academic Project"
                                    value={projectData.projectType}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Requirements Section */}
                    <div className="section">
                        <h2>Skills & Requirements</h2>
                        <p>What skills are you looking for in your teammates?</p>

                        <label htmlFor="requiredSkillsInput">Required Skills <span className="text-red-500">*</span></label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                id="requiredSkillsInput"
                                placeholder="Add a required skill"
                                value={currentRequiredSkill}
                                onChange={(e) => setCurrentRequiredSkill(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleAddRequiredSkill}
                                className="plus-btn"
                            >
                                +
                            </button>
                        </div>
                        <div className="skills-list">
                            {projectData.requiredSkills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill('requiredSkills', skill)} className="remove-skill-btn">
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>

                        <label htmlFor="niceToHaveSkillsInput">Nice to Have Skills</label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                id="niceToHaveSkillsInput"
                                placeholder="Add a nice-to-have skill"
                                value={currentNiceToHaveSkill}
                                onChange={(e) => setCurrentNiceToHaveSkill(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleAddNiceToHaveSkill}
                                className="plus-btn"
                            >
                                +
                            </button>
                        </div>
                        <div className="skills-list">
                            {projectData.niceToHaveSkills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill('niceToHaveSkills', skill)} className="remove-skill-btn">
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Timeline & Logistics Section */}
                    <div className="section">
                        <h2>Timeline & Logistics</h2>
                        <p>When and how will your team work together?</p>

                        <div className="two-col">
                            <div>
                                <label htmlFor="timeCommitment">Time Commitment <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="timeCommitment"
                                    name="timeCommitment"
                                    placeholder="Expected time commitment"
                                    value={projectData.timeCommitment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="projectDuration">Project Duration <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="projectDuration"
                                    name="projectDuration"
                                    placeholder="How long is the project?"
                                    value={projectData.projectDuration}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="two-col">
                            <div>
                                <label htmlFor="teamSize">Team Size <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    id="teamSize"
                                    name="teamSize"
                                    placeholder="How many people do you need?"
                                    value={projectData.teamSize}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="e.g., Remote, Campus"
                                    value={projectData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="two-col">
                            <div>
                                <label htmlFor="startDate">Start Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={projectData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="applicationDeadline">Application Deadline <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    id="applicationDeadline"
                                    name="applicationDeadline"
                                    value={projectData.applicationDeadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="checkbox-row">
                            <input
                                type="checkbox"
                                id="remoteWorkOkay"
                                name="remoteWorkOkay"
                                checked={projectData.remoteWorkOkay}
                                onChange={handleChange}
                            />
                            <label htmlFor="remoteWorkOkay">Remote work is okay</label>
                        </div>
                    </div>

                    {/* Additional Resources Section */}
                    <div className="section">
                        <h2>Additional Resources (Optional)</h2>
                        <p>Share any existing work or resources related to your project</p>

                        <label htmlFor="githubRepo">GitHub Repository</label>
                        <input
                            type="url"
                            id="githubRepo"
                            name="githubRepo"
                            placeholder="https://github.com/username/repo"
                            value={projectData.githubRepo}
                            onChange={handleChange}
                        />

                        <label htmlFor="figmaLink">Figma Design</label>
                        <input
                            type="url"
                            id="figmaLink"
                            name="figmaLink"
                            placeholder="https://figma.com/..."
                            value={projectData.figmaLink}
                            onChange={handleChange}
                        />

                        <label htmlFor="demoLink">Demo/Prototype</label>
                        <input
                            type="url"
                            id="demoLink"
                            name="demoLink"
                            placeholder="https://demo.example.com"
                            value={projectData.demoLink}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="footer-buttons">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="publish"
                        >
                            Publish Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;