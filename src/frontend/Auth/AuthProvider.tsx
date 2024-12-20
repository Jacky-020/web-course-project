import React, { useState, ReactNode, useEffect } from 'react';
import { AuthStateContext, AuthUpdateContext, AuthProviderState, AuthUpdateFunction } from './AuthProviderHooks';

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthProviderState>({ user: null, state: 'loading' });

    const legacyFetch = window.fetch;
    const fetch = async (input: RequestInfo | URL, init?: RequestInit, guarded = true) => {
        const res = await legacyFetch(input, init);
        if (res.status === 401 && guarded) return authUpdate().then(() => res);
        return res;
    };

    const authUpdate: AuthUpdateFunction = async (username?: string | true, password?: string, email?: string) => {
        setState(() => ({ user: null, state: 'loading' }));
        let res: Response;
        let user: ReqUser | null = null;
        let state: AuthProviderState['state'];
        if (username === true) {
            res = await fetch('/api/auth/logout', { method: 'POST' }, false);
            user = await res.json().catch(() => null);
            state = 'logout';
        } else if (username && password) {
            const endpoint = email ? '/api/user/register' : '/api/auth/login';
            res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });
            user = await res.json().catch(() => null);
            state = email ? 'register' : 'login';
        } else {
            res = await fetch('/api/auth/user');
            user = await res.json().catch(() => null);
            state = 'session';
        }
        if (username === true) setState(() => ({ user: null, state }));
        else setState(() => ({ user, state }));

        if (!res.ok) return Promise.reject({ res, data: user });

        return user;
    };

    useEffect(() => {
        window.fetch = fetch;
        authUpdate();
        return () => {
            window.fetch = legacyFetch;
        };

        // we only want to run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <AuthStateContext.Provider value={state}>
                <AuthUpdateContext.Provider value={authUpdate}>{children}</AuthUpdateContext.Provider>
            </AuthStateContext.Provider>
        </>
    );
};
export default AuthProvider;
