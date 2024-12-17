import React, { useContext } from 'react';

export interface AuthProviderState {
    user: ReqUser | null;
    state: 'loading' | 'register' | 'login' | 'logout' | 'session';
}

export const AuthStateContext = React.createContext<AuthProviderState>({
    user: null,
    state: 'loading',
});

export type AuthUpdateFunction = {
    (): Promise<ReqUser | null>;
    (username: string, password: string, email?: string): Promise<ReqUser | null>;
    (logout: true): Promise<ReqUser | null>;
};

export const AuthUpdateContext = React.createContext<AuthUpdateFunction>(async () => {
    return null;
});

// update user state
export const useAuthUpdate = () => {
    return useContext(AuthUpdateContext);
};

// get user and loading state
export const useAuthState = () => {
    const state = useContext(AuthStateContext);
    return state;
};
