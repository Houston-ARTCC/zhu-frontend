import React, { useEffect, useState } from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import { Route, Switch, useLocation } from 'react-router'
import { RiErrorWarningLine } from 'react-icons/all'
import { Alert, Button, Col, Nav, Navbar, NavbarBrand, Row } from 'react-bootstrap'
import qs from 'qs'
import logoLight from './img/logo-light.png'
import logoColor from './img/logo.png'
import { getFullName, parseJWT } from './Helpers'
import axiosInstance from './axiosInstance'
import Home from './Home'
import AllEvents from './EventViews/AllEvents'
import ViewEvent from './EventViews/ViewEvent'
import EditEvent from './EventViews/EditEvent'
import Roster from './UserViews/Roster'
import Profile from './UserViews/Profile'
import EditUser from './UserViews/EditUser'
import AllResources from './ResourceViews/AllResources'
import Theme from './Theme'
import Error404 from './ErrorViews/Error404'
import Privacy from './Privacy'
import ScrollToTop from './ScrollToTop'

export default function App() {
    const [scroll, setScroll] = useState(false);

    useEffect(() => window.addEventListener('scroll', () => setScroll(window.scrollY > 50)), [])

    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Navbar id="navbar" className={scroll ? 'navbar-shrink' : ''}>
                <Link to="/">
                    <NavbarBrand>
                        <img src={scroll ? logoColor : logoLight} alt="Logo"/>
                        <h6 className={(scroll ? 'text-black' : 'text-white') + ' font-w700 m-0'}>Houston ARTCC</h6>
                    </NavbarBrand>
                </Link>
                <Nav>
                    <Nav.Link className={scroll ? 'text-black' : ''}>Calendar</Nav.Link>
                    <Nav.Link className={scroll ? 'text-black' : ''}>Events</Nav.Link>
                    <Nav.Link className={scroll ? 'text-black' : ''}>Pilots</Nav.Link>
                    <Nav.Link className={scroll ? 'text-black' : ''}>Controllers</Nav.Link>
                    {parseJWT()
                        ? <Nav.Link className={scroll ? 'text-black' : ''}>{getFullName()}</Nav.Link>
                        : <Nav.Item className="ml-4">
                            <Link to="/login">
                                <Button variant="vatsim">
                                    <span className="font-w700">Login with VATSIM</span>
                                </Button>
                            </Link>
                        </Nav.Item>
                    }
                </Nav>
            </Navbar>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/events" component={AllEvents}/>
                <Route exact path="/events/:id(\d+)" component={ViewEvent}/>
                <Route exact path="/events/:id(\d+)/edit" component={EditEvent}/>
                <Route exact path="/roster" component={Roster}/>
                <Route exact path="/roster/:cid(\d+)" component={Profile}/>
                <Route exact path="/roster/:cid(\d+)/edit" component={EditUser}/>
                <Route exact path="/resources" component={AllResources}/>
                <Route exact path="/theme" component={Theme}/>
                <Route exact path="/privacy" component={Privacy}/>
                <Route component={Error404}/>
            </Switch>
            <Row className="justify-content-center mb-5">
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
            <div className="bg-dark-gray text-center p-5">
                <h5 className="text-white font-w300 mb-3"><b className="font-w500">Copyright 2020</b> Virtual Houston ARTCC. All Rights Reserved.</h5>
                <div className="d-flex justify-content-center" id="footer-links">
                    <a href="https://vatsim.net" target="_blank"><h6 className="text-light-gray font-w300">VATSIM</h6></a>
                    <h6 className="text-light-gray font-w300">→</h6>
                    <a href="https://vatusa.net" target="_blank"><h6 className="text-light-gray font-w300">VATUSA</h6></a>
                    <h6 className="text-light-gray font-w300">→</h6>
                    <Link to="/privacy"><h6 className="text-light-gray font-w300">Privacy Policy</h6></Link>
                    <h6 className="text-light-gray font-w300">→</h6>
                    <Link to="/feedback"><h6 className="text-light-gray font-w300">Feedback</h6></Link>
                    <h6 className="text-light-gray font-w300">→</h6>
                    <a href="https://discord.gg/Ag2cdZz" target="_blank"><h6 className="text-light-gray font-w300">Discord</h6></a>
                    <h6 className="text-light-gray font-w300">→</h6>
                    <a href="https://github.com/Houston-ARTCC" target="_blank"><h6 className="text-light-gray font-w300">GitHub</h6></a>
                </div>
            </div>
        </BrowserRouter>
    );
}

function Login() {
    let { search } = useLocation()
    const auth_code = new URLSearchParams(search).get('code')

    useEffect(() => {
        if (auth_code) {
            axiosInstance
                .post('/auth/token/', qs.stringify({ code: auth_code }))
                .then(res => {
                    localStorage.setItem('access', res.data.access)
                    localStorage.setItem('refresh', res.data.refresh)
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access
                    window.location.href = '/'
                })
                .catch(err => console.log(err))
        } else {
            window.location.href = 'https://auth.vatsim.net/oauth/authorize?client_id=593&redirect_uri=http://www.zhuartcc.devel/login&response_type=code&scope=full_name+vatsim_details+email'
        }
    })
    return null
}

function Logout() {
    useEffect(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        delete axiosInstance.defaults.headers['Authorization']
        window.location.href = '/'
    })
    return null
}
