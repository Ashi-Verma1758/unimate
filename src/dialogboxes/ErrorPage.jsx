import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/HomePage/Navbar';
import './SuccessPage.css'

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const error = location.state?.error || 'Something went wrong.';

    return (
        <div className="bodie">
            <Navbar />
            <div className="contair">
                <h2>❌<br/> Error</h2>
                <p>{error}
                <br/>You're not logged In</p>
                <div className='divgap'>
                <button onClick={() => navigate(-1)} className="sendi-btn">
                    Go Back
                </button>
                <button onClick={() => navigate('/')} className="sendi-btn">
                    Go to Home
                </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
