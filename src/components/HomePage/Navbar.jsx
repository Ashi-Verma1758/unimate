import React, { useState } from 'react';
import { Home, Users, Info, HelpCircle, User, LogOut, Menu, MessageCircle } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="navbar-logo">Unimate</div>

            {isLoggedIn && (
              <div className="navbar-links">
                <a href="#"><Home size={20} /> <span>Home</span></a>
                <a href="#"><Users size={20} /> <span>Teams</span></a>
                <a href="#"><MessageCircle size={20} /> <span>Chat</span></a>
                <a href="#"><Info size={20} /> <span>About Us</span></a>
                <a href="#"><HelpCircle size={20} /> <span>Help</span></a>
              </div>
            )}
          </div>

          {/* Desktop buttons (hidden on mobile) */}
          <div className="navbar-right">
            {isLoggedIn ? (
              <>
                <button className="icon-button"><User size={20} /></button>
                <button
                  className="logout-button"
                  onClick={() => setIsLoggedIn(false)} // For demo, to logout
                >
                  <span>Logout</span> <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-button"
                  onClick={() => setIsLoggedIn(true)} // For demo, to login
                >
                  Log In
                </button>
                <button className="signup-button">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Hamburger menu (only visible on mobile) */}
          <button className="menu-button" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Sidebar for small screens */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <a href="#"><Home size={20} /> <span>Home</span></a>
          <a href="#"><Users size={20} /> <span>Teams</span></a>
          <a href="#"><Info size={20} /> <span>About Us</span></a>
          <a href="#"><HelpCircle size={20} /> <span>Help</span></a>
        </div>

        <div className="sidebar-bottom">
          <a href="#"><User size={20} /> <span>Profile</span></a>
          <a href="#"><LogOut size={20} /> <span>Logout</span></a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
