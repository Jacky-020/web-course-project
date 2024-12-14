import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Dev.module.css';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeToggle from '../Theme/ThemeToggle';
import { RouteConfig } from '../App';

const Dev: React.FC<{ configs: RouteConfig[] }> = ({ configs }) => {
    return (
        <>
            <div className="d-flex">
                <Navbar className={`${styles.sidebar} bg-secondary-subtle`}>
                    <Nav className="flex-column">
                        {configs.map((config) => (
                            <NavItem key={config.path}>
                                <Link className="nav-link" to={config.path}>
                                    {config.devName ?? config.path}
                                </Link>
                            </NavItem>
                        ))}

                        <ThemeToggle />
                    </Nav>
                </Navbar>
                <div className={styles.mainContent}>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Dev;
