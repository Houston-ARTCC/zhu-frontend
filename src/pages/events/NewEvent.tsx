import React, { Component } from 'react'
import { Button, Col, Container, Form, Modal } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import TuiCalendar from '../../components/TuiCalendar'

class NewEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            showCreationModal: false,
            event: {},
        }
        this.handleSubmitEvent = this.handleSubmitEvent.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleCreateSchedule = this.handleCreateSchedule.bind(this)
    }

    handleSubmitEvent(e) {
        e.preventDefault()
        axiosInstance
            .post('/api/events/', this.state.event)
            .then(res => {
                this.props.enqueueSnackbar('Event successfully created!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                this.setState({showCreationModal: false})
                this.props.history.push('/events/' + res.data.id)
            })
            .catch(err => {
                this.props.enqueueSnackbar(err.toString(), {
                    variant: 'error',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
            })
    }

    handleTextChange(event) {
        let newEvent = { ...this.state.event }
        newEvent[event.target.name] = event.target.value
        this.setState({ event: newEvent })
    }

    handleDateChange(event) {
        let newEvent = { ...this.state.event }
        newEvent[event.target.name] = event.target.value
        this.setState({ event: newEvent })
    }

    handleSwitchChange(event) {
        let newEvent = { ...this.state.event }
        newEvent[event.target.name] = !newEvent[event.target.name]
        this.setState({ event: newEvent })
    }

    handleCreateSchedule(event) {
        this.setState({
            showCreationModal: true,
            event: {
                start: event.start.toDate().toISOString().slice(0, -1),
                end: event.end.toDate().toISOString().slice(0, -1),
            },
        })
        event.guide.clearGuideElement()
    }

    render() {
        return (
            <div>
                <Header title="New Event"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <TuiCalendar view="week" onCreateSchedule={this.handleCreateSchedule}/>
                        <Modal
                            size="lg"
                            show={this.state.showCreationModal}
                            onHide={() => this.setState({showCreationModal: false})}
                            keyboard={false}
                            backdrop="static"
                            centered
                        >
                            <Form onSubmit={this.handleSubmitEvent}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Create New Event</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control required type="text" name="name" onChange={this.handleTextChange}/>
                                    </Form.Group>
                                    <Form.Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Event Host</Form.Label>
                                                <Form.Control required type="text" name="host" onChange={this.handleTextChange}/>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Banner URL</Form.Label>
                                                <Form.Control type="url" name="banner" onChange={this.handleTextChange}/>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    <Form.Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Start (Zulu)</Form.Label>
                                                <Form.Control required type="datetime-local" name="start" value={this.state.event.start} onChange={this.handleDateChange}/>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>End (Zulu)</Form.Label>
                                                <Form.Control required type="datetime-local" name="end" value={this.state.event.end} onChange={this.handleDateChange}/>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={4} name="description" onChange={this.handleTextChange}/>
                                    </Form.Group>
                                    <Form.Switch id="hidden" name="hidden" label="Hide event from controllers." onChange={this.handleSwitchChange}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="lightgray" onClick={() => this.setState({showCreationModal: false})}>
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
}

export default withSnackbar(NewEvent)
