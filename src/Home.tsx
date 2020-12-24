import { Component } from 'react'
import { Alert, Badge, Card, Col, Container, Row } from 'react-bootstrap'
import { HiOutlineCalendar, HiOutlineClock, IoIosAirplane, IoTrophy, RiErrorWarningLine } from 'react-icons/all'
import { Parallax } from 'react-parallax'
import Fade from 'react-reveal/Fade'
import background from './img/homepage-bg.jpg'
import profile from './img/profile.png'
import herb from './img/herb.jpg'
import zhu from './img/zhu.gif'

export default class Home extends Component<any, any> {
    render() {
        return (
            <div>
                <Parallax bgImage={background} strength={250}>
                    <div id="homepage-hero">
                        <h4 className="text-white font-w500" id="tagline">From longhorns to space ships, we've got it all!</h4>
                        <h1 className="text-white font-w700" id="welcome">Welcome to Houston</h1>
                    </div>
                </Parallax>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row className="justify-content-between mb-5">
                            <Col sm={12} xl={7}>
                                <h1 className="text-black font-w700 mb-1">Virtual Houston ARTCC</h1>
                                <h4 className="text-gray font-w700 mb-4">Part of VATUSA & the VATSIM Network.</h4>
                                <p>Welcome to the Virtual Houston Air Route Traffic Control Center! Encompassing an airspace of approximately 280,000
                                    square miles in parts of Texas, Louisiana, Mississippi, and Alabama, Houston has a diverse selection of
                                    destinations for you to choose from along with the professional air traffic control services to support your
                                    flight.</p>
                            </Col>
                            <Col sm={12} xl={3}>
                                <h2 className="text-black font-w500 mb-3">Who's Online?</h2>
                                <ul className="p-0">
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <div className="badge badge-primary font-w700 mr-2">HOU_81_CTR</div>
                                        Ethan Hawes
                                    </li>
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <Badge variant="primary" className="font-w700 mr-2">MSY_TWR</Badge> Matthew Rogers
                                    </li>
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <Badge variant="primary" className="font-w700 mr-2">CRP_APP</Badge> Elijah Whitaker
                                    </li>
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <Badge variant="primary" className="font-w700 mr-2">HOU_D_APP</Badge> Josue Rivera
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col sm={12} xl={6}>
                                <h1 className="text-black font-w700 mb-1">Announcements</h1>
                                <h4 className="text-gray font-w700 mb-4">What's happening at Houston?</h4>
                                <Card>
                                    <div className="badge badge-primary announcment-date">Dec. 25, 2020</div>
                                    <h5 className="text-black font-w700">Happy Holidays from Houston!</h5>
                                    <div className="user">
                                        <img className="profile-sm mr-2" src={profile} alt="Michael Romashov"/>
                                        <p className="text-dark-gray font-w500 m-0">Marcus Miller</p>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="badge badge-primary announcment-date">Dec. 18, 2020</div>
                                    <h5 className="text-black font-w700">Welcome to the Refined Houston Experience!</h5>
                                    <div className="user">
                                        <img className="profile-sm mr-2" src={profile} alt="Michael Romashov"/>
                                        <p className="text-dark-gray font-w500 m-0">Michael Romashov</p>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="badge badge-primary announcment-date">Nov. 25, 2020</div>
                                    <h5 className="text-black font-w700">Houston Events Department Survey</h5>
                                    <div className="user">
                                        <img className="profile-sm mr-2" src={profile} alt="Michael Romashov"/>
                                        <p className="text-dark-gray font-w500 m-0">Ryan Drozd</p>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm={12} xl={6}>
                                <h1 className="text-black font-w700 mb-1">Events</h1>
                                <h4 className="text-gray font-w700 mb-4">Are y'all busy?</h4>
                                <Card>
                                    <Row>
                                        <Col>
                                            <h5 className="text-black font-w700 m-0">Fireworks Over Lake Houston</h5>
                                            <h6 className="text-gray font-w500 mb-3">Presented by Houston ARTCC</h6>
                                            <div className="li-flex font-w500 font-md">
                                                <HiOutlineCalendar size={25} className="mr-2"/> January 2, 2021
                                            </div>
                                            <div className="li-flex font-w500 font-md">
                                                <HiOutlineClock size={25} className="mr-2"/> 18:59 EST → 23:00 EST
                                            </div>
                                        </Col>
                                        <Col className="text-right overflow-hidden">
                                            <img className="event-banner" src={zhu} alt="Fireworks Over Lake Houston"/>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card>
                                    <Row>
                                        <Col>
                                            <h5 className="text-black font-w700 m-0">Honoring Herb</h5>
                                            <h6 className="text-gray font-w500 mb-3">Presented by Southwest Virtual Airlines</h6>
                                            <div className="li-flex font-w500 font-md">
                                                <HiOutlineCalendar size={25} className="mr-2"/> January 3, 2021
                                            </div>
                                            <div className="li-flex font-w500 font-md">
                                                <HiOutlineClock size={25} className="mr-2"/> 16:00 EST → 19:00 EST
                                            </div>
                                        </Col>
                                        <Col className="text-right m-0">
                                            <img className="event-banner" src={herb} alt="Honoring Herb"/>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col>
                                <h2 className="text-black font-w500 mb-3">Newest Controllers</h2>
                                <ul className="p-0">
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <img className="profile-md mr-2" src={profile} alt="Michael Romashov"/> Conner Hopkins (CH)
                                    </li>
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <img className="profile-md mr-2" src={profile} alt="Michael Romashov"/> Leszek Kwasniowski (LK)
                                    </li>
                                    <li className="li-flex text-black font-w700 font-lg">
                                        <img className="profile-md mr-2" src={profile} alt="Michael Romashov"/> Derek Ang (DA)
                                    </li>
                                </ul>
                            </Col>
                            <Col>
                                <h2 className="text-black font-w500 mb-3">Top Controllers</h2>
                                <ul className="p-0">
                                    <li className="li-flex">
                                        <IoTrophy className="fill-gold mr-2" size={45}/>
                                        <div className="text-black font-w700 font-lg">
                                            John Quaziz
                                            <br/><span className="text-gray font-w500">53h 50m</span>
                                        </div>
                                    </li>
                                    <li className="li-flex text-black font-w700">
                                        <IoTrophy className="fill-silver mr-2" size={45}/>
                                        <div className="text-black font-w700 font-lg">
                                            Marcus Miller
                                            <br/><span className="text-gray font-w500">28h 33m</span>
                                        </div>
                                    </li>
                                    <li className="li-flex text-black font-w700">
                                        <IoTrophy className="fill-bronze mr-2" size={45}/>
                                        <div className="text-black font-w700 font-lg">
                                            Joshua Seagrave
                                            <br/><span className="text-gray font-w500">19h 37m</span>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                            <Col>
                                <h2 className="text-black font-w500 mb-3">Top Positions</h2>
                                <ul className="p-0">
                                    <li className="li-flex">
                                        <IoIosAirplane className="fill-gold mr-2" size={45}/>
                                        <div className="text-black font-w700 font-lg">
                                            Houston Center
                                            <br/><span className="text-gray font-w500">53h 50m</span>
                                        </div>
                                    </li>
                                    <li className="li-flex text-black font-w700">
                                        <IoIosAirplane className="fill-silver mr-2" size={45}/>
                                        <div className="text-black font-w700 font-lg">
                                            Houston Ground
                                            <br/><span className="text-gray font-w500">28h 33m</span>
                                        </div>
                                    </li>
                                    <li className="li-flex text-black font-w700">
                                        <IoIosAirplane className="fill-bronze mr-2" size={45}/>
                                        <div className="text-black font-w700 font-lg">
                                            Austin Approach
                                            <br/><span className="text-gray font-w500">19h 37m</span>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={6}>
                                <Alert variant="primary" className="d-flex m-0">
                                    <RiErrorWarningLine className="fill-primary mr-3" size={75} preserveAspectRatio="xMaxYMin"/>
                                    <p className="text-primary m-0">
                                        <b>Disclaimer!</b> All information on this website is for flight simulation use only and is not to be used for
                                        real world navigation or flight. This site is not affiliated with ICAO, the FAA, the actual Houston ARTCC, or
                                        any other real world aerospace entity.
                                    </p>
                                </Alert>
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </div>
        );
    }
}
