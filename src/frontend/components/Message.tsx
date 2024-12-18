import React from 'react';

const Message: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <h1>{message}</h1>
        </div>
    );
};

export default Message;
