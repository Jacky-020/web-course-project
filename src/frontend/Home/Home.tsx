import React, { useEffect, useState, useRef } from 'react';
import Canvas, { AnimationHandler } from './Canvas';
import styles from './Home.module.css';
import { motion, animate, AnimatePresence } from 'motion/react';
import { useTheme } from '../Theme/ThemeProviderHooks';
import AuthModal from '../Auth/Auth';
import { Tab, Nav, Modal } from 'react-bootstrap';

const Home: React.FC = () => {
    const theme = useTheme();
    const circle = useRef<SVGCircleElement>(null);
    const [handler, setHandler] = useState<AnimationHandler | null>(null);
    const [animComplete, setAnimComplete] = useState(false);
    const radius = (300 / 1150) * window.innerHeight;
    const percentage = -0.2;
    const height = window.innerHeight + radius;

    useEffect(() => {
        if (handler && circle.current) {
            handler?.start();
            animate(
                circle.current,
                {
                    cy: [
                        height,
                        window.innerHeight + radius * percentage,
                        window.innerHeight + radius * percentage,
                        window.innerHeight / 2,
                    ],
                    r: [
                        radius,
                        radius,
                        radius,
                        Math.sqrt(window.innerHeight ** 2 + window.innerHeight ** 2) + radius * 0.1,
                    ],
                },
                {
                    times: [0, 0.2, 0.45, 0.9],
                    duration: 4.5,
                    ease: 'easeOut',
                    delay: 1.5,
                },
            ).then(() => {
                setAnimComplete(true);
            });
        }
    }, [handler]);

    useEffect(() => {
        if (handler) {
            if (theme === 'light') handler.changeSegment(0);
            else handler.changeSegment(2);
        }
    }, [handler, theme]);

    return (
        <>
            <motion.div className="h-100 w-100 overflow-hidden position-relative">
                <Canvas done={setHandler} className={`h-100 w-100 object-fit-cover ${styles.banner}`} />
                <motion.div className={`${styles.vignette} position-absolute top-0 h-100 w-100`}></motion.div>
                <div
                    className={`position-absolute top-0 h-100 w-100`}
                    style={{
                        pointerEvents: 'none',
                    }}
                >
                    {handler != null && (
                        <motion.h1
                            initial={{ top: '50%' }}
                            animate={{ top: '70px' }}
                            transition={{
                                delay: 6,
                                duration: 0.7,
                                type: 'spring',
                                bounce: 0.25,
                            }}
                            style={{
                                transform: 'translateY(-50%)',
                            }}
                            className="w-100 text-center position-relative"
                        >
                            Hong Kong Destinations
                        </motion.h1>
                    )}
                </div>

                {handler != null && (
                    <Tab.Container defaultActiveKey="login">
                        <motion.div
                            className="modal modal-sheet d-block"
                            initial={{ opacity: 0, scale: 0.0, top: '50%' }}
                            animate={{ opacity: 1, scale: 1, top: '90px' }}
                            transition={{ delay: 6.5, duration: 0.7, type: 'spring', bounce: 0.25 }}
                            style={{
                                top: '90px',
                            }}
                        >
                            <Modal.Dialog>
                                <Modal.Header>
                                    <Nav variant="tabs" fill justify className="w-100 navbar-nav flex-row">
                                        <Nav.Item>
                                            <Nav.Link eventKey="login" draggable="false">
                                                Login
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="register" draggable="false">
                                                Register
                                            </Nav.Link>
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
                        </motion.div>
                    </Tab.Container>
                )}

                {!animComplete && (
                    <div
                        className={`position-absolute top-0 h-100 w-100 bg-body`}
                        style={{
                            mask: 'url(#curtain) center center / cover no-repeat',
                        }}
                    >
                        <div className={`position-absolute top-0 h-100 w-100`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                <defs>
                                    <mask
                                        id="curtain"
                                        maskUnits="objectBoundingBox"
                                        maskContentUnits="userSpaceOnUse"
                                        x="0"
                                        y="0"
                                        width="1"
                                        height="1"
                                    >
                                        <rect fill="white" x="0" y="0" width="100%" height="100%" />
                                        <circle ref={circle} fill="black" cx="50%" cy={height} r={radius} />
                                    </mask>
                                </defs>
                            </svg>
                        </div>
                        <div className={`d-flex align-items-center position-absolute top-0 h-100 w-100`}>
                            {handler != null && (
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-center w-100"
                                >
                                    The city that never sleeps
                                </motion.h1>
                            )}
                        </div>
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
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default Home;
