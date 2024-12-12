import React, { useContext } from 'react';

export interface AuthProviderState {
    user: ReqUser | null;
    loading: boolean;
    init: boolean;
}

export const AuthContext = React.createContext<AuthProviderState>({
    user: null,
    loading: false,
    init: false,
});

export const AuthUpdateContext = React.createContext(async (): Promise<ReqUser | null> => {
    return null;
});

// update user state
export const useAuthUpdate = () => {
    return useContext(AuthUpdateContext);
};

// get user and loading state
export const useAuth = () => {
    const state = useContext(AuthContext);
    return state;
};

// Secure fetching hook
export const useFetch = () => {
    const authUpdate = useAuthUpdate();
    return async (input: RequestInfo | URL, init?: RequestInit) => {
        const res = await fetch(input, init);
        if (res.status === 401) return authUpdate().then(() => res);
        return res;
    };
};
