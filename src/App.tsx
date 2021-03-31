import React from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
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
import Error404 from './pages/errors/Error404'
import Events from './pages/events/Events'
import EditEvent from './pages/events/EditEvent'
import ViewEvent from './pages/events/ViewEvent'
import NewEvent from './pages/events/NewEvent'
import TrainingCenter from './pages/training/TrainingCenter'
import Exams from './pages/training/views/Exams'
import Sessions from './pages/training/views/Sessions'
import RequestTraining from './pages/training/views/RequestTraining'
import ScheduledSessions from './pages/training/views/ScheduledSessions'
import TrainingRequests from './pages/training/views/TrainingRequests'
import StudentProfile from './pages/training/views/StudentProfile'
import AssignExam from './pages/training/views/AssignExam'
import MentorHistory from './pages/training/views/MentorHistory'
import LoaRequests from './pages/admin/views/LoaRequests'
import ActionLog from './pages/admin/views/ActionLog'
import AdminPanel from './pages/admin/AdminPanel'
import Announcements from './pages/admin/views/Announcements'
import AdminHome from './pages/admin/views/AdminHome'
import FindUser from './pages/admin/views/FindUser'
import RosterPurge from './pages/admin/views/RosterPurge'
import VisitingRequests from './pages/admin/views/VisitingRequests'
import PendingFeedback from './pages/admin/views/PendingFeedback'
import SupportRequests from './pages/admin/views/SupportRequests'
import Broadcast from './pages/admin/views/Broadcast'
import Footer from './components/Footer'
import AuthRoute from './components/AuthRoute'
import ScrollToTop from './components/ScrollToTop'
import { Login, Logout } from './components/Auth'
import { isAdmin, isAuthenticated, isMember, isSeniorStaff, isStaff, isTrainingStaff } from './helpers/auth'

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
                <AuthRoute exact path="/training/sessions" component={TrainingCenter} view={Sessions} auth={isMember}/>
                <AuthRoute exact path="/training/request" component={TrainingCenter} view={RequestTraining} auth={isMember}/>
                <AuthRoute exact path="/training/exams" component={TrainingCenter} view={Exams} auth={isMember}/>
                <AuthRoute exact path="/training/schedule" component={TrainingCenter} view={ScheduledSessions} auth={isTrainingStaff}/>
                <AuthRoute exact path="/training/requests" component={TrainingCenter} view={TrainingRequests} auth={isTrainingStaff}/>
                <AuthRoute exact path="/training/profile" component={TrainingCenter} view={StudentProfile} auth={isTrainingStaff}/>
                <AuthRoute exact path="/training/mentor" component={TrainingCenter} view={MentorHistory} auth={isTrainingStaff}/>
                <AuthRoute exact path="/training/assign" component={TrainingCenter} view={AssignExam} auth={isTrainingStaff}/>
                {/* Adiministration */}
                <AuthRoute exact path="/admin" component={AdminPanel} view={AdminHome} auth={isStaff}/>
                <AuthRoute exact path="/admin/log" component={AdminPanel} view={ActionLog} auth={isStaff}/>
                <AuthRoute exact path="/admin/visit" component={AdminPanel} view={VisitingRequests} auth={isAdmin}/>
                <AuthRoute exact path="/admin/feedback" component={AdminPanel} view={PendingFeedback} auth={isSeniorStaff}/>
                <AuthRoute exact path="/admin/support" component={AdminPanel} view={SupportRequests} auth={isStaff}/>
                <AuthRoute exact path="/admin/user" component={AdminPanel} view={FindUser} auth={isStaff}/>
                <AuthRoute exact path="/admin/purge" component={AdminPanel} view={RosterPurge} auth={isAdmin}/>
                <AuthRoute exact path="/admin/loa" component={AdminPanel} view={LoaRequests} auth={isAdmin}/>
                <AuthRoute exact path="/admin/announcement" component={AdminPanel} view={Announcements} auth={isStaff}/>
                <AuthRoute exact path="/admin/broadcast" component={AdminPanel} view={Broadcast} auth={isStaff}/>
                {/* Miscellaneous */}
                <Route exact path="/map" component={Map}/>
                <Route exact path="/theme" component={Theme}/>
                <Route exact path="/privacy" component={Privacy}/>
                <Route exact path="/statistics" component={Statistics}/>
                <Route exact path="/calendar" component={ARTCCCalendar}/>
                <AuthRoute exact path="/feedback" component={Feedback}/>
                <Route component={Error404}/>
            </Switch>
            <Footer/>
        </BrowserRouter>
    )
}
