import { useEffect, useState } from 'react'
import { Badge, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import { HiOutlineCalendar, HiOutlineClock, IoIosAirplane, IoTrophy } from 'react-icons/all'
import { Parallax } from 'react-parallax'
import Fade from 'react-reveal/Fade'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'
import getPositionName from '../helpers/facilities'
import axiosInstance from '../helpers/axiosInstance'
import { formatDurationStr } from '../helpers/utils'
import background from '../img/homepage-bg.jpg'
import backgroundDark from '../img/homepage-bg-dark.jpg'
import { getTheme } from '../helpers/themeManager'
import { format } from 'date-fns-tz'

export default function Home() {
    const [onlineControllers, setOnlineControllers] = useState([])
    const [announcements, setAnnouncements] = useState([])
    const [events, setEvents] = useState([])
    const [newestControllers, setNewestControllers] = useState([])
    const [topControllers, setTopControllers] = useState([])
    const [topPositions, setTopPositions] = useState([])
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
    const [activeAnnouncement, setActiveAnnouncement] = useState<any>({})
    const [showBetaModal, setShowBetaModal] = useState(false)

    useEffect(() => {
        document.title = 'Welcome to Houston ARTCC!'
        axiosInstance
            .get('/api/connections/online/')
            .then(res => setOnlineControllers(res.data))
        axiosInstance
            .get('/api/announcements/recent/')
            .then(res => setAnnouncements(res.data.slice(0, 3)))
        axiosInstance
            .get('/api/events/')
            .then(res => setEvents(res.data.filter(event => !event.hidden).slice(0, 2)))
        axiosInstance
            .get('/api/users/newest/')
            .then(res => setNewestControllers(res.data))
        axiosInstance
            .get('/api/connections/top/controllers/')
            .then(res => setTopControllers(res.data.slice(0, 3)))
        axiosInstance
            .get('/api/connections/top/positions/')
            .then(res => setTopPositions(res.data.slice(0, 3)))

        if ((window.location.hostname === 'beta.zhuartcc.org' || window.location.hostname === 'www.zhuartcc.devel') && !localStorage.getItem('hasVisited')) {
            localStorage.setItem('hasVisited', 'true')
            setShowBetaModal(true)
        }
    }, [])

    const OnlineController = ({ controller }) => (
        <li className="li-flex font-w500" style={onlineControllers?.length > 5 && window.innerWidth >= 768 ? {width: '50%'} : {}}>
            <Badge variant="primary" className="mr-2">{controller.callsign}</Badge>
            {controller.user.first_name} {controller.user.last_name}
        </li>
    )

    const Announcement = ({ announcement }) => (
        <Link onClick={() => {
            setShowAnnouncementModal(true)
            setActiveAnnouncement(announcement)
        }}>
            <Card>
                <Card.Body>
                    <Badge variant="primary" className="announcment-date">{format(new Date(announcement.posted), 'MMM d, Y')}</Badge>
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

    const Event = ({ event }) => (
        <Link to={'/events/' + event.id}>
            <Card>
                <Card.Body>
                    <Row>
                        <Col xs={12} lg={6}>
                            <h5 className="text-black font-w700 mb-0">{event.name}</h5>
                            <h6 className="text-gray font-w500 mb-3">Presented by {event.host}</h6>
                            <div className="li-flex">
                                <HiOutlineCalendar size={25} className="mr-2"/>
                                <p className="font-w500 font-md mb-0">{format(new Date(event.start), 'MMM d, Y')}</p>
                            </div>
                            <div className="li-flex mb-0">
                                <HiOutlineClock size={25} className="mr-2"/>
                                <p className="font-w500 font-md mb-0">{format(new Date(event.start), 'HH:mm zzz')} →&nbsp;</p>
                                <p className="font-w500 font-md mb-0">{format(new Date(event.end), 'HH:mm zzz')}</p>
                            </div>
                        </Col>
                        <Col xs={12} lg={6} className="d-flex flex-row-reverse">
                            <img className="event-banner-sm align-self-center" src={event.banner} alt={event.name}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Link>
    )

    const NewestController = ({ controller }) => (
        <li className="li-flex text-darkgray font-w500 font-lg">
            <img
                className="profile-md mr-2"
                src={process.env.REACT_APP_API_URL + controller.profile}
                alt={controller.first_name + ' ' + controller.last_name}
            />
            {controller.first_name} {controller.last_name} ({controller.initials})
        </li>
    )

    const TopController = ({ controller, place }) => (
        <li className="li-flex">
            <IoTrophy className={`fill-${place === 0 ? 'gold' : place === 1 ? 'silver' : 'bronze'} mr-2`} size={45}/>
            <div className="text-darkgray font-w500 font-lg">
                {controller.first_name} {controller.last_name}
                <br/><span className="text-gray">{formatDurationStr(controller.hours)}</span>
            </div>
        </li>
    )

    const TopPosition = ({ position, place }) => (
        <li className="li-flex">
            <IoIosAirplane className={`fill-${place === 0 ? 'gold' : place === 1 ? 'silver' : 'bronze'} mr-2`} size={45}/>
            <div className="text-darkgray font-w500 font-lg">
                {getPositionName(position.position)}
                <br/><span className="text-gray">{formatDurationStr(position.hours)}</span>
            </div>
        </li>
    )

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
                        <Col sm={12} xl={onlineControllers?.length > 5 ? 6 : 7} className="mb-4 mb-xl-0">
                            <h1 className="text-black font-w700 mb-1">Virtual Houston ARTCC</h1>
                            <h4 className="text-gray mb-4">Part of VATUSA & the VATSIM Network.</h4>
                            <p>Welcome to the Virtual Houston Air Route Traffic Control Center! Encompassing an airspace of approximately 280,000
                                square miles in parts of Texas, Louisiana, Mississippi, and Alabama, Houston has a diverse selection of
                                destinations for you to choose from along with the professional air traffic control services to support your
                                flight.</p>
                        </Col>
                        <Col sm={12} xl={onlineControllers?.length > 5 ? 5 : 3} className="mb-4 mb-xl-0">
                            <h2 className="text-black mb-3">Who's Online?</h2>
                            <ul className={'p-0 ' + (onlineControllers?.length > 5 ? 'd-flex flex-wrap' : '')}>
                                {onlineControllers?.length > 0
                                    ? onlineControllers.map(controller => <OnlineController controller={controller}/>)
                                    : <p>Nobody is online.</p>
                                }
                            </ul>
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col sm={12} xl={6} className="mb-4 mb-xl-0">
                            <h2 className="text-black mb-1 text-break">Announcements</h2>
                            <h6 className="text-gray mb-4">What's happening at Houston?</h6>
                            {announcements?.length > 0
                                ? announcements.map(announcement => <Announcement announcement={announcement}/>)
                                : <p>There are no announcements.</p>
                            }
                        </Col>
                        <Col sm={12} xl={6} className="mb-4 mb-xl-0">
                            <h2 className="text-black mb-1">Events</h2>
                            <h6 className="text-gray mb-4">Are y'all busy?</h6>
                            {events?.length > 0
                                ? events.map(event => <Event event={event}/>)
                                : <p>There are no planned events.</p>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col className="mb-4 mb-xl-0">
                            <h2 className="text-black mb-3">Newest Controllers</h2>
                            <ul className="p-0">
                                {newestControllers?.length > 0
                                    ? newestControllers.map(controller => <NewestController controller={controller}/>)
                                    : <p>Not enough data.</p>
                                }
                            </ul>
                        </Col>
                        <Col className="mb-4 mb-xl-0">
                            <h2 className="text-black mb-3">Top Controllers</h2>
                            <ul className="p-0">
                                {topControllers?.length > 0
                                    ? topControllers.map((controller, index) => <TopController controller={controller} place={index}/>)
                                    : <p>Not enough data.</p>
                                }
                            </ul>
                        </Col>
                        <Col>
                            <h2 className="text-black mb-3">Top Positions</h2>
                            <ul className="p-0">
                                {topPositions?.length > 0
                                    ? topPositions.map((position, index) => <TopPosition position={position} place={index}/>)
                                    : <p>Not enough data.</p>
                                }
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </Fade>
            <Modal
                size="lg"
                show={showAnnouncementModal}
                onHide={() => setShowAnnouncementModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{activeAnnouncement.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {activeAnnouncement.body ? parse(activeAnnouncement.body) : ''}
                </Modal.Body>
            </Modal>
            <Modal
                size="lg"
                show={showBetaModal}
                centered
                onHide={() => setShowBetaModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Welcome to the Beta Website</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Hi there!</p>
                    <p>Thanks for checking out the fancy new beta website for the Houston ARTCC! <b>However, please note that this website is an isolated sandbox environment!</b></p>
                    <p>This means that all information on this website is not up to date and does not reflect current facility operations, statistics, and data. Additionally, any information that you enter will not be officially recorded.</p>
                    <p>For current controller resources, training requests, feedback, and event position requests, please visit to the production website at <a href="https://zhuartcc.org">https://zhuartcc.org</a>.</p>
                    <p>This website will remain online for beta testing of new features and I encourage all of you to continue to look for errors or bugs.</p>
                    <p className="mb-0"><b>Michael Romashov</b></p>
                    <p className="mb-0"><b>wm@zhuartcc.org</b></p>
                    <p><b>Webmaster</b></p>
                </Modal.Body>
            </Modal>
        </>
    )
}

// TODO: Add scroll indicator below main header.
