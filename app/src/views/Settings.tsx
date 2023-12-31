import { Accordion, Container, Stack } from 'react-bootstrap';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts';
import SidebarSearchLayout from 'src/layout/SidebarSearchLayout';
import ChangeName from 'src/components/settings/ChangeName';
import ChangePassword from 'src/components/settings/ChangePassword';
import ChangeRole from 'src/components/settings/ChangeRole';
import DeleteAccount from 'src/components/settings/Delete';
import EnableReset from 'src/components/settings/EnableReset';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from 'src/api/fetch';
import { stringFormat } from 'src/utils';
import { UserRoles, type IUser } from '@model/user';
import { apiUser } from 'src/api/routes';
import ChangeSMM from 'src/components/settings/ChangeSMM';
import ChangeProfilePicture from 'src/components/settings/ChangeProfilePicture';

export default function Settings(): JSX.Element {
    const [authState] = useContext(AuthContext);
    const navigator = useNavigate();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        if (authState === null) {
            navigator('/login');
            return <></>;
        }
    }, []);

    useEffect(() => {
        if (authState === null) return;

        fetchApi<IUser>(
            stringFormat(apiUser, [authState.username]),
            {
                method: 'GET',
            },
            authState,
            (u) => {
                setUser(u);
            },
            (_) => {},
        );
    }, [authState]);

    return (
        <SidebarSearchLayout>
            <Container className="d-flex justify-content-center">
                {authState !== null && (
                    <Stack className="d-flex rounded  p-2">
                        <Accordion>
                            {user !== null && (
                                <Accordion.Item eventKey="6">
                                    <Accordion.Header>Change Profile Picture</Accordion.Header>
                                    <Accordion.Body>
                                        <ChangeProfilePicture user={user} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Change Name</Accordion.Header>
                                <Accordion.Body>
                                    <ChangeName />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Change Password</Accordion.Header>
                                <Accordion.Body>
                                    <ChangePassword />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>Reset Password</Accordion.Header>
                                <Accordion.Body>
                                    <EnableReset />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Change Roles</Accordion.Header>
                                <Accordion.Body>
                                    <ChangeRole />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Delete Account</Accordion.Header>
                                <Accordion.Body>
                                    <DeleteAccount />
                                </Accordion.Body>
                            </Accordion.Item>
                            {user !== null && user.role === UserRoles.VIP && (
                                <Accordion.Item eventKey="5">
                                    <Accordion.Header>Set Your SMM</Accordion.Header>
                                    <Accordion.Body>
                                        <ChangeSMM user={user} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}
                        </Accordion>
                    </Stack>
                )}
            </Container>
        </SidebarSearchLayout>
    );
}
