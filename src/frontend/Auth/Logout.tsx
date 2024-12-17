import React, { useEffect } from 'react';
import { useAuthUpdate } from './AuthProviderHooks';

const Logout: React.FC = () => {
    const authUpdate = useAuthUpdate();

    useEffect(() => {
        authUpdate(true);

        // we only want to run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <h1>Logging out...</h1>;
};

export default Logout;
