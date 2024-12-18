import React, { ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './AuthProviderHooks';
import Message from '../components/Message';

export interface AuthGuardProps {
    noAuth?: boolean;
    devNoAuth?: boolean;
    noRedirect?: boolean;
    roles?: string[];
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
    const authState = useAuthState();
    const navigate = useNavigate();
    const logoutSeen = useRef(false);

    useEffect(() => {
        if (authState.state !== 'logout') logoutSeen.current = false;
        if (props.noAuth || authState.state === 'loading' || authState.user) return;
        const isDevPath = window.location.pathname.startsWith('/dev');
        if (isDevPath && props.devNoAuth) return;
        const firstLogout = !logoutSeen.current && authState.state === 'logout';
        const LoginPath = isDevPath ? '/dev' : '/';
        navigate(
            {
                pathname: LoginPath,
                search: props.noRedirect ? '' : '?redirect=' + window.location.pathname,
            },
            {
                state: {
                    AuthState: firstLogout ? 'success' : 'danger',
                    AuthMessage: firstLogout ? 'Logged out!' : 'You must be logged in to view that page',
                },
                replace: true,
            },
        );
        if (firstLogout) logoutSeen.current = true;
    }, [navigate, props.noAuth, authState.state, authState.user, props.noRedirect, props.devNoAuth]);

    const isDevPath = window.location.pathname.startsWith('/dev');
    if (props.noAuth) return props.children;
    if (isDevPath && props.devNoAuth) return props.children;
    if (authState.state === 'loading') return <Message message="" />;
    if (!authState.user) return null;
    if (props.roles && !props.roles.every((role) => authState.user?.roles.includes(role)))
        return <Message message="Unauthorized!" />;
    return props.children;
};

export default AuthGuard;
