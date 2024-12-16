import React, { useContext, createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [session, status]);

  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, loggedIn, setLoggedIn, searchQuery, setSearchQuery }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
