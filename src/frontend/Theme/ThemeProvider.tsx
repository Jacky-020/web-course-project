import React, { ReactNode, useState, useEffect } from 'react';
import { ThemeToggleContext, ThemeContext, getPreferredTheme } from './ThemeProviderHooks';

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState(getPreferredTheme);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.dataset.bsTheme = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeToggleContext.Provider value={toggleTheme}>{children}</ThemeToggleContext.Provider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
