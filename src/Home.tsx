import React, { Component } from 'react'
import { Badge, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import { HiOutlineCalendar, HiOutlineClock, IoIosAirplane, IoTrophy } from 'react-icons/all'
import { Parallax } from 'react-parallax'
import Fade from 'react-reveal/Fade'
import background from './img/homepage-bg.jpg'
import axiosInstance from './axiosInstance'
import { asDuration } from './Helpers'
import Moment from 'react-moment'
import moment from 'moment/moment'
import 'moment-timezone'
import Navigation from './components/Navigation'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'
import getPositionName from './facilities'

export default class Home extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            scroll: false,
            onlineControllers: [],
            announcements: [],
            events: [],
            newestControllers: [],
            topControllers: [],
            topPositions: [],
            showAnnouncementModal: false,
            activeAnnouncement: {}
        }
        this.onScroll = this.onScroll.bind(this)
    }

    componentDidMount() {
        this.fetchOnlineControllers()
        this.fetchAnnouncements()
        this.fetchEvents()
        this.fetchNewestControllers()
        this.fetchTopControllers()
        this.fetchTopPositions()
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
        this.setState({scroll: true})
    }

    fetchOnlineControllers() {
        axiosInstance
            .get('/api/connections/online')
            .then(res => this.setState({ onlineControllers: res.data }))
    }

    fetchAnnouncements() {
        axiosInstance
            .get('/api/announcements')
            .then(res => this.setState({ announcements: res.data }))
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events')
            .then(res => this.setState({ events: res.data }))
    }

    fetchNewestControllers() {
        axiosInstance
            .get('/api/users/newest')
            .then(res => this.setState({ newestControllers: res.data }))
    }

    fetchTopControllers() {
        axiosInstance
            .get('/api/connections/top/controllers')
            .then(res => this.setState({ topControllers: res.data }))
    }

    fetchTopPositions() {
        axiosInstance
            .get('/api/connections/top/positions')
            .then(res => this.setState({ topPositions: res.data }))
    }

    renderOnlineController(controller) {
        return (
            <li className="li-flex text-black font-w700 font-lg" style={this.state.onlineControllers?.length > 5 ? {width: '50%'} : {}}>
                <Badge variant="primary" className="font-w700 mr-2">{controller.callsign}</Badge>
                {controller.user.first_name} {controller.user.last_name}
            </li>
        )
    }

    renderAnnouncement(announcement) {
        return (
            <Link onClick={() => this.setState({showAnnouncementModal: true, activeAnnouncement: announcement})}>
                <Card>
                    <Card.Body>
                        <Moment element="div" className="badge badge-primary announcment-date" local format="MMM. D, YYYY">{announcement.posted}</Moment>
                        <h5 className="text-black font-w700">{announcement.title}</h5>
                        <div className="user">
                            <img
                                className="profile-sm mr-2"
                                src={'http://api.zhuartcc.devel' + announcement.author.profile}
                                alt={announcement.author.first_name + ' ' + announcement.author.last_name}
                            />
                            <p className="text-darkgray font-w500 m-0">{announcement.author.first_name} {announcement.author.last_name}</p>
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        )
    }

    renderEvent(event) {
        return (
            <Link to={'/events/' + event.id}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs={12} lg={6}>
                                <h5 className="text-black font-w700 m-0">{event.name}</h5>
                                <h6 className="text-gray font-w500 mb-3">Presented by {event.host}</h6>
                                <div className="li-flex">
                                    <HiOutlineCalendar size={25} className="mr-2"/>
                                    <Moment local className="font-w500 font-md" format="MMMM D, YYYY">{event.start}</Moment>
                                </div>
                                <div className="li-flex font-w500">
                                    <HiOutlineClock size={25} className="mr-2"/>
                                    <Moment local tz={moment.tz.guess()} format="HH:mm z →&nbsp;" className="font-w500 font-md">{event.start}</Moment>
                                    <Moment local tz={moment.tz.guess()} format="HH:mm z" className="font-w500 font-md">{event.end}</Moment>
                                </div>
                            </Col>
                            <Col xs={12} lg={6} className="text-right">
                                <img className="event-banner-sm" src={event.banner} alt={event.name}/>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
        )
    }

    renderNewestController(controller) {
        return (
            <li className="li-flex text-black font-w700 font-lg">
                <img
                    className="profile-md mr-2"
                    src={'http://api.zhuartcc.devel' + controller.profile}
                    alt={controller.first_name + ' ' + controller.last_name}
                />
                {controller.first_name} {controller.last_name} ({controller.initials})
            </li>
        )
    }

    renderTopController(controller, index) {
        return (
            <li className="li-flex">
                <IoTrophy className={`fill-${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'} mr-2`} size={45}/>
                <div className="text-black font-w700 font-lg">
                    {controller.first_name} {controller.last_name}
                    <br/><span className="text-gray font-w500">{asDuration(controller.hours)}</span>
                </div>
            </li>
        )
    }

    renderTopPosition(position, index) {
        return (
            <li className="li-flex">
                <IoIosAirplane className={`fill-${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'} mr-2`} size={45}/>
                <div className="text-black font-w700 font-lg">
                    {getPositionName(position.position)}
                    <br/><span className="text-gray font-w500">{asDuration(position.hours)}</span>
                </div>
            </li>
        )
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Parallax bgImage={background} strength={250}>
                    <div id="homepage-hero">
                        <h4 className="text-white font-w500" id="tagline">From longhorns to space ships, we've got it all!</h4>
                        <h1 className="text-white font-w700" id="welcome">Welcome to Houston</h1>
                    </div>
                    <svg width="56" height="31" viewBox="0 0 56 31" fill="none" xmlns="http://www.w3.org/2000/svg" id="hero-arrow" className={this.state.scroll ? 'hide' : ''}>
                        <path d="M3 3L28 28L53 3" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Parallax>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row className="justify-content-between mb-4">
                            <Col sm={12} xl={this.state.onlineControllers?.length > 5 ? 6 : 7} className="mb-4 mb-xl-0">
                                <h1 className="text-black font-w700 mb-1">Virtual Houston ARTCC</h1>
                                <h4 className="text-gray font-w500 mb-4">Part of VATUSA & the VATSIM Network.</h4>
                                <p>Welcome to the Virtual Houston Air Route Traffic Control Center! Encompassing an airspace of approximately 280,000
                                    square miles in parts of Texas, Louisiana, Mississippi, and Alabama, Houston has a diverse selection of
                                    destinations for you to choose from along with the professional air traffic control services to support your
                                    flight.</p>
                            </Col>
                            <Col sm={12} xl={this.state.onlineControllers?.length > 5 ? 5 : 3} className="mb-4 mb-xl-0">
                                <h2 className="text-black font-w500 mb-3">Who's Online?</h2>
                                <ul className={'p-0 ' + (this.state.onlineControllers?.length > 5 ? 'd-flex flex-wrap' : '')}>
                                    {this.state.onlineControllers?.length > 0
                                        ? this.state.onlineControllers.map(controller => this.renderOnlineController(controller))
                                        : <p>Nobody is online.</p>
                                    }
                                </ul>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col sm={12} xl={6} className="mb-4 mb-xl-0">
                                <h1 className="text-black font-w700 mb-1">Announcements</h1>
                                <h4 className="text-gray font-w500 mb-4">What's happening at Houston?</h4>
                                {this.state.announcements?.length > 0
                                    ? this.state.announcements.slice(0, 3).map(announcement => this.renderAnnouncement(announcement))
                                    : <p>There are no announcements.</p>
                                }
                            </Col>
                            <Col sm={12} xl={6} className="mb-4 mb-xl-0">
                                <h1 className="text-black font-w700 mb-1">Events</h1>
                                <h4 className="text-gray font-w500 mb-4">Are y'all busy?</h4>
                                {this.state.events?.length > 0
                                    ? this.state.events.slice(0, 2).map(event => this.renderEvent(event))
                                    : <p>There are no planned events.</p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-4 mb-xl-0">
                                <h2 className="text-black font-w500 mb-3">Newest Controllers</h2>
                                <ul className="p-0">
                                    {this.state.newestControllers?.length > 0
                                        ? this.state.newestControllers.map((controller) => this.renderNewestController(controller))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                            <Col className="mb-4 mb-xl-0">
                                <h2 className="text-black font-w500 mb-3">Top Controllers</h2>
                                <ul className="p-0">
                                    {this.state.topControllers?.length > 0
                                        ? this.state.topControllers.slice(0, 3).map((controller, index) => this.renderTopController(controller, index))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                            <Col>
                                <h2 className="text-black font-w500 mb-3">Top Positions</h2>
                                <ul className="p-0">
                                    {this.state.topPositions?.length > 0
                                        ? this.state.topPositions.slice(0, 3).map((position, index) => this.renderTopPosition(position, index))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                        </Row>
                        <Modal
                            size="lg"
                            show={this.state.showAnnouncementModal}
                            onHide={() => this.setState({showAnnouncementModal: false})}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>{this.state.activeAnnouncement.title}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.activeAnnouncement.body ? parse(this.state.activeAnnouncement.body) : ''}
                            </Modal.Body>
                        </Modal>
                    </Container>
                </Fade>
            </div>
        );
    }
}
