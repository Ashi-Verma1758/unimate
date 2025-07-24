import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // To store full user object

  useEffect(() => {
    // Attempt to load user and token from localStorage on component mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userObject = JSON.parse(storedUser);
        setToken(storedToken);
        setCurrentUser(userObject);
        setCurrentUserId(userObject._id); // Assuming user object has an _id field
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        // Clear invalid data if parsing fails
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Function to update auth state after login/registration
  const login = (userData, userToken) => {
    localStorage.setItem('authToken', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setCurrentUser(userData);
    setCurrentUserId(userData._id);
  };

  // Function to clear auth state on logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ currentUserId, token, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
