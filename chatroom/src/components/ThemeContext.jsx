import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage for saved preference, default to false (light mode)
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        // Update localStorage when theme changes
        localStorage.setItem('darkMode', darkMode);
        // Update document class for global styling
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}