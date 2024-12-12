import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext, AuthUpdateContext, AuthProviderState } from './AuthProviderHooks';

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthProviderState>({ user: null, loading: false, init: false });

    const updateAuth = async () => {
        setState((state) => ({ ...state, user: null, loading: true }));
        const user: ReqUser | null = await fetch('/api/auth/user')
            .then((res) => res.json())
            .catch(() => null);
        setState(() => ({ user, loading: false, init: true }));

        return user;
    };

    useEffect(() => {
        updateAuth();
    }, []);

    return (
        <>
            <AuthContext.Provider value={state}>
                <AuthUpdateContext.Provider value={updateAuth}>{children}</AuthUpdateContext.Provider>
            </AuthContext.Provider>
        </>
    );
};
export default AuthProvider;
