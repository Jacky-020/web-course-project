import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuthUpdate } from './AuthProviderHooks';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthFormData {
    username: string;
    email: string;
    password: string;
}

interface AuthModalProps {
    isLogin?: boolean;
}

interface AlertState {
    state: 'success' | 'danger' | 'HIDE';
    message: string;
}

const AuthModal: React.FC<AuthModalProps> = (props) => {
    const authUpdate = useAuthUpdate();
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState<AlertState>({
        state: location.state?.AuthState ?? 'HIDE',
        message: location.state?.AuthMessage ?? '',
    });

    const schema = yup.object().shape({
        username: yup
            .string()
            .required()
            .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
        email: yup.string().when('isLogin', {
            is: false,
            then: (schema) => schema.email().required(),
        }),
        password: yup.string().required(),
    });

    const onSubmit = async (form: AuthFormData) => {
        setAlert({ state: 'HIDE', message: '' });
        authUpdate(form.username, form.password, props.isLogin ? undefined : form.email)
            .then(() => {
                setAlert({ state: 'success', message: 'Success!' });
                setTimeout(() => {
                    const redirect = new URLSearchParams(location.search).get('redirect');
                    navigate(redirect ?? '/');
                }, 1000);
            })
            .catch(({ data }) => {
                setAlert({
                    state: 'danger',
                    message: data?.message ?? 'An error occurred!',
                });
            });
    };

    return (
        <>
            <div className="modal modal-sheet position-static d-block">
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>{props.isLogin ? 'Login' : 'Register'}</Modal.Title>
                    </Modal.Header>

                    <Formik
                        validationSchema={schema}
                        onSubmit={onSubmit}
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                        }}
                    >
                        {({ handleSubmit, handleChange, touched, errors, isSubmitting }) => (
                            <>
                                <Modal.Body>
                                    <Form noValidate id="login-form" onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter username"
                                                required
                                                onChange={handleChange}
                                                isValid={touched.username && !errors.username}
                                                isInvalid={touched.password && !!errors.username}
                                                autoComplete="username"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="email" hidden={props.isLogin}>
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                required
                                                onChange={handleChange}
                                                isValid={touched.email && !errors.email}
                                                isInvalid={touched.password && !!errors.email}
                                                autoComplete="email"
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            <Form.Text className="text-muted">
                                                We'll never share your email with anyone else.
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                required
                                                onChange={handleChange}
                                                isValid={touched.password && !errors.password}
                                                isInvalid={touched.password && !!errors.password}
                                                autoComplete={props.isLogin ? 'current-password' : 'new-password'}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        form="login-form"
                                        disabled={isSubmitting}
                                        className="d-flex justify-content-center align-items-center"
                                    >
                                        <span className={isSubmitting ? 'invisible' : ''}>Submit</span>
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className={`position-absolute spinner-border spinner-border-sm ${isSubmitting ? '' : 'visually-hidden'}`}
                                        />
                                    </Button>

                                    {alert.state !== 'HIDE' && (
                                        <Alert
                                            variant={alert.state}
                                            dismissible
                                            onClose={() => setAlert({ state: 'HIDE', message: '' })}
                                            className="mt-3 w-100"
                                        >
                                            {alert.message}
                                        </Alert>
                                    )}
                                </Modal.Footer>
                            </>
                        )}
                    </Formik>
                </Modal.Dialog>
            </div>
        </>
    );
};

export default AuthModal;
