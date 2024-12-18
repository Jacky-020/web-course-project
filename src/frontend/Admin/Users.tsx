import React from 'react';
import DataTable from 'react-data-table-component';

import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
    query {
        users {
            id
            username
            email
            roles
        }
    }
`;

const Users = () => {
    const columns = [
        {
            name: 'Name',
            selector: (row: ReqUser) => row.username,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row: ReqUser) => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row: ReqUser) => row.roles.toString(),
            sortable: true,
        },
    ];
};

export default Users;
