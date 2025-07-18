import React from 'react';
import { Home, Users, Info, HelpCircle, User, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">Unimate</div>
          <div className="navbar-links">
            <a href="#"><Home size={18} /> <span>Home</span></a>
            <a href="#"><Users size={18} /> <span>Teams</span></a>
            <a href="#"><Info size={18} /> <span>About Us</span></a>
            <a href="#"><HelpCircle size={18} /> <span>Help me</span></a>
          </div>
        </div>

        <div className="navbar-right">
          <button className="icon-button"><User size={20} /></button>
          <button className="logout-button"><span>Logout</span> <LogOut size={20} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
