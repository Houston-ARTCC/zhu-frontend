import React, { Component } from 'react'
import { Badge, Button, Col, Container, Dropdown, Form, FormGroup, Modal, ProgressBar, Row } from 'react-bootstrap'
import { RiAddLine, RiDeleteBinLine } from 'react-icons/all'
import { withSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { EventDropdownMenu, EventDropdownToggle } from '../../components/EventDropdowns'
import Navigation from '../../components/Navigation'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import { sessionStatusDisplay } from '../../helpers/utils'

class EditEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {},
            showManualAssignModal: false,
            manualAssignPosition: {},
            manualAssignShift: {},
            manualAssignUser: {},
            showAddPositionModal: false,
            addPositionCallsign: '',
            addPositionShifts: 2,
            controllers: [],
        }
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id + '/')
            .then(res => this.setState({ event: res.data }))
    }

    fetchControllers() {
        axiosInstance
            .get('/api/users/scores/')
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

    handleSubmit(e) {
        e.preventDefault()
        axiosInstance
            .patch('/api/events/' + this.props.match.params.id + '/', this.state.event)
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

    handleDelete() {
        axiosInstance
            .delete('/api/events/' + this.state.event.id + '/')
            .then(res => {
                this.props.enqueueSnackbar('Event deleted!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                this.props.history.push('/events')
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

    handleAddPosition() {
        axiosInstance
            .post('/api/events/' + this.props.match.params.id + '/', {
                callsign: this.state.addPositionCallsign,
                shifts: this.state.addPositionShifts
            })
            .then(res => {
                this.props.enqueueSnackbar('Added ' + this.state.addPositionCallsign, {
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
            .finally(() => this.setState({ addPositionCallsign: '', addPositionShifts: 2 }))
    }

    assignShift(cid, name, shift, position) {
        axiosInstance
            .patch('/api/events/shift/' + shift.id + '/', { user: cid })
            .then(res => {
                this.props.enqueueSnackbar(cid
                        ? 'Assigned ' + name + ' to ' + position.callsign + ' (' + (position.shifts.indexOf(shift) + 1) + ')'
                        : 'Vacated ' + position.callsign + ' (' + (position.shifts.indexOf(shift) + 1) + ')'
                    , {
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

    renderScore(score) {
        let color

        if (score < 65) color = 'red'
        else if (score < 90) color = 'yellow'
        else color = 'green'

        return <Badge variant={color + ' rounded'}>{score}%</Badge>
    }

    renderShift(shift, position) {
        const handleClick = (eventKey) => {
            if (eventKey === 'unassign') handleUnassign()
            else if (eventKey === 'delete') handleDelete()
            else if (eventKey === 'manual') handleManualAssign()
            else handleAssign(eventKey)
        }

        const handleAssign = (requestId) => {
            let request = shift.requests.find(req => req.id === requestId)
            this.assignShift(request.user.cid, request.user.first_name + ' ' + request.user.last_name, shift, position)
        }

        const handleUnassign = () => {
            this.assignShift(null, null, shift, position)
        }

        const handleManualAssign = () => {
            this.fetchControllers()
            this.setState({
                manualAssignPosition: position,
                manualAssignShift: shift,
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
                now={95 / position.shifts.length}
                className="align-items-center"
                label={
                    <Dropdown className={'position-absolute ' + (shift.user ? 'stroke-white' : 'stroke-black')} onSelect={handleClick}>
                        <Dropdown.Toggle as={EventDropdownToggle} id="dropdown-custom-components">
                            {shift.user
                                ? <span className="text-white">{shift.user.first_name} {shift.user.last_name}</span>
                                : <span className="text-black">Unassigned</span>
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu as={EventDropdownMenu}>
                            {shift.requests?.length > 0
                                ? shift.requests.map(request => (
                                    <Dropdown.Item key={request.id} eventKey={request.id.toString()}>
                                        {request.user.first_name + ' ' + request.user.last_name} {this.renderScore(request.user.event_score)}
                                    </Dropdown.Item>
                                ))
                                : <Dropdown.Item disabled>No requests...</Dropdown.Item>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                }
            />
        )
    }

    renderPosition(position) {
        const handleAddShift = () => {
            axiosInstance
                .put('/api/events/position/' + position.id + '/')
                .then(res => this.fetchEvent())
        }

        const handleDelete = () => {
            axiosInstance
                .delete('/api/events/position/' + position.id + '/')
                .then(res => {
                    this.props.enqueueSnackbar('Deleted ' + position.callsign, {
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

        return (
            <li className="mb-3">
                <div className="float-right">
                    <Button variant="bg-red" className="btn-sm" onClick={handleDelete}>
                        <RiDeleteBinLine viewBox="2 4 20 20"/> Delete Position
                    </Button>
                </div>
                <p className="mb-3">{position.callsign}</p>
                <div>
                    <ProgressBar>
                        {position.shifts.length > 0
                            ? position.shifts.map(shift => this.renderShift(shift, position))
                            : <ProgressBar
                                variant="white"
                                now={100}
                                label={<i className="text-black">No shifts have been posted.</i>}
                            />
                        }
                        <ProgressBar
                            variant="transparent"
                            now={5}
                            label={<span><RiAddLine viewBox="2 4 20 20"/></span>}
                            style={{ cursor: 'pointer' }}
                            onClick={handleAddShift}
                        />
                    </ProgressBar>
                </div>
            </li>
        )
    }

    render() {
        const controllerOptions : any[] = []
        this.state.controllers.map(controller => {
            controllerOptions.push({
                value: controller.cid,
                label: controller.first_name + ' ' + controller.last_name,
                score: controller.event_score,
            })
        })

        return (
            <div>
                <Navigation/>
                <Header
                    title={this.state.event.name}
                    subtitle="Editing Event"
                />
                <Container fluid>
                    <Form onSubmit={this.handleSubmit} className="mb-5">
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
                        <div className="mb-3">
                            <Link to={'/events/' + this.props.match.params.id} className="link-unstyled">
                                <Button className="mr-2" variant="lightgray" type="submit">
                                    Return to Event
                                </Button>
                            </Link>
                            <Button className="mr-2" variant="primary" type="submit">
                                Save
                            </Button>
                            <Button variant="red" onClick={this.handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </Form>
                    <Row>
                        <Col className="text-left">
                            <div className="float-right mt-1">
                                <Button variant="bg-primary" className="btn-sm" onClick={() => this.setState({ showAddPositionModal: true })}>
                                    <RiAddLine viewBox="2 4 20 20"/> Add Position
                                </Button>
                            </div>
                            <h3 className="text-black font-w700 mb-1">Enroute Positions</h3>
                            <ul className="p-0 list-unstyled">
                                {this.getEnroutePositions()?.length > 0
                                    ? this.getEnroutePositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <div className="float-right mt-1">
                                <Button variant="bg-primary" className="btn-sm" onClick={() => this.setState({ showAddPositionModal: true })}>
                                    <RiAddLine viewBox="2 4 20 20"/> Add Position
                                </Button>
                            </div>
                            <h3 className="text-black font-w700 mb-1">TRACON Positions</h3>
                            <ul className="p-0 list-unstyled">
                                {this.getTRACONPositions()?.length > 0
                                    ? this.getTRACONPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <div className="float-right mt-1">
                                <Button variant="bg-primary" className="btn-sm" onClick={() => this.setState({ showAddPositionModal: true })}>
                                    <RiAddLine viewBox="2 4 20 20"/> Add Position
                                </Button>
                            </div>
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
                        onHide={() => this.setState({ showManualAssignModal: false })}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Manually Assigning {this.state.manualAssignPosition.callsign} ({(this.state.manualAssignPosition.shifts?.indexOf(this.state.manualAssignShift) + 1)})</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Select
                                className="mb-3"
                                options={controllerOptions}
                                getOptionLabel={(option) => <span>{option.label} {this.renderScore(option.score)}</span>}
                                onChange={(value) => this.setState({ manualAssignUser: value })}
                            />
                            <Button
                                variant="primary"
                                onClick={() => {
                                    this.assignShift(
                                        this.state.manualAssignUser.value,
                                        this.state.manualAssignUser.label,
                                        this.state.manualAssignShift,
                                        this.state.manualAssignPosition,
                                    )
                                    this.setState({ showManualAssignModal: false })
                                }}
                            >
                                Assign
                            </Button>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        show={this.state.showAddPositionModal}
                        onHide={() => this.setState({ showAddPositionModal: false, addPositionCallsign: '', addPositionShifts: 2 })}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Adding Position</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Row>
                                <FormGroup className="mb-0" as={Col}>
                                    <Form.Label>Callsign</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={this.state.addPositionCallsign}
                                        onChange={(event) => this.setState({ addPositionCallsign: event.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-0" as={Col} md={3}>
                                    <Form.Label>No. of Shifts</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        max={10}
                                        onChange={(event) => this.setState({ addPositionShifts: event.target.value })}
                                        value={this.state.addPositionShifts}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-0 d-flex align-items-end" as={Col}>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            this.handleAddPosition()
                                            this.setState({ showAddPositionModal: false })
                                        }}
                                    >
                                        Add
                                    </Button>
                                </FormGroup>
                            </Form.Row>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        )
    }
}

export default withSnackbar(EditEvent)
