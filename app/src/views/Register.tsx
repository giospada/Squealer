import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Container, Form, FormGroup, Spinner } from 'react-bootstrap';
import { AuthContext } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from 'src/api/fetch';
import { type AuthResponse } from '@model/auth';
import { apiCreate as createEndpoint } from 'src/api/routes';
import SidebarSearchLayout from '../layout/SidebarSearchLayout';

export default function Register(): JSX.Element {
    const [authState, setAuthState] = useContext(AuthContext);

    const [formName, setFormName] = useState('');
    const [formPassword, setFormPassword] = useState('');

    const [pendingRequest, setPendingRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (authState !== null) {
            navigate('/logout');
        }
    }, [authState]);

    const handleCreateUser = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setErrorMessage(null);
            setFormName('');
            setFormPassword('');

            if (!pendingRequest) {
                setPendingRequest(true);
                fetchApi<AuthResponse>(
                    createEndpoint,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            username: formName,
                            password: formPassword,
                        }),
                    },
                    authState,
                    (auth) => {
                        setAuthState(() => auth);
                        navigate('/');
                    },
                    (error) => {
                        setErrorMessage(() => error.message);
                        setPendingRequest(false);
                    },
                );
            }
        },
        [formName, formPassword],
    );

    return (
        <SidebarSearchLayout>
            <Container className="d-flex justify-content-center">
                <Form className="m-0 me-4 py-3 px-3 border" onSubmit={handleCreateUser}>
                    <FormGroup className="mb-3">
                        <Form.Label className="text-light">Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={formName}
                            onChange={(e) => {
                                setFormName(e.target.value);
                            }}
                            placeholder="Inserisci il tuo username"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Form.Label className="text-light">Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={formPassword}
                            onChange={(e) => {
                                setFormPassword(e.target.value);
                            }}
                            placeholder="Inserisci la tua password"
                        />
                    </FormGroup>
                    <Container className="d-flex justify-content-center">
                        <Button className="col-6 me-1" variant="outline-success" type="submit">
                            Registrati
                        </Button>
                        {errorMessage !== null && (
                            <>
                                <br />
                                <p className="text-danger">{errorMessage}</p>
                            </>
                        )}
                        {pendingRequest && (
                            <>
                                <br />
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </>
                        )}
                    </Container>
                </Form>
            </Container>
        </SidebarSearchLayout>
    );
}