import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Calendar from '@toast-ui/react-calendar'
import { tuiCalendars, tuiTemplates, tuiTheme, tuiTimezones } from '../helpers/constants'
import moment from 'moment'
import axiosInstance from '../helpers/axiosInstance'
import { typeDisplay } from '../helpers/utils'

export default class TuiCalendar extends Component<any, any> {
    calendarRef = React.createRef<Calendar>()

    constructor(props) {
        super(props)
        this.state = {
            events: [],
            sessions: [],
            schedules: [],
            requested: [],
            current: moment(),
        }
        this.handlePrev = this.handlePrev.bind(this)
        this.handleToday = this.handleToday.bind(this)
        this.handleNext = this.handleNext.bind(this)
    }

    componentDidMount() {
        this.fetchCalendar()
    }

    fetchCalendar() {
        let year = this.state.current.year()
        let month = this.state.current.month() + 1
        if (!this.state.requested.includes(year.toString() + month.toString())) {
            Promise.all([
                axiosInstance
                    .get('/api/calendar/events/' + year + '/' + month + '/')
                    .then(res => {
                        this.setState({ events: res.data })
                    }),
                axiosInstance
                    .get('/api/calendar/training/' + year + '/' + month + '/')
                    .then(res => {
                        this.setState({ sessions: res.data })
                    })
            ]).then(() => {
                this.setState({ requested: [...this.state.requested, year.toString() + month.toString()] })
                this.createSchedules()
            })
        }
    }

    createSchedules() {
        let schedules: object[] = [...this.state.schedules]
        this.state.events.forEach(event => {
            schedules.push({
                id: event.id,
                calendarId: 0,
                title: event.name,
                location: event.host,
                category: 'time',
                customStyle: 'btn',
                color: '#ffffff',
                isReadOnly: true,
                isAllDay: this.props.eventsAllDay,
                start: moment(event.start).toISOString(),
                end: moment(event.end).toISOString()
            })
        })
        this.state.sessions.forEach(session => {
            schedules.push({
                id: session.id,
                calendarId: 1,
                title: session.student.first_name + ' ' + session.student.last_name + '\'s ' + typeDisplay(session.type) + ' Session',
                location: session.position,
                category: 'time',
                isReadOnly: true,
                start: moment(session.start).toISOString(),
                end: moment(session.end).toISOString()
            })
        })
        this.setState({schedules: schedules})
    }

    handlePrev() {
        let cal = this.calendarRef.current?.getInstance()
        cal?.prev()
        this.updateCalendar(cal)
    }

    handleToday() {
        let cal = this.calendarRef.current?.getInstance()
        cal?.today()
        this.updateCalendar(cal)
    }

    handleNext() {
        let cal = this.calendarRef.current?.getInstance()
        cal?.next()
        this.updateCalendar(cal)
    }

    updateCalendar(calRef) {
        this.setState(
            { current: moment(calRef?.getDate().toDate()) },
            () => this.fetchCalendar()
        )
    }

    render() {
        return (
            <>
                <div className="text-center mb-5">
                    <h1>{this.state.current.format('MMMM YYYY')}</h1>
                    <Button variant="lightgray" className="mr-2 btn-sm" onClick={this.handlePrev}>&lt; Previous</Button>
                    <Button variant="lightgray" className="mr-2 btn-sm" onClick={this.handleToday}>Today</Button>
                    <Button variant="lightgray" className="btn-sm" onClick={this.handleNext}>Next &gt;</Button>
                </div>
                <Calendar
                    ref={this.calendarRef}
                    height="800px"
                    view={this.props.view}
                    taskView={false}
                    useDetailPopup={true}
                    isReadOnly={this.props.isReadOnly || false}
                    onBeforeCreateSchedule={this.props.onCreateSchedule}
                    schedules={this.state.schedules}
                    calendars={tuiCalendars}
                    timezones={tuiTimezones}
                    template={tuiTemplates}
                    theme={tuiTheme}
                />
            </>
        )
    }
}