import React, { ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './AuthProviderHooks';

interface AuthGuardProps {
    noAuth?: boolean;
    roles?: string[];
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
    const authState = useAuthState();
    const navigate = useNavigate();
    const logoutSeen = useRef(false);

    console.log(props, authState, logoutSeen.current);
    useEffect(() => {
        if (authState.state !== 'logout') logoutSeen.current = false;
        if (props.noAuth || authState.state === 'loading' || authState.user) return;
        const firstLogout = !logoutSeen.current && authState.state === 'logout';
        navigate(
            {
                pathname: '/login',
                search: '?redirect=' + window.location.pathname,
            },
            {
                state: {
                    AuthState: firstLogout ? 'success' : 'danger',
                    AuthMessage: firstLogout ? 'Logged out!' : 'You must be logged in to view this page',
                },
                replace: true,
            },
        );
        if (firstLogout) logoutSeen.current = true;
    }, [navigate, props.noAuth, authState.state, authState.user]);

    if (props.noAuth) return props.children;
    if (authState.state === 'loading') return <>Loading</>;
    if (!authState.user) return null;
    if (props.roles && !props.roles.every((role) => authState.user?.roles.includes(role))) return <h1>Unauthorized</h1>;
    return props.children;
};

export default AuthGuard;
