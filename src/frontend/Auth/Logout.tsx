import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUpdate } from './AuthProviderHooks';

const Logout: React.FC = () => {
    const navigate = useNavigate();
    const authUpdate = useAuthUpdate();

    useEffect(() => {
        authUpdate(true)
            .then(() =>
                navigate('/login', {
                    replace: true,
                    state: {
                        AuthState: 'success',
                        AuthMessage: 'Logged out!',
                    },
                }),
            )
            .catch(({ data }) =>
                navigate('/login', {
                    replace: true,
                    state: {
                        AuthState: 'danger',
                        AuthMessage: data?.message ?? 'An error occurred!',
                    },
                }),
            );

        // we only want to run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <h1>Logging out...</h1>;
};

export default Logout;
