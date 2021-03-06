import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import axiosInstance from '../helpers/axiosInstance'
import { getCID, getFullName } from '../helpers/auth'
import { useSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import { useHistory } from 'react-router'
import { AiOutlineCheckCircle } from 'react-icons/all'

export default function Feedback() {
    const [controllerOptions, setControllerOptions] = useState([])
    const [eventOptions, setEventOptions] = useState([])
    const [feedbackForm, setFeedbackForm] = useState<any>({ rating: 1 })
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        fetchControllers()
        fetchEvents()
    }, [])

    const fetchControllers = () => {
        axiosInstance
            .get('/api/users/simplified/')
            .then(res => {
                setControllerOptions(
                    res.data.home.concat(res.data.visiting).concat(res.data.mavp).map(controller => ({
                        value: controller.cid,
                        label: controller.first_name + ' ' + controller.last_name + ' - ' + controller.cid,
                    }))
                )
            })
    }

    const fetchEvents = () => {
        axiosInstance
            .get('/api/events/archived/')
            .then(res => {
                setEventOptions(
                    res.data.slice(0, 5).map(event => ({
                        value: event.id,
                        label: event.name,
                    }))
                )
            })
    }

    const handleControllerChange = (selected) => {
        let updatedForm = { ...feedbackForm }
        updatedForm['controller'] = selected.value
        setFeedbackForm(updatedForm)
    }

    const handleEventChange = (selected) => {
        let updatedForm = { ...feedbackForm }
        updatedForm['event'] = selected.value
        setFeedbackForm(updatedForm)
    }

    const handleTextChange = (event) => {
        let updatedForm = { ...feedbackForm }
        updatedForm[event.target.name] = event.target.value
        setFeedbackForm(updatedForm)
    }

    const handleRatingChange = (rating) => {
        let updatedForm = { ...feedbackForm }
        updatedForm['rating'] = rating
        setFeedbackForm(updatedForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/feedback/', feedbackForm)
            .then(res => {
                enqueueSnackbar('Successfully submitted feedback', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowSuccessModal(true)
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

    return (
        <>
            <Header title="Submit Feedback"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Controller's Name</Form.Label>
                                        <Select
                                            defaultValue={{value: null, label: <b>General ARTCC Feedback</b>}}
                                            options={[{value: null, label: <b>General ARTCC Feedback</b>}].concat(controllerOptions)}
                                            onChange={handleControllerChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Controller Callsign</Form.Label>
                                        <Form.Control type="text" name="controller_callsign" onChange={handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event</Form.Label>
                                        <Select
                                            options={eventOptions}
                                            onChange={handleEventChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Your Callsign</Form.Label>
                                        <Form.Control type="text" name="pilot_callsign" onChange={handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Your Name</Form.Label>
                                        <Form.Control required type="text" value={getFullName()} disabled/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Your CID</Form.Label>
                                        <Form.Control required type="text" value={getCID()} disabled/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                            <Col md={7}>
                                <Form.Group>
                                    <Form.Label>Rating</Form.Label>
                                    <StarRating onChange={handleRatingChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Comments</Form.Label>
                                    <Form.Control required as="textarea" rows={5} name="comments" value={feedbackForm.comments} onChange={handleTextChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="mb-3" variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </Fade>
            <Modal backdrop="static" show={showSuccessModal} centered>
                <Modal.Body className="text-center">
                    <AiOutlineCheckCircle className="fill-green mb-3" size={80}/>
                    <h5 className="mb-4">Your feedback has been successfully submitted! You will be redirected to the homepage.</h5>
                    <Button variant="primary" onClick={() => history.push('/')}>
                        Hooray!
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}
