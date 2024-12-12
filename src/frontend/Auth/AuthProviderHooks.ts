import React, { useContext } from 'react';

export interface AuthProviderState {
    user: ReqUser | null;
    loading: boolean;
    init: boolean;
}

export const AuthStateContext = React.createContext<AuthProviderState>({
    user: null,
    loading: false,
    init: false,
});

export type AuthUpdateFunction = {
    (): Promise<ReqUser | null>;
    (username: string, password: string, email?: string): Promise<ReqUser | null>;
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

export const useAuth = () => {};

// Secure fetching hook
export const useFetch = () => {
    const authUpdate = useAuthUpdate();
    return async (input: RequestInfo | URL, init?: RequestInit) => {
        const res = await fetch(input, init);
        if (res.status === 401) return authUpdate().then(() => res);
        return res;
    };
};
