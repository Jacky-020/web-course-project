import React, { ReactNode, ComponentProps } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideNavbar from './components/SideNavbar.tsx';
import { Routes, Route } from 'react-router-dom';
// import LocationTable from './components/LocationTable.tsx';
import Auth from './Auth/Auth.tsx';
// import MapView from './components/MapView.tsx';

import VenueDetail from './components/VenueDetail.tsx';
import AuthGuard from './Auth/AuthGuard.tsx';
import GeneralSearch from './components/GeneralSearch.tsx';
import Logout from './Auth/Logout.tsx';
import FavouriteVenue from './components/FavouriteVenue.tsx';

interface RouteConfig extends ComponentProps<typeof AuthGuard> {
    path: string;
}

const routeConfigs: RouteConfig[] = [
    {
        path: 'login',
        children: <Auth isLogin key="login" />,
        noAuth: true,
    },
    {
        path: 'logout',
        children: <Logout />,
        noRedirect: true,
    },
    {
        path: 'register',
        children: <Auth key="register" />,
        noAuth: true,
    },
    // {
    //     path: '/locationtable',
    //     element: <LocationTable />,
    // },
    // {
    //     path: '/MapView',
    //     element: <MapView />,
    // },
    {
        path: 'general-search',
        children: <GeneralSearch />,
    },
    {
        path: 'role-test',
        roles: ['admin'],
        children: <h1>You have perms!</h1>,
    },
    {
        path: 'VenueDetail',
        children: <VenueDetail />,
    },
    {
        path: 'favourite-venue',
        children: <FavouriteVenue />,
    },
    {
        path: '*',
        children: <h1>404 Not Found</h1>,
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
                        <Routes>
                            {routeConfigs.map((config) => (
                                <Route
                                    key={config.path}
                                    path={config.path}
                                    element={
                                        <AuthGuard
                                            noAuth={config.noAuth}
                                            roles={config.roles}
                                            noRedirect={config.noRedirect}
                                        >
                                            {config.children}
                                        </AuthGuard>
                                    }
                                />
                            ))}
                        </Routes>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
