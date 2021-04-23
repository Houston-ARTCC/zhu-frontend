import React, { Component } from 'react'
import { Badge, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import { HiOutlineCalendar, HiOutlineClock, IoIosAirplane, IoTrophy } from 'react-icons/all'
import { Parallax } from 'react-parallax'
import Fade from 'react-reveal/Fade'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'
import moment from 'moment/moment'
import Moment from 'react-moment'
import 'moment-timezone'
import getPositionName from '../helpers/facilities'
import axiosInstance from '../helpers/axiosInstance'
import { formatDurationStr } from '../helpers/utils'
import background from '../img/homepage-bg.jpg'
import backgroundDark from '../img/homepage-bg-dark.jpg'
import { getTheme } from '../helpers/themeManager'

export default class Home extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            onlineControllers: [],
            announcements: [],
            events: [],
            newestControllers: [],
            topControllers: [],
            topPositions: [],
            showAnnouncementModal: false,
            activeAnnouncement: {},
            showBetaModal: false,
        }
    }

    componentDidMount() {
        document.title = 'Welcome to Houston ARTCC!'
        this.fetchOnlineControllers()
        this.fetchAnnouncements()
        this.fetchEvents()
        this.fetchNewestControllers()
        this.fetchTopControllers()
        this.fetchTopPositions()

        if ((window.location.hostname === 'beta.zhuartcc.org' || window.location.hostname === 'www.zhuartcc.devel') && !localStorage.getItem('hasVisited')) {
            localStorage.setItem('hasVisited', 'true')
            this.setState({ showBetaModal: true })
        }
    }

    fetchOnlineControllers() {
        axiosInstance
            .get('/api/connections/online/')
            .then(res => this.setState({ onlineControllers: res.data }))
    }

    fetchAnnouncements() {
        axiosInstance
            .get('/api/announcements/recent/')
            .then(res => this.setState({ announcements: res.data.slice(0, 3) }))
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events/')
            .then(res => this.setState({ events: res.data.filter(event => !event.hidden).slice(0, 2) }))
    }

    fetchNewestControllers() {
        axiosInstance
            .get('/api/users/newest/')
            .then(res => this.setState({ newestControllers: res.data }))
    }

    fetchTopControllers() {
        axiosInstance
            .get('/api/connections/top/controllers/')
            .then(res => this.setState({ topControllers: res.data.slice(0, 3) }))
    }

    fetchTopPositions() {
        axiosInstance
            .get('/api/connections/top/positions/')
            .then(res => this.setState({ topPositions: res.data.slice(0, 3) }))
    }

    renderOnlineController(controller) {
        return (
            <li className="li-flex font-w500" style={this.state.onlineControllers?.length > 5 && window.innerWidth >= 768 ? {width: '50%'} : {}}>
                <Badge variant="primary" className="mr-2">{controller.callsign}</Badge>
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
                                src={process.env.REACT_APP_API_URL + announcement.author.profile}
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
                                <h5 className="text-black font-w700 mb-0">{event.name}</h5>
                                <h6 className="text-gray font-w500 mb-3">Presented by {event.host}</h6>
                                <div className="li-flex">
                                    <HiOutlineCalendar size={25} className="mr-2"/>
                                    <Moment local className="font-w500 font-md" format="MMMM D, YYYY">{event.start}</Moment>
                                </div>
                                <div className="li-flex mb-0">
                                    <HiOutlineClock size={25} className="mr-2"/>
                                    <Moment local tz={moment.tz.guess()} format="HH:mm z →&nbsp;" className="font-w500 font-md">{event.start}</Moment>
                                    <Moment local tz={moment.tz.guess()} format="HH:mm z" className="font-w500 font-md">{event.end}</Moment>
                                </div>
                            </Col>
                            <Col xs={12} lg={6} className="d-flex">
                                <img className="event-banner-sm align-self-center" src={event.banner} alt={event.name}/>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
        )
    }

    renderNewestController(controller) {
        return (
            <li className="li-flex text-darkgray font-w500 font-lg">
                <img
                    className="profile-md mr-2"
                    src={process.env.REACT_APP_API_URL + controller.profile}
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
                <div className="text-darkgray font-w500 font-lg">
                    {controller.first_name} {controller.last_name}
                    <br/><span className="text-gray">{formatDurationStr(controller.hours)}</span>
                </div>
            </li>
        )
    }

    renderTopPosition(position, index) {
        return (
            <li className="li-flex">
                <IoIosAirplane className={`fill-${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'} mr-2`} size={45}/>
                <div className="text-darkgray font-w500 font-lg">
                    {getPositionName(position.position)}
                    <br/><span className="text-gray">{formatDurationStr(position.hours)}</span>
                </div>
            </li>
        )
    }

    render() {
        return (
            <>
                <Parallax bgImage={getTheme() === 'dark' ? backgroundDark : background} strength={250}>
                    <div id="homepage-hero">
                        <h4 className="text-white font-w500" id="tagline">From longhorns to space ships, we've got it all!</h4>
                        <h1 className="text-white font-w700" id="welcome">Welcome to Houston</h1>
                    </div>
                </Parallax>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row className="justify-content-between mb-5">
                            <Col sm={12} xl={this.state.onlineControllers?.length > 5 ? 6 : 7} className="mb-4 mb-xl-0">
                                <h1 className="text-black font-w700 mb-1">Virtual Houston ARTCC</h1>
                                <h4 className="text-gray mb-4">Part of VATUSA & the VATSIM Network.</h4>
                                <p>Welcome to the Virtual Houston Air Route Traffic Control Center! Encompassing an airspace of approximately 280,000
                                    square miles in parts of Texas, Louisiana, Mississippi, and Alabama, Houston has a diverse selection of
                                    destinations for you to choose from along with the professional air traffic control services to support your
                                    flight.</p>
                            </Col>
                            <Col sm={12} xl={this.state.onlineControllers?.length > 5 ? 5 : 3} className="mb-4 mb-xl-0">
                                <h2 className="text-black mb-3">Who's Online?</h2>
                                <ul className={'p-0 ' + (this.state.onlineControllers?.length > 5 ? 'd-flex flex-wrap' : '')}>
                                    {this.state.onlineControllers?.length > 0
                                        ? this.state.onlineControllers.map(controller => this.renderOnlineController(controller))
                                        : <p>Nobody is online.</p>
                                    }
                                </ul>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col sm={12} xl={6} className="mb-4 mb-xl-0">
                                <h2 className="text-black mb-1 text-break">Announcements</h2>
                                <h6 className="text-gray mb-4">What's happening at Houston?</h6>
                                {this.state.announcements?.length > 0
                                    ? this.state.announcements.map(announcement => this.renderAnnouncement(announcement))
                                    : <p>There are no announcements.</p>
                                }
                            </Col>
                            <Col sm={12} xl={6} className="mb-4 mb-xl-0">
                                <h2 className="text-black mb-1">Events</h2>
                                <h6 className="text-gray mb-4">Are y'all busy?</h6>
                                {this.state.events?.length > 0
                                    ? this.state.events.map(event => this.renderEvent(event))
                                    : <p>There are no planned events.</p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-4 mb-xl-0">
                                <h2 className="text-black mb-3">Newest Controllers</h2>
                                <ul className="p-0">
                                    {this.state.newestControllers?.length > 0
                                        ? this.state.newestControllers.map((controller) => this.renderNewestController(controller))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                            <Col className="mb-4 mb-xl-0">
                                <h2 className="text-black mb-3">Top Controllers</h2>
                                <ul className="p-0">
                                    {this.state.topControllers?.length > 0
                                        ? this.state.topControllers.map((controller, index) => this.renderTopController(controller, index))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                            <Col>
                                <h2 className="text-black mb-3">Top Positions</h2>
                                <ul className="p-0">
                                    {this.state.topPositions?.length > 0
                                        ? this.state.topPositions.map((position, index) => this.renderTopPosition(position, index))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                        </Row>
                    </Container>
                </Fade>
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
                <Modal
                    size="lg"
                    show={this.state.showBetaModal}
                    centered
                    onHide={() => this.setState({ showBetaModal: false })}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Welcome to the Beta Website</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Hi there!</p>
                        <p>Thanks for checking out the fancy new beta website for the Houston ARTCC! <b>However, please note that this website is a sandbox environment!</b></p>
                        <p>This means that all information on this website is not up to date and does not reflect current facility operations, statistics, and data. Additionally, any information that you enter will not be officially recorded.</p>
                        <p>For current controller resources, training requests, feedback, and event position requests, please visit to the production website at <a href="https://zhuartcc.org">https://zhuartcc.org</a>.</p>
                        <p>This website will remain online for beta testing of new features and I encourage all of you to continue to look for errors or bugs.</p>
                        <p className="mb-0"><b>Michael Romashov</b></p>
                        <p className="mb-0"><b>wm@zhuartcc.org</b></p>
                        <p><b>Webmaster</b></p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

// TODO: Add scroll indicator below main header.
