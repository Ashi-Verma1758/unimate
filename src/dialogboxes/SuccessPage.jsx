import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/HomePage/Navbar';
import './SuccessPage.css'
const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message || 'Project created successfully!';

    return (
        <div className="bodie">
            <Navbar />
            <div className="contair">
                <h2>✅ <br/>Success</h2>
                <p>{message}</p>
                <button onClick={() => navigate('/HomePage')} className="sendi-btn">
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
