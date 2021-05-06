import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import TuiCalendar from '../../components/TuiCalendar'
import { useHistory } from 'react-router'
import Select from 'react-select'

export default function NewEvent() {
    const [event, setEvent] = useState<any>({})
    const [presets, setPresets] = useState<any>(null)
    const [showCreationModal, setShowCreationModal] = useState(false)

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchPresets(), [])

    const fetchPresets = () => {
        axiosInstance
            .get('/api/events/presets/')
            .then(res => setPresets(res.data))
    }

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

    const handleTextChange = (e) => {
        let modifiedEvent = { ...event }
        modifiedEvent[e.target.name] = e.target.value
        setEvent(modifiedEvent)
    }

    const handleDateChange = (e) => {
        let modifiedEvent = { ...event }
        modifiedEvent[e.target.name] = e.target.value
        setEvent(modifiedEvent)
    }

    const handleSwitchChange = (e) => {
        let modifiedEvent = { ...event }
        modifiedEvent[e.target.name] = !modifiedEvent[e.target.name]
        setEvent(modifiedEvent)
    }

    const handlePresetChange = (option) => {
        let modifiedEvent = { ...event }
        modifiedEvent['preset'] = option?.value
        setEvent(modifiedEvent)
    }

    const handleCreateSchedule = (e) => {
        setShowCreationModal(true)
        setEvent({
            start: e.start.toDate().toISOString().slice(0, -1),
            end: e.end.toDate().toISOString().slice(0, -1),
        })
        e.guide.clearGuideElement()
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
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Host</Form.Label>
                                        <Form.Control required type="text" name="host" onChange={handleTextChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Position Preset</Form.Label>
                                        <Select
                                            isClearable
                                            options={presets?.map(preset => ({ value: preset.id, label: preset.name}))}
                                            onChange={handlePresetChange}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group>
                                    <Form.Label>Banner URL</Form.Label>
                                    <Form.Control type="url" name="banner" onChange={handleTextChange}/>
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="start" value={event.start} onChange={handleDateChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>End (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="end" value={event.end} onChange={handleDateChange}/>
                                    </Form.Group>
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
