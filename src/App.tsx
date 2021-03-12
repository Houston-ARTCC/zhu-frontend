import React, { useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'
import { RiErrorWarningLine } from 'react-icons/all'
import { Alert, Col } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import ARTCCCalendar from './pages/Calendar'
import Statistics from './pages/Statistics'
import Resources from './pages/Resources'
import Feedback from './pages/Feedback'
import Privacy from './pages/Privacy'
import Map from './pages/Map'
import Home from './pages/Home'
import Theme from './pages/Theme'
import Visit from './pages/Visit'
import Staff from './pages/roster/Staff'
import Roster from './pages/roster/Roster'
import Profile from './pages/roster/Profile'
import EditUser from './pages/roster/EditUser'
import AdminPanel from './pages/admin/AdminPanel'
import Error404 from './pages/errors/Error404'
import Events from './pages/events/Events'
import EditEvent from './pages/events/EditEvent'
import ViewEvent from './pages/events/ViewEvent'
import NewEvent from './pages/events/NewEvent'
import TrainingCenter from './pages/training/TrainingCenter'
import AuthRoute from './components/AuthRoute'
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import axiosInstance from './helpers/axiosInstance'
import { getAuthURL, getFullName, isAuthenticated, isMember, isStaff } from './helpers/auth'
import Sessions from './pages/training/Sessions'
import RequestTraining from './pages/training/RequestTraining'
import Exams from './pages/training/Exams'

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Switch>
                <Route exact path="/" component={Home}/>
                {/* Auth */}
                <Route exact path="/login" component={Login}/>
                <Route exact path="/logout" component={Logout}/>
                {/* Events */}
                <Route exact path="/events" component={Events}/>
                <Route exact path="/events/:id(\d+)" component={ViewEvent}/>
                <AuthRoute exact path="/events/:id(\d+)/edit" component={EditEvent} auth={isStaff}/>
                <AuthRoute exact path="/events/new" component={NewEvent} auth={isStaff}/>
                {/* Roster */}
                <Route exact path="/staff" component={Staff}/>
                <Route exact path="/roster" component={Roster}/>
                <Route exact path="/roster/:cid(\d+)" component={Profile}/>
                <AuthRoute exact path="/roster/:cid(\d+)/edit" component={EditUser} auth={isStaff}/>
                {/* Resources */}
                <Route exact path="/resources" component={Resources}/>
                {/* Visiting */}
                <AuthRoute exact path="/visit" component={Visit} auth={isAuthenticated}/>
                {/* Training */}
                <AuthRoute exact path="/training" component={TrainingCenter} view={Sessions} auth={isMember}/>
                <AuthRoute exact path="/training/request" component={TrainingCenter} view={RequestTraining} auth={isMember}/>
                <AuthRoute exact path="/training/exams" component={TrainingCenter} view={Exams} auth={isMember}/>
                {/* Miscellaneous */}
                <Route exact path="/map" component={Map}/>
                <Route exact path="/theme" component={Theme}/>
                <Route exact path="/privacy" component={Privacy}/>
                <Route exact path="/statistics" component={Statistics}/>
                <Route exact path="/calendar" component={ARTCCCalendar}/>
                <AuthRoute exact path="/admin" component={AdminPanel} auth={isStaff}/>
                <AuthRoute exact path="/feedback" component={Feedback}/>
                <Route component={Error404}/>
            </Switch>
            <div className="d-flex justify-content-center mb-5">
                <Col xs={10} xl={6} className="position-unset">
                    <Alert variant="primary" className="position-unset d-flex m-0">
                        {/* TODO: Fix icon scaling on mobile devices. */}
                        <RiErrorWarningLine className="fill-primary mr-3" size={60} preserveAspectRatio="xMaxYMin"/>
                        <p className="m-0">
                            <b>Disclaimer!</b> All information on this website is for flight simulation use only and is not to be used for
                            real world navigation or flight. This site is not affiliated with ICAO, the FAA, the actual Houston ARTCC, or
                            any other real world aerospace entity.
                        </p>
                    </Alert>
                </Col>
            </div>
            <div className="bg-darkgray text-center p-4 p-xl-5">
                <h5 className="text-white font-w400 mb-3">&copy; 2021, Virtual Houston ARTCC. All Rights Reserved.</h5>
                <div className="d-flex flex-wrap justify-content-center" id="footer-links">
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

function Login(props) {
    let { search } = useLocation()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    const auth_code = new URLSearchParams(search).get('code')

    useEffect(() => {
        if (auth_code) {
            axiosInstance
                .post('/auth/token/', { code: auth_code })
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
                .finally(() => {
                    history.push(localStorage.getItem('login-referrer') || '/')
                    localStorage.removeItem('login-referrer')
                })
        } else {
            localStorage.setItem('login-referrer', props.location.state?.from.pathname || '/')
            window.location.href = getAuthURL()
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
