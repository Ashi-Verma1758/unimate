import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import React from 'react'
import './App.css';
// import Login from './Log-In';
// import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection/HeroSection'
import CreateAccount from './components/CreateAcc';
// import TeamCard from './components/teamInvite/TeamCard';
// import CreateAccount from './components/CreateAcc';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection/>} />
        <Route path="/signup" element={<CreateAccount />} />
      </Routes>
    </Router>
    
  )
}

export default App;
