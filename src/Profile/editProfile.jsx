import React, { useState, useEffect } from 'react';
import './editprofile.css';
import Navbar from '../components/HomePage/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
    const navigate = useNavigate();
    const backendUrl = 'http://localhost:8000';

    const [formData, setFormData] = useState({
        name: '',
        university: '',
        academicYear: '',
        major: '',
        bio: '',
        github: '',
        linkedin: '',
        portfolio: '',
        skills: []
    });

    const [currentSkill, setCurrentSkill] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
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
                const data = res.data;
                setFormData({
                    name: data.name || '',
                    university: data.university || '',
                    academicYear: data.academicYear || '',
                    major: data.major || '',
                    bio: data.bio || '',
                    github: data.github || '',
                    linkedin: data.linkedin || '',
                    portfolio: data.portfolio || '',
                    skills: data.skills || []
                });
            } catch (err) {
                setProfileError('Failed to load user profile.');
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (currentSkill.trim()) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Authentication required.');
            return;
        }

        try {
            await axios.put(`${backendUrl}/api/users/me`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/profile');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Failed to update profile.');
        }
    };

    if (loadingProfile) {
        return <div className="body"><Navbar /><div className="container"><h2>Loading Profile...</h2></div></div>;
    }

    if (profileError) {
        return <div className="body"><Navbar /><div className="container"><h2>Error</h2><p>{profileError}</p></div></div>;
    }

    return (
        <div className="body">
            <Navbar />
            <div className="container">
                <h2>Edit Your Profile</h2>

                <form onSubmit={handleSubmit}>
                    <div className="section">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                        <label>University</label>
                        <input type="text" name="university" value={formData.university} onChange={handleChange} required />

                        <label>Academic Year</label>
                        <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} required />

                        <label>Major</label>
                        <input type="text" name="major" value={formData.major} onChange={handleChange} />

                        <label>Bio</label>
                        <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange}></textarea>
                    </div>

                    <div className="section">
                        <h3>Social Links</h3>
                        <label>GitHub</label>
                        <input type="url" name="github" value={formData.github} onChange={handleChange} />

                        <label>LinkedIn</label>
                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />

                        <label>Portfolio</label>
                        <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} />
                    </div>

                    <div className="section">
                        <h3>Skills</h3>
                        <div className="input-with-button">
                            <input
                                type="text"
                                placeholder="Add a skill"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                            />
                            <button type="button" onClick={handleAddSkill} className="plus-btn">+</button>
                        </div>
                        <div className="skills-list">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <span onClick={() => handleRemoveSkill(skill)} className="remove-skill-btn">&times;</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="footer-buttons">
                        <button type="submit" className="publish">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
