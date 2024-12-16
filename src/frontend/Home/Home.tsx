import React, { useEffect, useState, useRef } from 'react';
import Canvas, { AnimationHandler } from './Canvas';
import styles from './Home.module.css';
import { motion, animate } from 'motion/react';
import { useTheme } from '../Theme/ThemeProviderHooks';

const Home: React.FC = () => {
    const theme = useTheme();
    const circle = useRef<SVGCircleElement>(null);
    const [handler, setHandler] = useState<AnimationHandler | null>(null);
    const radius = 500;
    const percentage = 0.5;
    const height = 1280 + radius;

    useEffect(() => {
        if (handler && circle.current) {
            if (theme == 'light') handler.changeSegment(0);
            else handler.changeSegment(2);
            handler.start();
            animate(
                circle.current,
                {
                    cy: [height, 720 + radius * percentage, 720 + radius * percentage, 0],
                    r: [radius, radius, radius, 1500],
                },
                {
                    times: [0, 0.3, 0.4, 1],
                    duration: 5,
                    ease: 'easeOut',
                },
            );

            return () => {
                handler.pause();
            };
        }
    }, [handler]);

    useEffect(() => {
        if (handler) {
            if (theme === 'light') handler.changeSegment(0);
            else handler.changeSegment(2);
        }
    }, [handler, theme]);

    useEffect(() => {
        if (handler) handler.start();
    });

    return (
        <>
            <motion.div className="h-100 w-100 overflow-hidden position-relative">
                <Canvas done={setHandler} className={`h-100 w-100 object-fit-cover ${styles.banner}`} />
                <motion.div className={`${styles.vignette} position-absolute top-0 h-100 w-100`}></motion.div>
                <motion.div className={`position-absolute top-0 h-100 w-100`}>
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1280 720"
                        className={`object-fit-cover h-100 w-100`}
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            <motion.mask id="screen">
                                <motion.rect fill="white" x="0" y="0" width="1280" height="720" />
                                <motion.circle ref={circle} fill="black" cx="640" cy={height} r={radius} />
                            </motion.mask>
                        </defs>
                        <motion.rect
                            className={styles.curtain}
                            x="0"
                            y="0"
                            width="1280"
                            height="720"
                            mask="url(#screen)"
                        />
                    </motion.svg>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Home;
