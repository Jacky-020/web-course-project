import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
    const getPreferredTheme = () => {
        const preferredTheme = localStorage.getItem('theme');
        if (preferredTheme) {
            return preferredTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState(getPreferredTheme);

    useEffect(() => {
        document.documentElement.dataset.bsTheme = theme;

        // run only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.dataset.bsTheme = newTheme;
    };

    return <button onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'} Mode</button>;
};

export default ThemeToggle;
