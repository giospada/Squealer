import { Alert, Button, Container, Form, FormGroup, Modal, Spinner } from 'react-bootstrap';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quotaPriceDay, quotaPriceMonth, quotaPriceWeek } from '@model/quota';
import { apiQuota } from 'src/api/routes';
import { AuthContext } from 'src/contexts';
import { fetchApi } from 'src/api/fetch';

interface PurchaseQuotaProps {
    show: boolean;
    onHide: () => void;
}

export default function PurchaseQuota({ show, onHide }: PurchaseQuotaProps): JSX.Element {
    const [authState] = useContext(AuthContext);

    const [dailyQuota, setDailyQuota] = useState<number>(0);
    const [weeklyQuota, setWeeklyQuota] = useState<number>(0);
    const [monthlyQuota, setMonthlyQuota] = useState<number>(0);
    const [price, setPrice] = useState('0');

    const [pendingRequest, setPendingRequest] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        let sPrice: number = 0;
        sPrice += dailyQuota * quotaPriceDay;
        sPrice += weeklyQuota * quotaPriceWeek;
        sPrice += monthlyQuota * quotaPriceMonth;
        setPrice(sPrice.toFixed(2));
    }, [dailyQuota, weeklyQuota, monthlyQuota]);

    const handlePurchaseQuota = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setErrorMessage(null);
            setDailyQuota(0);
            setWeeklyQuota(0);
            setMonthlyQuota(0);

            if (!pendingRequest) {
                if (authState == null) return;
                setPendingRequest(true);
                fetchApi<null>(
                    apiQuota,
                    {
                        method: 'PUT',
                        body: JSON.stringify({
                            dailyQuote: dailyQuota,
                            weeklyQuote: weeklyQuota,
                            monthlyQuote: monthlyQuota,
                        }),
                    },
                    authState,
                    () => {
                        setSuccessMessage('Quota purchased successfully!');
                        setInterval(() => {
                            navigate(0);
                        }, 1000);
                    },
                    (error) => {
                        setErrorMessage(() => error.message);
                        setPendingRequest(false);
                    },
                );
            }
        },
        [dailyQuota, weeklyQuota, monthlyQuota],
    );

    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Purchase Quota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {successMessage !== null ? (
                    <>
                        <Alert variant="success">{successMessage}</Alert>
                    </>
                ) : (
                    <>
                        <Form className="m-0 p-3 border rounded-3" onSubmit={handlePurchaseQuota}>
                            <FormGroup className="group-add-post">
                                <Form.Label className="label-add-post col-6 d-flex flex-row justify-content-center">
                                    Daily Quota
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={dailyQuota}
                                    min={0}
                                    onChange={(e) => {
                                        setDailyQuota(parseInt(e.target.value));
                                    }}
                                    placeholder="0"
                                />
                            </FormGroup>
                            <FormGroup className="group-add-post">
                                <Form.Label className="label-add-post col-6 d-flex flex-row justify-content-center">
                                    Weekly Quota
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={weeklyQuota}
                                    min={0}
                                    onChange={(e) => {
                                        setWeeklyQuota(parseInt(e.target.value));
                                    }}
                                    placeholder="0"
                                />
                            </FormGroup>
                            <FormGroup className="group-add-post">
                                <Form.Label className="label-add-post col-6 d-flex flex-row justify-content-center">
                                    Monthly Quota
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={monthlyQuota}
                                    min={0}
                                    onChange={(e) => {
                                        setMonthlyQuota(parseInt(e.target.value));
                                    }}
                                    placeholder="0"
                                />
                            </FormGroup>
                            <p className="col-6 w-100 d-flex flex-row justify-content-center">
                                {' '}
                                Total Price: {price} &euro;{' '}
                            </p>
                            <Container className="d-flex justify-content-center">
                                <Button className="col-6" variant="warning" type="submit">
                                    Purchase
                                </Button>
                            </Container>
                            <Container className="d-flex justify-content-center">
                                {errorMessage !== null && <Alert variant="danger">{errorMessage}</Alert>}
                                {pendingRequest && (
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                )}
                            </Container>
                        </Form>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}
