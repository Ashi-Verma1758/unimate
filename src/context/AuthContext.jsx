import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userObject = JSON.parse(storedUser);
        setToken(storedToken);
        setCurrentUser(userObject);
        setCurrentUserId(userObject._id || userObject.id);
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem('accessToken', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setCurrentUser(userData);
    setCurrentUserId(userData._id || userData.id);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
