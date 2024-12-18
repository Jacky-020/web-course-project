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
    type: 'login' | 'register' | 'update' | 'create' | 'delete';

    callback?: (data: AuthFormData) => Promise<{ message?: string } | void>;
    user?: { username: string; email: string };
    cancel?: React.ReactNode;
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
        state: props.type == 'login' ? (location.state?.AuthState ?? 'HIDE') : 'HIDE',
        message: props.type == 'login' ? (location.state?.AuthMessage ?? '') : '',
    });

    const schema = yup.object().shape({
        username: yup
            .string()
            .required()
            .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
        email: yup.string().email().required(),
        password: yup.string().required(),
    });
    const schemas = {
        register: schema,
        create: schema,
        login: schema.omit(['email']),
        update: schema.shape({ password: yup.string() }),
        delete: yup.object().shape({}),
    };

    const onSubmit = async (form: AuthFormData) => {
        setAlert({ state: 'HIDE', message: '' });

        if (props.callback)
            await props
                .callback(form)
                .then((data) => setAlert({ state: 'success', message: data?.message ?? 'Success!' }))
                .catch((data) => {
                    setAlert({
                        state: 'danger',
                        message: data?.message ?? 'An error occurred!',
                    });
                });
        else
            authUpdate(form.username, form.password, props.type == 'login' ? undefined : form.email)
                .then(() => {
                    setAlert({ state: 'success', message: 'Success!' });
                    setTimeout(() => {
                        const redirect = new URLSearchParams(location.search).get('redirect');
                        if (redirect) navigate(redirect);
                        else navigate('/general-search');
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
            <Formik
                validationSchema={schemas[props.type]}
                onSubmit={onSubmit}
                initialValues={{
                    username: props.user?.username ?? '',
                    email: props.user?.email ?? '',
                    password: '',
                }}
            >
                {({ handleSubmit, handleChange, touched, errors, isSubmitting, values }) => (
                    <>
                        {props.type !== 'delete' && (
                            <Modal.Body>
                                <Form id={'form-' + props.type} noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId={'username-' + props.type}>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            required
                                            name="username"
                                            onChange={handleChange}
                                            isValid={touched.username && !errors.username}
                                            isInvalid={touched.password && !!errors.username}
                                            autoComplete="username"
                                            value={values.username}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-3"
                                        hidden={props.type === 'login'}
                                        controlId={'email-' + props.type}
                                    >
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            required
                                            name="email"
                                            onChange={handleChange}
                                            isValid={touched.email && !errors.email}
                                            isInvalid={touched.password && !!errors.email}
                                            autoComplete="email"
                                            value={values.email}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId={'password-' + props.type}>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            required
                                            name="password"
                                            onChange={handleChange}
                                            isValid={touched.password && !errors.password}
                                            isInvalid={touched.password && !!errors.password}
                                            value={values.password}
                                            autoComplete={props.type == 'login' ? 'current-password' : 'new-password'}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                        )}
                        {props.type === 'delete' && (
                            <Form id={'form-' + props.type} noValidate onSubmit={handleSubmit}></Form>
                        )}
                        <Modal.Footer>
                            {props.cancel}
                            <Button
                                variant={
                                    ['primary', 'primary', 'primary', 'success', 'danger'][
                                        ['login', 'register', 'update', 'create', 'delete'].indexOf(props.type)
                                    ]
                                }
                                type="submit"
                                form={'form-' + props.type}
                                disabled={isSubmitting}
                                className="d-flex justify-content-center align-items-center"
                            >
                                <span className={`text-capitalize ${isSubmitting ? 'invisible' : ''}`}>
                                    {props.type}
                                </span>
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
        </>
    );
};

export default AuthModal;
