import React, { Component } from 'react'
import { Button, Col, Container, Dropdown, Form, Modal, ProgressBar, Row } from 'react-bootstrap'
import { EventDropdownMenu, EventDropdownToggle } from '../components/EventDropdowns'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import { withSnackbar } from 'notistack'

class EditEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {},
            showManualAssignModal: false,
            manualAssignPosition: {},
            controllers: [],
        }
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id)
            .then(res => this.setState({ event: res.data }))
    }

    fetchControllers() {
        axiosInstance
            .get('/api/users/simplified')
            .then(res => this.setState({ controllers: res.data }))
    }

    handleTextChange(event) {
        let newEvent = { ...this.state.event }
        newEvent[event.target.name] = event.target.value;
        this.setState({ event: newEvent })
    }

    handleDateChange(event) {
        let newEvent = { ...this.state.event }
        newEvent[event.target.name] = event.target.value + 'Z'
        this.setState({ event: newEvent })
    }

    handleSwitchChange(event) {
        let newEvent = { ...this.state.event }
        newEvent[event.target.name] = !newEvent[event.target.name]
        this.setState({ event: newEvent })
    }

    handleSubmit(e) {
        e.preventDefault();
        axiosInstance
            .put('/api/events/' + this.props.match.params.id + '/', this.state.event)
            .then(res => {
                this.props.enqueueSnackbar('Changes to event details saved!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
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

    getEnroutePositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'CTR' || level === 'FSS'
        })
    }

    getTRACONPositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'APP' || level === 'DEP'
        })
    }

    getLocalPositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'DEL' || level === 'GND' || level === 'TWR'
        })
    }

    renderShift(shift, position) {
        const handleClick = (eventKey) => {
            if (eventKey === 'unassign') handleUnassign()
            else if (eventKey === 'delete') handleDelete()
            else if (eventKey === 'manual') handleManualAssign()
            else handleAssign(eventKey)
        }

        const handleAssign = (requestId) => {
            let request = shift.requests.find(req => req.id == requestId)
            axiosInstance
                .patch('/api/events/shift/' + shift.id + '/', { user: request.user.cid })
                .then(res => {
                    this.props.enqueueSnackbar('Assigned ' + request.user.first_name + ' ' + request.user.last_name + ' to ' + position.callsign, {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                    this.fetchEvent()
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

        const handleUnassign = () => {
            axiosInstance
                .patch('/api/events/shift/' + shift.id + '/', { user: null })
                .then(res => {
                    this.props.enqueueSnackbar('Vacated ' + position.callsign, {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                    this.fetchEvent()
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

        const handleManualAssign = () => {
            this.fetchControllers()
            this.setState({
                manualAssignPosition: position,
                showManualAssignModal: true
            })
        }

        const handleDelete = () => {
            axiosInstance
                .delete('/api/events/shift/' + shift.id)
                .then(res => this.fetchEvent())
        }

        return (
            <ProgressBar
                variant={
                    shift.user
                        ? 'green'
                        : 'transparent'
                }
                now={100 / position.shifts.length}
                label={
                    <Dropdown className="position-absolute" onSelect={handleClick}>
                        <Dropdown.Toggle as={EventDropdownToggle} id="dropdown-custom-components">
                            <span className={shift.user ? 'text-white' : 'text-black'}>
                                {shift.user ? shift.user.first_name + ' ' + shift.user.last_name : 'Unassigned'}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu as={EventDropdownMenu}>
                            {shift.requests.map(request => (
                                <Dropdown.Item key={request.id} eventKey={request.id.toString()}>
                                    {request.user.first_name + ' ' + request.user.last_name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                }
            />
        )
    }

    renderPosition(position) {
        return (
            <li className="mb-3">
                <p className="mb-2">{position.callsign}</p>
                <div>
                    <ProgressBar>
                        {position.shifts.length > 0
                            ? position.shifts.map(shift => this.renderShift(shift, position))
                            : <ProgressBar
                                variant={'white'}
                                now={100}
                                label={<i className="text-black">No shifts have been posted.</i>}
                            />
                        }
                    </ProgressBar>
                </div>
            </li>
        )
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header
                    title={this.state.event.name}
                    subtitle="Editing Event"
                />
                <Container fluid>
                    <div className="mb-3">
                        <Link to={'/events/' + this.props.match.params.id}>Return to Event</Link>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control required type="text" name="name" value={this.state.event.name} onChange={this.handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Host</Form.Label>
                                        <Form.Control required type="text" name="host" value={this.state.event.host} onChange={this.handleTextChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Banner URL</Form.Label>
                                        <Form.Control required type="text" name="banner" value={this.state.event.banner} onChange={this.handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start</Form.Label>
                                        <Form.Control required type="datetime-local" name="start" value={this.state.event.start?.slice(0, -1)} onChange={this.handleDateChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>End</Form.Label>
                                        <Form.Control required type="datetime-local" name="end" value={this.state.event.end?.slice(0, -1)} onChange={this.handleDateChange}/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                            <Col md={7}>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={6} name="description" value={this.state.event.description} onChange={this.handleTextChange}/>
                                </Form.Group>
                                <Form.Switch className="mb-3" id="hidden" name="hidden" label="Event hidden from controllers." checked={this.state.event.hidden} onChange={this.handleSwitchChange}/>
                            </Col>
                        </Row>
                        <Button className="mb-3" variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                    <Row>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Enroute Positions</h3>
                            <ul className="p-0 list-unstyled">
                                {this.getEnroutePositions()?.length > 0
                                    ? this.getEnroutePositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">TRACON Positions</h3>
                            <ul className="p-0 list-unstyled">
                                {this.getTRACONPositions()?.length > 0
                                    ? this.getTRACONPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Local Positions</h3>
                            <ul className="p-0 list-unstyled">
                                {this.getLocalPositions()?.length > 0
                                    ? this.getLocalPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                    </Row>
                    <Modal
                        show={this.state.showManualAssignModal}
                        onHide={() => this.setState({showManualAssignModal: false})}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Manually Assigning {this.state.manualAssignPosition.callsign}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <select>
                                {this.state.controllers?.map(c => <option>{c.first_name} {c.last_name}</option>)}
                            </select>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        )
    }
}

export default withSnackbar(EditEvent)

// TODO: Add event scores to position assignment.
