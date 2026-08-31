import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Filter, Search } from 'lucide-react';
import './AllProjects.css';

import Navbar from './Navbar.jsx';
import ProjectCard from './ProjectCard.jsx';

const AllProjectsPage = ({
    projectPosts,
    loadingProjects,
    projectsError,
    backendUrl,
}) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [contentType, setContentType] = useState('All types');
    const [domain, setDomain] = useState('All domains');
    const [timeCommitment, setTimeCommitment] = useState('Any commitment');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [sortBy, setSortBy] = useState('Most Recent');

    const allSkills = useMemo(() => {
        const skills = projectPosts.flatMap((project) => project.technologies || []);
        const fallbackSkills = ['React', 'Python', 'JavaScript', 'Node.js', 'Java', 'C++', 'Machine Learning'];
        return Array.from(new Set([...fallbackSkills, ...skills].filter(Boolean))).slice(0, 10);
    }, [projectPosts]);

    const domains = useMemo(() => {
        const projectDomains = projectPosts
            .map((project) => project.fullProjectData?.domain)
            .filter(Boolean);
        return ['All domains', ...Array.from(new Set(projectDomains))];
    }, [projectPosts]);

    const filteredProjects = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const filtered = projectPosts.filter((project) => {
            const fullProject = project.fullProjectData || {};
            const projectSkills = (project.technologies || []).map((skill) => skill.toLowerCase());
            const haystack = [
                project.title,
                project.description,
                project.author,
                project.university,
                fullProject.domain,
                fullProject.projectType,
                ...projectSkills,
            ].filter(Boolean).join(' ').toLowerCase();

            const typeMatches = contentType === 'All types' || contentType === 'Projects';
            const domainMatches = domain === 'All domains' || fullProject.domain === domain;
            const commitmentMatches = timeCommitment === 'Any commitment' || fullProject.timeCommitment === timeCommitment;
            const skillMatches = selectedSkills.length === 0
                || selectedSkills.some((skill) => projectSkills.includes(skill.toLowerCase()));

            return (!query || haystack.includes(query))
                && typeMatches
                && domainMatches
                && commitmentMatches
                && skillMatches;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === 'Most Responses') {
                return (b.responseCount || 0) - (a.responseCount || 0);
            }

            const createdA = new Date(a.fullProjectData?.createdAt || 0).getTime();
            const createdB = new Date(b.fullProjectData?.createdAt || 0).getTime();
            return createdB - createdA;
        });
    }, [contentType, domain, projectPosts, searchQuery, selectedSkills, sortBy, timeCommitment]);

    const toggleSkill = (skill) => {
        setSelectedSkills((currentSkills) => (
            currentSkills.includes(skill)
                ? currentSkills.filter((currentSkill) => currentSkill !== skill)
                : [...currentSkills, skill]
        ));
    };

    const handleSendJoinRequest = async (projectId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('You must be logged in to send a join request.');
            return;
        }

        const message = prompt('Optional: Add a message with your join request:');
        if (message === null) return;

        try {
            const res = await axios.post(
                `${backendUrl}/api/projects/${projectId}/join`,
                { message },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            alert(res.data.message || 'Join request sent successfully!');
        } catch (err) {
            console.error('Error sending join request from AllProjectsPage:', err);
            alert(err.response?.data?.message || 'Failed to send join request. Please try again.');
        }
    };

    return (
        <div className="all-projectsss-page">
            <Navbar />

            <div className="all-projectsss-container">
                <div className="all-projectss-header">
                    <button type="button" onClick={() => navigate(-1)} className="all-projects-back-button">
                        Back to Home
                    </button>
                    <h1 className="pageee-title">Find Projects, Teammates & Events</h1>
                </div>

                <div className="all-projects-search-row">
                    <div className="all-projects-search">
                        <Search size={17} />
                        <input
                            type="search"
                            placeholder="Search for projects, skills, or keywords..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <button type="button" className="all-projects-filter-button">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className="all-projects-body">
                    <aside className="all-projects-filters" aria-label="Project filters">
                        <h2>Filters</h2>

                        <label htmlFor="all-projects-content-type">Content Type</label>
                        <div className="all-projects-select">
                            <select
                                id="all-projects-content-type"
                                value={contentType}
                                onChange={(event) => setContentType(event.target.value)}
                            >
                                <option>All types</option>
                                <option>Projects</option>
                            </select>
                            <ChevronDown size={15} />
                        </div>

                        <label htmlFor="all-projects-domain">Domain</label>
                        <div className="all-projects-select">
                            <select
                                id="all-projects-domain"
                                value={domain}
                                onChange={(event) => setDomain(event.target.value)}
                            >
                                {domains.map((domainOption) => (
                                    <option key={domainOption}>{domainOption}</option>
                                ))}
                            </select>
                            <ChevronDown size={15} />
                        </div>

                        <span className="all-projects-filter-label">Skills</span>
                        <div className="all-projects-skills-list">
                            {allSkills.map((skill) => (
                                <label key={skill}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSkills.includes(skill)}
                                        onChange={() => toggleSkill(skill)}
                                    />
                                    <span>{skill}</span>
                                </label>
                            ))}
                        </div>

                        <label htmlFor="all-projects-time">Time Commitment</label>
                        <div className="all-projects-select">
                            <select
                                id="all-projects-time"
                                value={timeCommitment}
                                onChange={(event) => setTimeCommitment(event.target.value)}
                            >
                                <option>Any commitment</option>
                                <option>1-5 hours/week</option>
                                <option>5-10 hours/week</option>
                                <option>10-15 hours/week</option>
                                <option>15+ hours/week</option>
                            </select>
                            <ChevronDown size={15} />
                        </div>
                    </aside>

                    <main className="all-projects-results">
                        <div className="all-projects-results-top">
                            <p>{filteredProjects.length} results found</p>
                            <div className="all-projects-sort">
                                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                                    <option>Most Recent</option>
                                    <option>Most Responses</option>
                                </select>
                                <ChevronDown size={15} />
                            </div>
                        </div>

                        <div className="projectss-list">
                            {loadingProjects ? (
                                <p className="all-projects-state">Loading all project posts...</p>
                            ) : projectsError ? (
                                <p className="error-message">{projectsError}</p>
                            ) : filteredProjects.length === 0 ? (
                                <p className="all-projects-state">No project posts found. Be the first to create one!</p>
                            ) : (
                                filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        variant="discovery"
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
                                        hasUserSentRequest={project.hasUserSentRequest}
                                        projectData={project.fullProjectData}
                                    />
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AllProjectsPage;
