import React from 'react';
import DataTable from 'react-data-table-component';

import { useQuery, useApolloClient, gql } from '@apollo/client';
import { useTheme } from '../Theme/ThemeProviderHooks';
import { Modal, Button } from 'react-bootstrap';
import { useAuthState } from '../Auth/AuthProviderHooks';
import AuthModal from '../Auth/Auth';

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

const CREATE_USER = gql`
    mutation createUser($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
            id
            username
            email
            roles
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser($updateUserInput: UpdateUserInput!) {
        updateUser(updateUserInput: $updateUserInput) {
            id
            username
            email
            roles
        }
    }
`;

const DELETE_USER = gql`
    mutation removeUser($id: String!) {
        removeUser(id: $id) {
            id
            username
            email
            roles
        }
    }
`;

interface UserManagementState {
    show: boolean;
    state: 'NONE' | 'DELETE' | 'EDIT' | 'CREATE';
    user?: ReqUser;
}

const Users: React.FC = () => {
    const [state, setState] = React.useState<UserManagementState>({ show: false, state: 'NONE' });
    const theme = useTheme();
    const { user } = useAuthState();
    const { loading, error, data, refetch } = useQuery(GET_USERS);
    const client = useApolloClient();
    const columns = [
        {
            name: 'ID',
            selector: (row: ReqUser) => row.id,
            sortable: true,
        },
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
            selector: (row: ReqUser) => row.roles.join(', '),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: ReqUser) => {
                if (row.id === user?.id) return <>You!</>;
                return (
                    <>
                        <div>
                            <Button
                                onClick={() => {
                                    setState({ show: true, state: 'EDIT', user: row });
                                }}
                                variant="primary m-1"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => {
                                    setState({ show: true, state: 'DELETE', user: row });
                                }}
                                variant="danger m-1"
                            >
                                Delete
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

    if (error) return <p>Error :(</p>;

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center h-100">
                <div className="container">
                    <DataTable
                        progressPending={loading}
                        title="Users"
                        columns={columns}
                        data={data?.users ?? []}
                        theme={theme === 'light' ? 'default' : 'dark'}
                    />
                </div>
            </div>
            <Modal
                show={state.show && state.state == 'DELETE'}
                onHide={() => setState({ show: false, state: 'NONE', user: undefined })}
            >
                <Modal.Header>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setState({ show: false, state: 'NONE', user: undefined })}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button variant="danger">Delete!</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={state.show && state.state == 'EDIT'}
                onHide={() => setState({ show: false, state: 'NONE', user: undefined })}
            >
                <Modal.Header>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <AuthModal
                    type="edit"
                    callback={async (data) => {
                        const updatedUser = {
                            id: state.user!.id,
                            ...data,
                            password: data.password ? data.password : undefined,
                        };

                        await client.mutate({
                            mutation: UPDATE_USER,
                            variables: { updateUserInput: updatedUser },
                        });

                        await refetch();

                        return { message: 'User updated!' };
                    }}
                    user={state.user!}
                    key="edit"
                    cancel={
                        <Button
                            onClick={() => setState({ show: false, state: 'NONE', user: undefined })}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    }
                />
            </Modal>
        </>
    );
};

export default Users;
