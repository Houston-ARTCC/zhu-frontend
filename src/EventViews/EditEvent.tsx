import React, { Component } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import qs from 'qs'
import { FaTimes, FaUserTimes } from 'react-icons/all'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import { withSnackbar } from 'notistack'

class EditEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {},
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id)
            .then(res => this.setState({ event: res.data }))
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
            .put('/api/events/' + this.props.match.params.id + '/', qs.stringify({ ...this.state.event }))
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

    renderPosition(position) {
        const handleAssign = (option) => {
            axiosInstance
                .patch('/api/events/position/' + position.id + '/', qs.stringify({ user: option.value }))
                .then(res => {
                    this.props.enqueueSnackbar('Assigned ' + option.label + ' to ' + position.callsign, {
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

        const handleDelete = () => {
            axiosInstance
                .delete('/api/events/position/' + position.id)
                .then(res => this.fetchEvent())
        }

        const handleUnassign = () => {
            axiosInstance
                .patch('/api/events/position/' + position.id + '/', qs.stringify({ user: null }))
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

        const options : any[] = []
        position.requests.map(request => options.push({value: request.user.cid, label: request.user.first_name + ' ' + request.user.last_name}))

        return (
            <div className="text-left">
                <div className="mb-2">
                    <b>{position.callsign}</b>
                    <div className="float-right">
                        <a className="text-red mr-3" onClick={handleDelete}><FaTimes className="fill-red"/> Remove</a>
                        <a className="text-primary" onClick={handleUnassign}><FaUserTimes className="fill-primary"/> Vacate</a>
                    </div>
                </div>
                <Dropdown options={options} onChange={handleAssign} value={position.user ? {value: position.user.cid, label: position.user.first_name + ' ' + position.user.last_name} : undefined} placeholder="Select a controller"/>
            </div>
        )
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

    render() {
        return (
            <div>
                <Navigation/>
                <Header title={this.state.event.name}/>
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
                                    <Form.Label> End</Form.Label>
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
                            <ul className="p-0">
                                {this.getEnroutePositions()?.length > 0
                                    ? this.getEnroutePositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">TRACON Positions</h3>
                            <ul className="p-0">
                                {this.getTRACONPositions()?.length > 0
                                    ? this.getTRACONPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Local Positions</h3>
                            <ul className="p-0">
                                {this.getLocalPositions()?.length > 0
                                    ? this.getLocalPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withSnackbar(EditEvent)

// TODO: Add event scores to position assignment.
