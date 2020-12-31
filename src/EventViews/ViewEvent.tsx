import React, { Component } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { getCID } from '../Helpers';
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import { withSnackbar } from 'notistack'
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/all'
import Moment from 'react-moment'
import moment from 'moment/moment'
import 'moment-timezone'
import Countdown from 'react-countdown'

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

    renderPosition(position) {
        const handleRequest = () => {
            axiosInstance
                .post('/api/events/request/' + position.id + '/')
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
                .delete('/api/events/request/' + position.id)
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

        return (
            <li className="li-flex"><b className="mr-2">{position.callsign}</b> {position.user != null
                ? <b>{position.user.first_name} {position.user.last_name}</b>
                : position.requests.some(request => request.user.cid === getCID())
                    ? <Link className="text-danger" onClick={() => handleUnrequest()}>Unrequest</Link>
                    : <Link className="text-success" onClick={() => handleRequest()}>Request</Link>
            }</li>
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
                <Header title={this.state.event.name} subtitle={`Presented by ${this.state.event.host}`}/>
                <Container fluid className="text-center">
                    <Row className="mb-5 d-flex align-items-center">
                        <Col md={6}>
                            <p className="font-w500">{this.state.event.description}</p>
                            <Row className="align-items-center">
                                <Col>
                                    <h3 className="text-black font-w500">Start</h3>
                                    <Moment local tz={moment.tz.guess()} format="MMM DD, YYYY, HH:mm z" element="h5" className="font-w400">{this.state.event.start}</Moment>
                                    <h3 className="text-black font-w500">End</h3>
                                    <Moment local tz={moment.tz.guess()} format="MMM DD, YYYY, HH:mm z" element="h5" className="font-w400">{this.state.event.end}</Moment>
                                </Col>
                                <Col>
                                    <h3 className="text-black font-w500">Time Until Event</h3>
                                    {new Date(this.state.event.end) < new Date()
                                        ? <h5 className="font-w400">Event has ended.</h5>
                                        : <Countdown date={new Date(this.state.event.start)} renderer={
                                            ({ days, hours, minutes, seconds, completed }) => completed ? <h5 className="font-w400">Event has begun!</h5> : <h5 className="font-w400">{days}d {hours}h {minutes}m {seconds}s</h5>
                                        }/>
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <img className="event-banner-lg" src={this.state.event.banner} alt={this.state.event.name}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Enroute Positions</h3>
                            <h5 className="text-gray font-w500 mb-4">{this.getEnroutePositions()?.filter(position => !position.user).length} Position{this.getEnroutePositions()?.filter(position => !position.user).length === 1 ? '' : 's'} Available</h5>
                            <ul className="p-0">
                                {this.getEnroutePositions()?.length > 0
                                    ? this.getEnroutePositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">TRACON Positions</h3>
                            <h5 className="text-gray font-w500 mb-4">{this.getTRACONPositions()?.filter(position => !position.user).length} Position{this.getTRACONPositions()?.filter(position => !position.user).length === 1 ? '' : 's'} Available</h5>
                            <ul className="p-0">
                                {this.getTRACONPositions()?.length > 0
                                    ? this.getTRACONPositions()?.map(position => this.renderPosition(position))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="text-left">
                            <h3 className="text-black font-w700 mb-1">Local Positions</h3>
                            <h5 className="text-gray font-w500 mb-4">{this.getLocalPositions()?.filter(position => !position.user).length} Position{this.getLocalPositions()?.filter(position => !position.user).length === 1 ? '' : 's'} Available</h5>
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

export default withSnackbar(ViewEvent)
