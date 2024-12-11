import React, { ReactNode } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

interface RegisterModalProps {
    isLogin?: boolean;
}

class RegisterModal extends React.Component<RegisterModalProps> {
    state: { validated: boolean; showAlert: boolean; success: boolean; message: string };

    schema = yup.object().shape({
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

    constructor(props: RegisterModalProps) {
        super(props);
        this.state = {
            validated: false,
            showAlert: false,
            success: false,
            message: '',
        };
    }

    onSubmit = async (form: RegisterFormData) => {
        const endpoint = this.props.isLogin ? '/api/auth/login' : '/api/user/register';
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await res.json().catch(() => ({}));

        this.setState({
            showAlert: true,
            success: res.ok,
            message: data.message ?? (res.ok ? 'Success!' : 'An error occurred!'),
        });
    };

    render(): ReactNode {
        return (
            <>
                <div className="modal modal-sheet position-static d-block">
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>{this.props.isLogin ? 'Login' : 'Register'}</Modal.Title>
                        </Modal.Header>

                        <Formik
                            validationSchema={this.schema}
                            onSubmit={this.onSubmit}
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

                                            <Form.Group className="mb-3" controlId="email" hidden={this.props.isLogin}>
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
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
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
                                                    autoComplete="new-password"
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

                                        {this.state.showAlert && (
                                            <Alert
                                                variant={this.state.success ? 'success' : 'danger'}
                                                dismissible
                                                onClose={() => this.setState({ showAlert: false })}
                                                className="mt-3 w-100"
                                            >
                                                {this.state.message}
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
    }
}

export default RegisterModal;
