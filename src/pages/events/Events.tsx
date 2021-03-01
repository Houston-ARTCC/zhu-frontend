import React, { Component } from 'react';
import { FaRegEyeSlash, HiOutlineCalendar, HiOutlineClock, MdPersonOutline } from 'react-icons/all'
import { Button, Card, Col, Collapse, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'
import Moment from 'react-moment'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import axiosInstance from '../../helpers/axiosInstance'
import placeholder from '../../img/banner-placeholder.png'

export default class Events extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            archivedEvents: [],
            showArchivedEvents: false,
        }
        this.handleViewArchivedEvents = this.handleViewArchivedEvents.bind(this)
    }

    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events')
            .then(res => this.setState({ events: res.data }))
    }

    fetchArchivedEvents() {
        axiosInstance
            .get('/api/events/archived')
            .then(res => this.setState({ archivedEvents: res.data }))
    }

    renderEvent(event) {
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
                                        {event.available_shifts} Shift{event.available_shifts === 1 ? '' : 's'} Available
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <img className="event-banner-lg" src={event.banner || placeholder} alt={event.name}/>
                        </Card.Footer>
                    </Card>
                </Link>
            </Col>
        )
    }

    handleViewArchivedEvents() {
        if (this.state.archivedEvents.length < 1) this.fetchArchivedEvents()
        this.setState({ showArchivedEvents: !this.state.showArchivedEvents})
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
                    <hr/>
                    <div className="text-center mb-4">
                        <Button variant="bg-primary" onClick={this.handleViewArchivedEvents}>
                            View archived events
                        </Button>
                    </div>
                    <Collapse in={this.state.showArchivedEvents}>
                        <Row id="archived">
                            {this.state.archivedEvents.map(event => this.renderEvent(event))}
                        </Row>
                    </Collapse>
                </Container>
            </div>
        )
    }
}
