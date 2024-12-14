import React, { useContext } from 'react';

export const getPreferredTheme = () => {
    return (
        localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
};

export const ThemeContext = React.createContext(getPreferredTheme());

export const ThemeToggleContext = React.createContext(() => {});

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const useThemeToggle = () => {
    return useContext(ThemeToggleContext);
};
