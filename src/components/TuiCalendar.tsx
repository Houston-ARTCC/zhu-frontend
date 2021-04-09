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
            bookings: [],
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
            axiosInstance
                .get('/api/calendar/' + year + '/' + month + '/')
                .then(res => {
                    this.setState({
                        requested: [...this.state.requested, year.toString() + month.toString()],
                        events: res.data.events,
                        sessions: res.data.sessions,
                        bookings: res.data.bookings,
                    }, () => this.createSchedules())
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
                isReadOnly: true,
                start: event.start,
                end: event.end,
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
                start: session.start,
                end: session.end,
            })
        })
        this.state.bookings.forEach(booking => {
            schedules.push({
                id: booking.id,
                calendarId: 3,
                title: booking.callsign + ' [' + booking.user.first_name + ' ' + booking.user.last_name + ']',
                location: booking.callsign,
                category: 'time',
                isReadOnly: true,
                start: booking.start,
                end: booking.end,
            })
        })
        this.setState({ schedules: schedules })
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
                    schedules={this.state.schedules.concat(this.props.additionalSchedules || [])}
                    calendars={tuiCalendars}
                    timezones={tuiTimezones}
                    template={tuiTemplates}
                    theme={tuiTheme}
                />
            </>
        )
    }
}