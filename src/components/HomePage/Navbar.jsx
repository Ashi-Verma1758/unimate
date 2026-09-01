import React, { useState, useEffect } from 'react';
import { Home, UserSearch, Users, Info, HelpCircle, User, LogOut, Menu, MessageCircle, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(Boolean(token));
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/', { state: { loggedOut: true } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const currentPath = location.pathname.toLowerCase();
  const isHomeActive = currentPath === '/homepage' || currentPath === '/';
  const isFindTeammatesActive = currentPath.includes('find-teammates');
  const isChatActive = currentPath.includes('/chat');
  const isTeamActive = currentPath.includes('/team');

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="navbar-brand-wrap">
              <Link to={isLoggedIn ? '/homepage' : '/'} className="navbar-logo">Unimate</Link>
            </div>

            {isLoggedIn && (
              <div className="navbar-links">
                <Link to="/Find-Teammates" className={isFindTeammatesActive ? 'active' : ''}><UserSearch size={20} /> <span>Find Teammates</span></Link>
                <Link to="/chat" className={isChatActive ? 'active' : ''}><MessageCircle size={20} /> <span>Chat</span></Link>
                <Link to="/Team" className={isTeamActive ? 'active' : ''}><Users size={20} /> <span>Teams</span></Link>

                <form className="navbar-search" onSubmit={handleSearch}>
                  <Search size={16} className="search-icon" />
                  <input
                    className="navbar-search-input"
                    type="text"
                    aria-label="Search"
                    placeholder="Search students, skills, projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
              </div>
            )}
          </div>

          <div className="navbar-right">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="icon-button"><User size={20} /></Link>
                <button className="logout-button" onClick={handleLogout}>
                  <span>Logout</span> <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button className="login-button" onClick={handleLogin}>Log In</button>
                <button className="signup-button" onClick={handleSignup}>Sign Up</button>
              </>
            )}
          </div>

          <button className="menu-button" type="button" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          {isLoggedIn ? (
            <>
              <Link to="/homepage" onClick={() => setIsSidebarOpen(false)}><Home size={20} /> <span>Home</span></Link>
              <Link to="/Find-Teammates" onClick={() => setIsSidebarOpen(false)}><UserSearch size={20} /> <span>Find Teammates</span></Link>
              <Link to="/chat" onClick={() => setIsSidebarOpen(false)}><MessageCircle size={20} /> <span>Chat</span></Link>
              <Link to="/Team" onClick={() => setIsSidebarOpen(false)}><Users size={20} /> <span>Teams</span></Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsSidebarOpen(false)}><LogOut size={20} /> <span>Login</span></Link>
              <Link to="/signup" onClick={() => setIsSidebarOpen(false)}><User size={20} /> <span>Sign Up</span></Link>
            </>
          )}

          <Link to="/about" onClick={() => setIsSidebarOpen(false)}><Info size={20} /> <span>About Us</span></Link>
          <Link to="/help" onClick={() => setIsSidebarOpen(false)}><HelpCircle size={20} /> <span>Help</span></Link>
        </div>

        {isLoggedIn && (
          <div className="sidebar-bottom">
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)}><User size={20} /> <span>Profile</span></Link>
            <button type="button" onClick={handleLogout} className="sidebar-logout-button">
              <LogOut size={20} /> <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
