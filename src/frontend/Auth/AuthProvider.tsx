import React, { useState, ReactNode, useEffect } from 'react';
import { AuthStateContext, AuthUpdateContext, AuthProviderState, AuthUpdateFunction } from './AuthProviderHooks';

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthProviderState>({ user: null, loading: false, init: false });

    const authUpdate: AuthUpdateFunction = async (username?: string, password?: string, email?: string) => {
        setState((state) => ({ ...state, user: null, loading: true }));
        let res: Response;
        let user: ReqUser | null = null;
        if (username && password) {
            const endpoint = email ? '/api/user/register' : '/api/auth/login';
            res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });
            user = await res.json().catch(() => null);
        } else {
            res = await fetch('/api/auth/user');
            user = await res.json().catch(() => null);
        }
        setState(() => ({ user, loading: false, init: true }));

        if (!res.ok) return Promise.reject({ res, data: user });

        return user;
    };

    useEffect(() => {
        authUpdate();
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
