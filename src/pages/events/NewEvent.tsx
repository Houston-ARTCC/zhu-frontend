import { useState } from 'react'
import { Button, Col, Container, Form, Modal } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import TuiCalendar from '../../components/TuiCalendar'
import { useHistory } from 'react-router'

export default function NewEvent() {
    const [event, setEvent] = useState<any>({})
    const [showCreationModal, setShowCreationModal] = useState(false)

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    const handleSubmitEvent = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/events/', event)
            .then(res => {
                enqueueSnackbar('Event successfully created!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowCreationModal(false)
                history.push('/events/' + res.data.id)
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

    const handleTextChange = (event) => {
        let newEvent = { ...event }
        newEvent[event.target.name] = event.target.value
        setEvent(newEvent)
    }

    const handleDateChange = (event) => {
        let newEvent = { ...event }
        newEvent[event.target.name] = event.target.value
        setEvent(newEvent)
    }

    const handleSwitchChange = (event) => {
        let newEvent = { ...event }
        newEvent[event.target.name] = !newEvent[event.target.name]
        setEvent(newEvent)
    }

    const handleCreateSchedule = (event) => {
        setShowCreationModal(true)
        setEvent({
            start: event.start.toDate().toISOString().slice(0, -1),
            end: event.end.toDate().toISOString().slice(0, -1),
        })
        event.guide.clearGuideElement()
    }

    return (
        <div>
            <Header title="New Event"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <TuiCalendar view="week" onCreateSchedule={handleCreateSchedule}/>
                    <Modal
                        size="lg"
                        show={showCreationModal}
                        onHide={() => setShowCreationModal(false)}
                        keyboard={false}
                        backdrop="static"
                        centered
                    >
                        <Form onSubmit={handleSubmitEvent}>
                            <Modal.Header closeButton>
                                <Modal.Title>Create New Event</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required type="text" name="name" onChange={handleTextChange}/>
                                </Form.Group>
                                <Form.Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Event Host</Form.Label>
                                            <Form.Control required type="text" name="host" onChange={handleTextChange}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Banner URL</Form.Label>
                                            <Form.Control type="url" name="banner" onChange={handleTextChange}/>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Start (Zulu)</Form.Label>
                                            <Form.Control required type="datetime-local" name="start" value={event.start} onChange={handleDateChange}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>End (Zulu)</Form.Label>
                                            <Form.Control required type="datetime-local" name="end" value={event.end} onChange={handleDateChange}/>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={4} name="description" onChange={handleTextChange}/>
                                </Form.Group>
                                <Form.Switch id="hidden" name="hidden" label="Hide event from controllers." onChange={handleSwitchChange}/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="lightgray" onClick={() => setShowCreationModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </Container>
            </Fade>
        </div>
    )
}
