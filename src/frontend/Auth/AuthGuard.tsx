import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from './AuthProviderHooks';

interface AuthGuardProps {
    noAuth?: boolean;
    roles?: string[];
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
    const state = useAuthState();

    const navEl = (
        <Navigate
            to={{
                pathname: '/login',
                search: '?redirect=' + window.location.pathname,
            }}
            state={{ AuthError: 'You must be logged in!' }}
            replace
        />
    );

    if (props.noAuth) return props.children;
    if (state.loading || !state.init) return <>Loading</>;
    if (!state.user) return navEl;
    if (props.roles && !props.roles.every((role) => state.user?.roles.includes(role))) return <h1>Unauthorized</h1>;
    return props.children;
};

export default AuthGuard;
