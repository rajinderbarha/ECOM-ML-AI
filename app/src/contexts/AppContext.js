import React, { useContext, createContext, ReactNode, useState } from 'react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <AppContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, loggedIn, setLoggedIn, searchQuery, setSearchQuery}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if(!context){
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}