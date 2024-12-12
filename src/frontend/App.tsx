import React, { ReactNode } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideNavbar from './components/SideNavbar.tsx';
import { Routes, Route } from 'react-router-dom';
import LocationTable from './components/LocationTable.tsx';
import Auth from './Auth/Auth.tsx';
import MapView from './components/MapView.tsx';
import AuthProvider from './Auth/AuthProvider.tsx';

import AuthGuard from './Auth/AuthGuard.tsx';

const routes = [
    {
        path: '/login',
        element: <Auth isLogin key="login" />,
        noAuth: true,
    },
    {
        path: '/register',
        element: <Auth key="register" />,
        noAuth: true,
    },
    {
        path: '/locationtable',
        element: <LocationTable />,
    },
    {
        path: '/MapView',
        element: <MapView />,
    },
    {
        path: '/role-test',
        roles: ['admin'],
        element: <h1>You have perms!</h1>,
    },
    {
        path: '/*',
        element: <h1>404 Not Found</h1>,
        noAuth: true,
    },
];

class App extends React.Component {
    render(): ReactNode {
        return (
            <>
                <div className="d-flex">
                    <div className="sidebar">
                        <SideNavbar />
                    </div>
                    <div className="main-content">
                        <AuthProvider>
                            <Routes>
                                {routes.map((route) => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={
                                            <AuthGuard noAuth={route.noAuth} roles={route.roles}>
                                                {route.element}
                                            </AuthGuard>
                                        }
                                    />
                                ))}
                            </Routes>
                        </AuthProvider>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
