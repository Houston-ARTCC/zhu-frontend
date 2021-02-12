import React, { Component } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import { FaRegEyeSlash, HiOutlineCalendar, HiOutlineClock, MdPersonOutline } from 'react-icons/all'
import Moment from 'react-moment'
import moment from 'moment/moment'

export default class AllEvents extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
        }
    }

    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events')
            .then(res => this.setState({ events: res.data }))
    }

    renderEvent(event) {
        const shifts: any[] = []
        event.positions.map(position => shifts.push(...position.shifts))
        const availableShifts = shifts.filter(shift => !shift.user).length

        return (
            <Col md={6}>
                <Link to={`/events/${event.id}`}>
                    <Card>
                        <Card.Body>
                            <h3 className="text-black font-w700 m-0">{event.name} {event.hidden && <FaRegEyeSlash className="fill-red" size={35}/>}</h3>
                            <h5 className="text-gray font-w500 mb-3">Presented by {event.host}</h5>
                            <Row>
                                <Col>
                                    <div className="li-flex">
                                        <HiOutlineCalendar size={30} className="mr-2"/>
                                        <Moment local className="font-w500 font-lg" format="MMMM D, YYYY">{event.start}</Moment>
                                    </div>
                                    <div className="li-flex font-w500 font-lg">
                                        <HiOutlineClock size={30} className="mr-2"/>
                                        <Moment local tz={moment.tz.guess()} format="HH:mm z →&nbsp;" className="font-w500 font-lg">{event.start}</Moment>
                                        <Moment local tz={moment.tz.guess()} format="HH:mm z" className="font-w500 font-lg">{event.end}</Moment>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="li-flex font-w500 font-lg">
                                        <MdPersonOutline size={30} className="mr-2"/>
                                        {availableShifts} Shift{availableShifts === 1 ? '' : 's'} Available
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <img className="event-banner-lg" src={event.banner} alt={event.name}/>
                        </Card.Footer>
                    </Card>
                </Link>
            </Col>
        )
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Events"/>
                <Container fluid>
                    <Row>
                        {this.state.events.map(event => this.renderEvent(event))}
                    </Row>
                </Container>
            </div>
        )
    }
}
