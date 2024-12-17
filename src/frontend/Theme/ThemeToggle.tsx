import React, { ComponentProps } from 'react';
import { useThemeToggle, useTheme } from './ThemeProviderHooks';
import { Sun, Moon, Icon } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
    const toggleTheme = useThemeToggle();
    const theme = useTheme();

    const iconProps: ComponentProps<Icon> = {
        size: 20 * scale,
    };
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={toggleTheme}
            style={{
                width: `${80 * scale}px`,
                height: `${32 * scale}px`,
                borderRadius: `${20 * scale}px`,
            }}
            className={`d-flex justify-content-center align-items-center btn btn-outline-${theme === 'light' ? 'dark' : 'light'}`}
        >
            {theme === 'light' ? <Moon {...iconProps} /> : <Sun {...iconProps} />}
        </motion.button>
    );
};

export default ThemeToggle;
