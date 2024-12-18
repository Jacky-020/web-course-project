import React, { ComponentProps } from 'react';
import { useThemeToggle, useTheme } from './ThemeProviderHooks';
import { Sun, Moon, Icon } from 'react-bootstrap-icons';
import { AnimatePresence, motion } from 'framer-motion';

const ThemeToggle: React.FC<{ scale?: number; parentReady?: boolean; className?: string }> = ({
    scale = 1,
    parentReady = true,
    className,
}) => {
    const toggleTheme = useThemeToggle();
    const theme = useTheme();
    const [ready, setReady] = React.useState(true);

    const iconProps: ComponentProps<Icon> = {
        size: 20 * scale,
        style: { display: 'block' },
    };
    const toggleHandler = () => {
        toggleTheme();
        if (parentReady && ready) setReady(false);
    };
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={toggleHandler}
            style={{
                width: `${80 * scale}px`,
                height: `${32 * scale}px`,
                borderRadius: `${20 * scale}px`,
                borderWidth: `${4 * scale}px`,
                overflow: 'hidden',
            }}
            className={`d-flex justify-content-center align-items-center p-0 btn btn-outline-${theme === 'light' ? 'dark' : 'light'} ${className}`}
        >
            <AnimatePresence>
                {parentReady && ready && (
                    <motion.div
                        initial={{ y: 32 * scale }}
                        animate={{ y: 0 }}
                        exit={{ y: 32 * scale }}
                        onAnimationComplete={() => setReady(true)}
                        className="d-inline"
                    >
                        {theme === 'light' ? <Moon {...iconProps} /> : <Sun {...iconProps} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;
