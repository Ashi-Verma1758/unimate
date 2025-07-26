import React, { useState, useEffect } from 'react';
import { Home, UserSearch, Users, Info, HelpCircle, User, LogOut, Menu, MessageCircle } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    
  }, []); // Empty dependency array means it runs once after initial render

  // --- HANDLERS FOR NAVIGATION AND AUTH ---
  const handleLogin = () => {
    navigate('/login'); // Assuming you have a /login route
  };

  const handleSignup = () => {
    navigate('/signup'); // Assuming you have a /signup route
  };

  const handleLogout = () => {
    // Clear the tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); // If you store a refresh token

    // Update local state
    setIsLoggedIn(false);

    // Redirect to home or login page (e.g., /login or /)
    navigate('/', { state: { loggedOut: true } }); // Pass state to login page for messages if needed
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
             {/* Use Link component for site logo/name */}
            {/* Navigates to /HomePage if logged in, otherwise to / (landing page) */}
            <Link to={isLoggedIn ? '/HomePage' : '/'} className="navbar-logo">Unimate</Link>

            {/* <div className="navbar-logo">Unimate</div> */}

            {/* Links only if logged in */}
            {isLoggedIn && (
              <div className="navbar-links">
                {/* <a href="/HomePage"><Home size={20} /> <span>Home</span></a> */}
                <a href="/Find-Teammates"><UserSearch size={20} /> <span>Find Teammates</span></a>
                <a href="/chat"><MessageCircle size={20} /> <span>Chat</span></a>

                <a href="/Team"><Users size={20} /> <span>Teams</span></a>
                <a href="#"><Info size={20} /> <span>About Us</span></a>
                <a href="#"><HelpCircle size={20} /> <span>Help</span></a>
              </div>
            )}
          </div>

          <div className="navbar-right">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="icon-button"><User size={20} /></Link>
                <button
                  className="logout-button"
                  onClick={handleLogout} // Call the actual logout handler
                >
                  <span>Logout</span> <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-button"
                  onClick={handleLogin} // For demo, to login
                >
                  Log In
                </button>
               <button
                  className="signup-button"
                  onClick={handleSignup} // Call the actual signup handler
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Hamburger menu always visible on mobile */}
          <button className="menu-button" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar content */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          {isLoggedIn ? ( // Show these links if logged in
            <>
          <a href="#"><Home size={20} /> <span>Home</span></a>
          <a href="#"><Users size={20} /> <span>Teams</span></a>
          <a href="#"><Info size={20} /> <span>About Us</span></a>
          <a href="#"><HelpCircle size={20} /> <span>Help</span></a>
        </>
         ) : ( // Show these links if NOT logged in
            <>
              <Link to="/login" onClick={() => setIsSidebarOpen(false)}><LogOut size={20} /> <span>Login</span></Link>
              <Link to="/signup" onClick={() => setIsSidebarOpen(false)}><User size={20} /> <span>Sign Up</span></Link>
              {/* Add other public links you want in mobile sidebar */}
            </>
          )}
          {/* Links visible to everyone, regardless of login status */}
          <Link to="/about" onClick={() => setIsSidebarOpen(false)}><Info size={20} /> <span>About Us</span></Link>
          <Link to="/help" onClick={() => setIsSidebarOpen(false)}><HelpCircle size={20} /> <span>Help</span></Link>
        </div>

       {isLoggedIn && ( // Show bottom section only if logged in
          <div className="sidebar-bottom">
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)}><User size={20} /> <span>Profile</span></Link>
            <button onClick={handleLogout} className="sidebar-logout-button"> {/* Use a specific class for sidebar logout styling */}
              <LogOut size={20} /> <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
