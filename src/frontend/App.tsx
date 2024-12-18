import React, { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';

import VenueDetail from './components/VenueDetail.tsx';
import AuthGuard, { AuthGuardProps } from './Auth/AuthGuard.tsx';
import GeneralSearch from './components/GeneralSearch.tsx';
import Logout from './Auth/Logout.tsx';
import FavouriteVenue from './components/FavouriteVenue.tsx';
// import MapComponent from './components/test.jsx';
import Dev from './Dev/Dev.tsx';
import Home from './Home/Home.jsx';
import EventTable from './components/EventTable.tsx';
import Users from './Admin/Users.tsx';
import GlobalNavbar from './components/Navbar.tsx';

export interface RouteConfig extends AuthGuardProps {
    devName?: string;
    path: string;
}

const routeConfigs: RouteConfig[] = [
    {
        path: 'logout',
        children: <Logout />,
        noRedirect: true,
    },
    {
        path: 'general-search',
        children: <GeneralSearch />,
        noAuth: true,
    },
    {
        path: 'VenueDetail',
        children: <VenueDetail />,
        noAuth: true,
    },
    {
        path: 'favourite-venue',
        children: <FavouriteVenue />,
        noAuth: true,
    },
    {
        path: 'event-page',
        children: <EventTable />,
        noAuth: true,
    },
    {
        devName: '404 Not Found',
        path: '*',
        children: <h1>404 Not Found</h1>,
        noAuth: true,
    },
    {
        devName: 'Admin User Management',
        path: 'admin/users',
        roles: ['admin'],
        children: <Users />,
    },
];

const devRouteConfigs: RouteConfig[] = [
    {
        devName: 'Role Test',
        path: 'role-test',
        roles: ['admin'],
        children: <h1>You have perms!</h1>,
    },
    {
        devName: 'Home',
        path: '',
        children: <Home />,
    },
];

class App extends React.Component {
    render(): ReactNode {
        const routes = routeConfigs.map((config) => (
            <Route
                key={config.path}
                path={config.path}
                element={
                    <AuthGuard noAuth={config.noAuth} roles={config.roles} noRedirect={config.noRedirect}>
                        {config.children}
                    </AuthGuard>
                }
            />
        ));
        return (
            <>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/" element={<GlobalNavbar />}>
                        {routes}
                    </Route>

                    <Route path="dev" element={<Dev configs={routeConfigs.concat(devRouteConfigs)} />}>
                        {routes}
                        {devRouteConfigs.map((config) => (
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
                    </Route>
                </Routes>
            </>
        );
    }
}

export default App;
