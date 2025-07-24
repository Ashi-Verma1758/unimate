import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './components/HomePage/HomePage';
import Login from './Log-In';
import ChatWindow from './components/ChatBox/ChatWindow.jsx';
import CreatePost from './components/createpost.jsx';
// Import AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx'
import CreateAccount from './components/CreateAcc.jsx'
import ProjectInfo from './components/ProjectInfo/ProjectInfo.jsx'
function App() {
  // State to manage the currently selected conversation in the chat window
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  // currentUserId will be managed by AuthContext, but passed to ChatWindow directly
  // for clarity in props, though ChatWindow can also useContext(AuthContext) directly.

  return (

    <AuthProvider> {/* Wrap your entire app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/fullpost" element={<ProjectInfo/>}/>
          

          {/* HomePage might need currentUserId if it fetches user-specific data */}
          <Route
          path="/homepage"
          element={<HomePage setSelectedConversationId={setSelectedConversationId} />}
        />

          {/* Pass selectedConversationId and its setter to ChatWindow */}
          <Route
          path="/chat"
          element={<ChatWindow selectedConversationId={selectedConversationId} />} // Pass to ChatWindow
        />
       
        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App;
