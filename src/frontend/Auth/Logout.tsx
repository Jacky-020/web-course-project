import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/auth/logout', {
            method: 'POST',
        }, false)
            .then((res) => {
                if (res.ok)
                    navigate('/login', {
                        replace: true,
                        state: {
                            AuthState: 'success',
                            AuthMessage: 'Logged out!',
                        },
                    });
                else return res.json();
            })
            .then((data) => {
                if (!data) return;
                navigate('/login', {
                    replace: true,
                    state: {
                        AuthState: 'danger',
                        AuthMessage: data?.message ?? 'An error occurred!',
                    },
                });
            });

        // we only want to run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <h1>Logging out...</h1>;
};

export default Logout;
