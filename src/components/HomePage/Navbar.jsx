import React, { useState } from 'react';
import {
  Home,
  Users,
  Info,
  HelpCircle,
  User,
  LogOut,
  Menu,
  MessageCircle,
} from 'lucide-react';
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

            {/* Links only if logged in */}
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

          <div className="navbar-right">
            {isLoggedIn ? (
              <>
                <button className="icon-button"><User size={20} /></button>
                <button
                  className="logout-button"
                  onClick={() => setIsLoggedIn(false)}
                >
                  <span>Logout</span> <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-button"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Log In
                </button>
                <button className="signup-button">Sign Up</button>
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
          {isLoggedIn ? (
            <>
              <a href="#"><Home size={20} /> <span>Home</span></a>
              <a href="#"><Users size={20} /> <span>Teams</span></a>
              <a href="#"><MessageCircle size={20} /> <span>Chat</span></a>
              <a href="#"><Info size={20} /> <span>About Us</span></a>
              <a href="#"><HelpCircle size={20} /> <span>Help</span></a>
            </>
          ) : (
            <>
              <div className="sidebar-logo">Unimate</div>
              <button
                className="login-button"
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsSidebarOpen(false);
                }}
              >
                Log In
              </button>
              <button className="signup-button">Sign Up</button>
            </>
          )}
        </div>

        {isLoggedIn && (
          <div className="sidebar-bottom">
            <a href="#"><User size={20} /> <span>Profile</span></a>
            <a
              href="#"
              onClick={() => {
                setIsLoggedIn(false);
                setIsSidebarOpen(false);
              }}
            >
              <LogOut size={20} /> <span>Logout</span>
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
