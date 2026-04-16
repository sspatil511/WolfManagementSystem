import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '@/api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(!!localStorage.getItem('jwt'));

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      setUserLoading(false);
      return;
    }

    setUserLoading(true);
    getCurrentUser()
      .then((res) => setCurrentUser(res.data))
      .catch(() => {
        localStorage.removeItem('jwt');
        setToken(null);
        setCurrentUser(null);
      })
      .finally(() => setUserLoading(false));
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem('jwt', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout, isLoggedIn: !!token, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);