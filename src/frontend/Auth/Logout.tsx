import React, { useEffect } from 'react';
import { useAuthUpdate } from './AuthProviderHooks';
import Message from '../components/Message';

const Logout: React.FC = () => {
    const authUpdate = useAuthUpdate();

    useEffect(() => {
        authUpdate(true);

        // we only want to run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Message message="Logging out..." />;
};

export default Logout;
