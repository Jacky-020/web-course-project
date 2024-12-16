import React, { useContext } from 'react';

export const getPreferredTheme = (): 'dark' | 'light' => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || theme === 'light') {
        return theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeContext = React.createContext(getPreferredTheme());

export const ThemeToggleContext = React.createContext(() => {});

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const useThemeToggle = () => {
    return useContext(ThemeToggleContext);
};
