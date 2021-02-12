import React, { Component } from 'react';
import { Alert, Button, Col, Container, ProgressBar, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { getCID, isStaff } from '../Helpers';
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import { withSnackbar } from 'notistack'
import Moment from 'react-moment'
import moment from 'moment/moment'
import 'moment-timezone'
import Countdown from 'react-countdown'
import { FaRegEyeSlash, RiPencilRuler2Line } from 'react-icons/all'

class ViewEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {},
        }
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id)
            .then(res => this.setState({ event: res.data }))
    }

    getEnroutePositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'CTR' || level === 'FSS'
        })
    }

    getEnrouteShifts() {
        let shifts: any[] = []
        this.getEnroutePositions()?.map(position => shifts.push(...position.shifts))
        return shifts
    }

    getTRACONPositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'APP' || level === 'DEP'
        })
    }

    getTRACONShifts() {
        let shifts: any[] = []
        this.getTRACONPositions()?.map(position => shifts.push(...position.shifts))
        return shifts
    }

    getLocalPositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'DEL' || level === 'GND' || level === 'TWR'
        })
    }

    getLocalShifts() {
        let shifts: any[] = []
        this.getLocalPositions()?.map(position => shifts.push(...position.shifts))
        return shifts
    }

    renderShift(shift, position) {
        const handleRequest = () => {
            axiosInstance
                .post('/api/events/request/' + shift.id + '/')
                .then(res => {
                    this.fetchEvent()
                    this.props.enqueueSnackbar('Requested ' + position.callsign, {
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

        const handleUnrequest = () => {
            axiosInstance
                .delete('/api/events/request/' + shift.id)
                .then(res => {
                    this.fetchEvent()
                    this.props.enqueueSnackbar('Unrequested ' + position.callsign, {
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

        let requested = shift.requests.some(req => req.user.cid === getCID())
        return (
            <ProgressBar
                style={shift.user ? {} : { cursor: 'pointer' }}
                onClick={shift.user ? () => {} : requested ? handleUnrequest : handleRequest}
                variant={
                    shift.user
                        ? 'green'
                        : requested
                            ? 'lightgray'
                            : 'transparent'
                }
                now={100 / position.shifts.length}
                striped={!shift.user && requested}
                label={
                    shift.user
                        ? shift.user.first_name + ' ' + shift.user.last_name
                        : requested
                            ? <span className="text-darkgray">Unrequest</span>
                            : <span className="text-black">Request</span>
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
        const enrouteShifts = this.getEnrouteShifts()?.filter(shift => !shift.user).length
        const TRACONShifts = this.getTRACONShifts()?.filter(shift => !shift.user).length
        const localShifts = this.getLocalShifts()?.filter(shift => !shift.user).length

        return (
            <div>
                <Navigation/>
                <Header title={this.state.event.name} subtitle={`Presented by ${this.state.event.host}`}/>
                <Container fluid className="text-center">
                    {this.state.event.hidden &&
                        <Row className="justify-content-center mb-5">
                            <Col md={6}>
                                <Alert variant="red" className="d-flex m-0">
                                    <FaRegEyeSlash className="fill-red mr-3" size={35} preserveAspectRatio="xMaxYMin"/>
                                    <div className="text-left">
                                        <h4>Event Hidden</h4>
                                        <p className="m-0">
                                            This event is currently hidden from controllers. <Link to={this.props.match.params.id + '/edit'} className="font-w500">Edit the event</Link> to make it visible.
                                        </p>
                                    </div>
                                </Alert>
                            </Col>
                        </Row>
                    }
                    <Row className="mb-5 d-flex align-items-center">
                        <Col md={6}>
                            <Row className="align-items-center mb-4">
                                <Col>
                                    <h4 className="text-black font-w500">Start</h4>
                                    <Moment local tz={moment.tz.guess()} format="MMM DD, YYYY, HH:mm z" element="h5" className="font-w400">{this.state.event.start}</Moment>
                                    <h4 className="text-black font-w500">End</h4>
                                    <Moment local tz={moment.tz.guess()} format="MMM DD, YYYY, HH:mm z" element="h5" className="font-w400">{this.state.event.end}</Moment>
                                </Col>
                                <Col>
                                    <h4 className="text-black font-w500">Time Until Event</h4>
                                    {new Date(this.state.event.end) < new Date()
                                        ? <h5 className="font-w400">Event has ended.</h5>
                                        : <Countdown date={new Date(this.state.event.start)} renderer={
                                            ({ days, hours, minutes, seconds, completed }) => completed ? <h5 className="font-w400">Event has begun!</h5> : <h5 className="font-w400">{days}d {hours}h {minutes}m {seconds}s</h5>
                                        }/>
                                    }
                                </Col>
                            </Row>
                            <p>{this.state.event.description}</p>
                            {isStaff() &&
                                <Link to={this.state.event.id + '/edit'}>
                                    <Button variant="primary"><RiPencilRuler2Line className="fill-white" viewBox="3 3 20 20"/> Edit Event</Button>
                                </Link>
                            }
                        </Col>
                        <Col md={6}>
                            <img className="event-banner-lg" src={this.state.event.banner} alt={this.state.event.name}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Enroute Positions</h3>
                            <h5 className="text-gray font-w500 mb-4">{enrouteShifts} Shift{enrouteShifts === 1 ? '' : 's'} Available</h5>
                            <ul className="p-0 list-unstyled">
                                {this.getEnroutePositions()?.length > 0
                                    ? this.getEnroutePositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">TRACON Positions</h3>
                            <h5 className="text-gray font-w500 mb-4">{TRACONShifts} Shift{TRACONShifts === 1 ? '' : 's'} Available</h5>
                            <ul className="p-0 list-unstyled">
                                {this.getTRACONPositions()?.length > 0
                                    ? this.getTRACONPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Local Positions</h3>
                            <h5 className="text-gray font-w500 mb-4">{localShifts} Shift{localShifts === 1 ? '' : 's'} Available</h5>
                            <ul className="p-0 list-unstyled">
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

export default withSnackbar(ViewEvent)
