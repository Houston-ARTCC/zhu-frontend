import React, { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'
import { useSnackbar } from 'notistack'
import { Button, Col, Form, Row } from 'react-bootstrap'
import BounceLoader from '../../../components/BounceLoader'

type Times = {
    start: string | null;
    end: string | null;
}

export default function Availability() {
    const [availability, setAvailability] = useState<Times[]>();

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        axiosInstance
            .get('/api/training/modifyavailability/')
            .then(res => {
                console.log(res.data);
                setAvailability(res.data)
            })
    }, []);

    const updateAvailability = () => {
        axiosInstance
            .patch('/api/training/modifyavailability/', availability)
            .then(() => {
                enqueueSnackbar('Successfully updated availability', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
            })
            .catch(err => {
                enqueueSnackbar(err.toString(), {
                    variant: 'error',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
            })
    }

    if (!availability) {
        return <BounceLoader />
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => {
                const enabled = availability[i].start && availability[i].end

                return (
                    <Row key={i} className="mb-3 align-items-center">
                        <Col md={2}>
                            <div className="d-flex align-items-center">
                                <Form.Switch
                                    id={day}
                                    name={day}
                                    className="mr-2"
                                    checked={!!availability[i].start}
                                    onChange={(event) => {
                                        const newAvailability = [...availability]
                                        if (event.target.checked) {
                                            newAvailability[i].start = '00:00'
                                            newAvailability[i].end = '00:00'
                                        } else {
                                            newAvailability[i].start = null
                                            newAvailability[i].end = null
                                        }
                                        setAvailability(newAvailability)
                                    }}
                                />
                                <p className="mb-0">{day}</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    required
                                    disabled={!enabled}
                                    type="time"
                                    name="start"
                                    value={enabled ? availability[i].start! : '00:00'}
                                    onChange={(event) => {
                                        const newAvailability = [...availability]
                                        newAvailability[i].start = event.target.value
                                        setAvailability(newAvailability)
                                    }}
                                />
                                <span className="mx-2">&mdash;</span>
                                <Form.Control
                                    required
                                    disabled={!enabled}
                                    type="time"
                                    name="end"
                                    value={enabled ? availability[i].end! : '00:00'}
                                    onChange={(event) => {
                                        const newAvailability = [...availability]
                                        newAvailability[i].end = event.target.value
                                        setAvailability(newAvailability)
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                )
            })}
            <p>
                <i><b>Note:</b> All times shown in UTC</i>
            </p>
            <Button onClick={updateAvailability}>Save</Button>
        </Fade>
    )
}
