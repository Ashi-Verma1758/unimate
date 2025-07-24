import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';


// Import components
import HeroSection from './components/HeroSection/HeroSection';
import CreateAccount from './components/CreateAcc';

import HomePage from './components/HomePage/HomePage';
import Login from './Log-In';
import ChatWindow from './components/ChatBox/ChatWindow.jsx';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';


function App() {
  // State to manage the currently selected conversation in the chat window
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  // currentUserId will be managed by AuthContext, but passed to ChatWindow directly
  // for clarity in props, though ChatWindow can also useContext(AuthContext) directly.

  return (

    <>
    {/* <Navbar/> */}
    {/* <HeroSection/> */}
    {/* <TeamCard/> */}
    {/* <ProjectCard /> */}
    {/* <StatsCard /> */}
    {/* <HomePage /> */}
    {/* <CreateAcc /> */}
    <ProjectInfo />
    </>
  )

    <AuthProvider> {/* Wrap your entire app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />

          {/* HomePage might need currentUserId if it fetches user-specific data */}
          <Route path="/homepage" element={<HomePage />} />

          {/* Pass selectedConversationId and its setter to ChatWindow */}
          <Route 
            path="/chat" 
            element={
              <ChatWindow 
                selectedConversationId={selectedConversationId} 
                setSelectedConversationId={setSelectedConversationId}
              />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App;
