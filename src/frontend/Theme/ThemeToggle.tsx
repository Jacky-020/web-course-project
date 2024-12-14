import React from 'react';
import { useThemeToggle, useTheme } from './ThemeProviderHooks';

const ThemeToggle: React.FC = () => {
    const toggleTheme = useThemeToggle();
    const theme = useTheme();
    return <button onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'} Mode</button>;
};

export default ThemeToggle;
