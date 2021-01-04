import { Component } from 'react'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'
import { HiOutlineCalendar, HiOutlineClock, IoIosAirplane, IoTrophy } from 'react-icons/all'
import { Parallax } from 'react-parallax'
import Fade from 'react-reveal/Fade'
import background from './img/homepage-bg.jpg'
import profile from './img/profile.png'
import axiosInstance from './axiosInstance'
import { asDuration } from './Helpers'
import Moment from 'react-moment'
import 'moment-timezone'
import Navigation from './components/Navigation'
import moment from 'moment/moment'

export default class Home extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            onlineControllers: [],
            newestControllers: [],
            topControllers: [],
            topPositions: [],
            events: [],
        }
    }

    componentDidMount() {
        this.fetchOnlineControllers()
        this.fetchNewestControllers()
        this.fetchTopControllers()
        this.fetchTopPositions()
        this.fetchEvents()
    }

    fetchOnlineControllers() {
        axiosInstance
            .get('/api/connections/online')
            .then(res => this.setState({ onlineControllers: res.data }))
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

    fetchEvents() {
        axiosInstance
            .get('/api/events')
            .then(res => this.setState({ events: res.data }))
    }

    renderOnlineController(controller) {
        return (
            <li className="li-flex text-black font-w700 font-lg" style={this.state.onlineControllers?.length > 5 ? {width: '50%'} : {}}>
                <Badge variant="primary" className="font-w700 mr-2">{controller.callsign}</Badge>
                {controller.user.first_name} {controller.user.last_name}
            </li>
        )
    }

    renderNewestController(controller) {
        return (
            <li className="li-flex text-black font-w700 font-lg">
                <img className="profile-md mr-2" src={profile} alt="Michael Romashov"/> {controller.first_name} {controller.last_name} ({controller.initials})
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
                    {position.position}
                    <br/><span className="text-gray font-w500">{asDuration(position.hours)}</span>
                </div>
            </li>
        )
    }

    renderEvent(event) {
        return (
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
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
                        <Col className="text-right">
                            <img className="event-banner-sm" src={event.banner} alt={event.name}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
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
                </Parallax>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row className="justify-content-between mb-5">
                            <Col sm={12} xl={this.state.onlineControllers?.length > 5 ? 6 : 7}>
                                <h1 className="text-black font-w700 mb-1">Virtual Houston ARTCC</h1>
                                <h4 className="text-gray font-w500 mb-4">Part of VATUSA & the VATSIM Network.</h4>
                                <p>Welcome to the Virtual Houston Air Route Traffic Control Center! Encompassing an airspace of approximately 280,000
                                    square miles in parts of Texas, Louisiana, Mississippi, and Alabama, Houston has a diverse selection of
                                    destinations for you to choose from along with the professional air traffic control services to support your
                                    flight.</p>
                            </Col>
                            <Col sm={12} xl={this.state.onlineControllers?.length > 5 ? 5 : 3}>
                                <h2 className="text-black font-w500 mb-3">Who's Online?</h2>
                                <ul className={'p-0 ' + (this.state.onlineControllers?.length > 5 ? 'd-flex flex-wrap' : '')}>
                                    {this.state.onlineControllers?.length > 0
                                        ? this.state.onlineControllers.map(controller => this.renderOnlineController(controller))
                                        : <p>Nobody is online.</p>
                                    }
                                </ul>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col sm={12} xl={6}>
                                <h1 className="text-black font-w700 mb-1">Announcements</h1>
                                <h4 className="text-gray font-w500 mb-4">What's happening at Houston?</h4>
                                <Card>
                                    <Card.Body>
                                        <div className="badge badge-primary announcment-date">Dec. 25, 2020</div>
                                        <h5 className="text-black font-w700">Happy Holidays from Houston!</h5>
                                        <div className="user">
                                            <img className="profile-sm mr-2" src={profile} alt="Michael Romashov"/>
                                            <p className="text-darkgray font-w500 m-0">Marcus Miller</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Card>
                                    <Card.Body>
                                        <div className="badge badge-primary announcment-date">Dec. 18, 2020</div>
                                        <h5 className="text-black font-w700">Welcome to the Refined Houston Experience!</h5>
                                        <div className="user">
                                            <img className="profile-sm mr-2" src={profile} alt="Michael Romashov"/>
                                            <p className="text-darkgray font-w500 m-0">Michael Romashov</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Card>
                                    <Card.Body>
                                        <div className="badge badge-primary announcment-date">Nov. 25, 2020</div>
                                        <h5 className="text-black font-w700">Houston Events Department Survey</h5>
                                        <div className="user">
                                            <img className="profile-sm mr-2" src={profile} alt="Michael Romashov"/>
                                            <p className="text-darkgray font-w500 m-0">Ryan Drozd</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={12} xl={6}>
                                <h1 className="text-black font-w700 mb-1">Events</h1>
                                <h4 className="text-gray font-w500 mb-4">Are y'all busy?</h4>
                                {this.state.events?.length > 0
                                    ? this.state.events.slice(0, 2).map(event => this.renderEvent(event))
                                    : <p>There are no planned events.</p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h2 className="text-black font-w500 mb-3">Newest Controllers</h2>
                                <ul className="p-0">
                                    {this.state.newestControllers?.length > 0
                                        ? this.state.newestControllers.map((controller) => this.renderNewestController(controller))
                                        : <p>Not enough data.</p>
                                    }
                                </ul>
                            </Col>
                            <Col>
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
                    </Container>
                </Fade>
            </div>
        );
    }
}
