import React, { useEffect, useState, useRef } from 'react';
import Canvas, { AnimationHandler } from './Canvas';
import styles from './Home.module.css';
import { motion, animate, AnimatePresence } from 'motion/react';
import { useTheme } from '../Theme/ThemeProviderHooks';
import AuthModal from '../Auth/Auth';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { Modal } from 'react-bootstrap';

const Home: React.FC = () => {
    const theme = useTheme();
    const circle = useRef<SVGCircleElement>(null);
    const [handler, setHandler] = useState<AnimationHandler | null>(null);
    const radius = 200;
    const percentage = -0.2;
    const height = 1280 + radius;

    useEffect(() => {
        if (handler && circle.current) {
            animate(
                circle.current,
                {
                    cy: [height, 720 + radius * percentage, 720 + radius * percentage, 0],
                    r: [radius, radius, radius, 1500],
                },
                {
                    times: [0, 0.25, 0.4, 0.9],
                    duration: 4,
                    ease: 'easeOut',
                    delay: 1.5,
                },
            );
        }
    }, [handler]);

    useEffect(() => {
        if (handler) {
            if (theme === 'light') handler.changeSegment(0);
            else handler.changeSegment(2);
        }
    }, [handler, theme]);

    useEffect(() => {
        handler?.start();

        return () => {
            handler?.reset();
        };
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
                            style={{
                                fill: 'var(--bs-body-bg)',
                            }}
                            x="0"
                            y="0"
                            width="1280"
                            height="720"
                            mask="url(#screen)"
                        />

                        {handler != null && (
                            <motion.text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominant-baseline="middle"
                                style={{
                                    fill: 'var(--bs-body-color)',
                                    fontSize: '3rem',
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{
                                    delay: 1,
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="text-center w-100 position-absolute"
                                mask="url(#screen)"
                            >
                                The city that never sleeps
                            </motion.text>
                        )}
                    </motion.svg>
                </motion.div>

                <motion.div className={`d-flex align-items-center position-absolute top-0 h-100 w-100`}>
                    <AnimatePresence>
                        {handler == null && (
                            <motion.h1
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="text-center w-100"
                            >
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="spinner-border"
                                        role="status"
                                        style={{
                                            width: '4rem',
                                            height: '4rem',
                                        }}
                                    >
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div className={`fluid-container position-absolute top-0 h-100 w-100`}>
                    <div>
                        <Tab.Container defaultActiveKey="login">
                            <div className="modal modal-sheet position-static d-block">
                                <Modal.Dialog>
                                    <Modal.Header>
                                        <Nav variant="tabs" fill justify className="w-100">
                                            <Nav.Item>
                                                <Nav.Link eventKey="login">Login</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="register">Register</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Modal.Header>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="login">
                                            <AuthModal isLogin />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="register">
                                            <AuthModal />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Modal.Dialog>
                            </div>
                        </Tab.Container>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Home;
