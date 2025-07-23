import { useState } from 'react'

import React from 'react'
import './App.css';

// import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection/HeroSection'
// import { Sidebar } from 'lucide-react';
// import TeamCard from './components/teamInvite/TeamCard';
// import Sidebar from './components/ChatBox/Sidebar';
import ChatWindow from './components/ChatBox/ChatWindow'
import TeamMembers from './components/ChatBox/TeamMembers';
import Sidebar from './components/ChatBox/SideBar';
function App() {
  return (
    <>
    {/* <Navbar/> */}
    {/* <HeroSection/> */}
    {/* <TeamCard/> */}
    <div className="parent-container">
     <Sidebar/>
     <ChatWindow/>
      <TeamMembers/>
    </div>
    </>
  )
}

export default App;
