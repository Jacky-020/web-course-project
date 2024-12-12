import React, { ReactNode } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideNavbar from './components/SideNavbar.tsx';
import { Routes, Route } from 'react-router-dom';
import LocationTable from './components/LocationTable.tsx';
import RegisterModal from './Register/Register.tsx';
import MapView from './components/MapView.tsx';
import VenueDetail from './components/VenueDetail.tsx';

const routes = [
    {
        path: '/login',
        element: <RegisterModal isLogin key="login" />,
    },
    {
        path: '/register',
        element: <RegisterModal key="register" />,
    },
    {
        path: '/locationtable',
        element: <LocationTable />,
    },
    {
        path: "/MapView",
        element: <MapView/>
    },
    {
        path: "/VenueDetail",
        element: <VenueDetail />
    },
    {
        path: '/*',
        element: <h1>404 Not Found</h1>,
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
                            {routes.map((route) => (
                                <Route key={route.path} path={route.path} element={route.element} />
                            ))}
                        </Routes>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
