import React, { useEffect } from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import { Route, Switch, useHistory, useLocation } from 'react-router'
import { RiErrorWarningLine } from 'react-icons/all'
import { Alert, Col, Row } from 'react-bootstrap'
import qs from 'qs'
import { getFullName } from './Helpers'
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
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import { useSnackbar } from 'notistack'

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
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
                        <p className="m-0">
                            <b>Disclaimer!</b> All information on this website is for flight simulation use only and is not to be used for
                            real world navigation or flight. This site is not affiliated with ICAO, the FAA, the actual Houston ARTCC, or
                            any other real world aerospace entity.
                        </p>
                    </Alert>
                </Col>
            </Row>
            <div className="bg-darkgray text-center p-5">
                <h5 className="text-white font-w300 mb-3"><b className="font-w500">Copyright 2021</b> Virtual Houston ARTCC. All Rights Reserved.</h5>
                <div className="d-flex justify-content-center" id="footer-links">
                    <a href="https://vatsim.net" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">VATSIM</h6></a>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <a href="https://vatusa.net" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">VATUSA</h6></a>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <Link to="/privacy"><h6 className="text-lightgray font-w300">Privacy Policy</h6></Link>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <Link to="/feedback"><h6 className="text-lightgray font-w300">Feedback</h6></Link>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <a href="https://discord.gg/Ag2cdZz" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">Discord</h6></a>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <a href="https://github.com/Houston-ARTCC" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">GitHub</h6></a>
                </div>
            </div>
        </BrowserRouter>
    )
}

function Login() {
    let { search } = useLocation()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    const auth_code = new URLSearchParams(search).get('code')

    useEffect(() => {
        if (auth_code) {
            axiosInstance
                .post('/auth/token/', qs.stringify({ code: auth_code }))
                .then(res => {
                    localStorage.setItem('access', res.data.access)
                    localStorage.setItem('refresh', res.data.refresh)
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access

                    enqueueSnackbar('Logged in as ' + getFullName(), {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
                .catch(err => {
                    enqueueSnackbar(err.toString(), {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
                .finally(() => history.push('/'))

        } else {
            window.location.href = 'https://auth.vatsim.net/oauth/authorize?client_id=593&redirect_uri=http://www.zhuartcc.devel/login&response_type=code&scope=full_name+vatsim_details+email'
        }
    })
    return <LoadingScreen/>
}

function Logout() {
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        delete axiosInstance.defaults.headers['Authorization']

        enqueueSnackbar('You have been logged out, see you soon!', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            },
        })

        history.push('/')
    })
    return <LoadingScreen/>
}
