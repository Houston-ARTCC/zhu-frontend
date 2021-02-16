import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Container } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Header from './components/Header'
import axiosInstance from './axiosInstance'
import Navigation from './components/Navigation'
import Calendar from '@toast-ui/react-calendar'
import 'tui-calendar/dist/tui-calendar.css'
import moment from 'moment'
import 'moment-timezone'

export default class ARTCCCalendar extends Component<any, any> {
    private calendarRef = React.createRef<Calendar>()

    constructor(props) {
        super(props)
        this.state = {
            events: [],
            sessions: [],
            schedules: [],
            current: moment(),
        }
        this.handlePrev = this.handlePrev.bind(this)
        this.handleToday = this.handleToday.bind(this)
        this.handleNext = this.handleNext.bind(this)
    }

    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events')
            .then(res => {
                this.setState({ events: res.data })
                this.createSchedules()
            })
    }

    createSchedules() {
        let schedules: object[] = []
        this.state.events.forEach(event => {
            schedules.push({
                id: event.id,
                calendarId: 0,
                title: event.name,
                location: event.host,
                body: event.description,
                category: 'time',
                dueDateClass: '',
                start: moment(event.start).toISOString(),
                end: moment(event.end).toISOString()
            })
        })
        this.setState({schedules: schedules})
    }

    handlePrev() {
        let cal = this.calendarRef.current?.getInstance()
        cal?.prev()
        this.setState({ current: moment(cal?.getDate().toDate()) })
    }

    handleToday() {
        let cal = this.calendarRef.current?.getInstance()
        cal?.today()
        this.setState({ current: moment(cal?.getDate().toDate()) })
    }

    handleNext() {
        let cal = this.calendarRef.current?.getInstance()
        cal?.next()
        this.setState({ current: moment(cal?.getDate().toDate()) })
    }

    render() {

        return (
            <div>
                <Navigation/>
                <Header title="ARTCC Calendar"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <div className="text-center mb-5">
                            <h1>{this.state.current.format('MMMM YYYY')}</h1>
                            <Button variant="lightgray" className="mr-2 btn-sm" onClick={this.handlePrev}>&lt; Previous</Button>
                            <Button variant="lightgray" className="mr-2 btn-sm" onClick={this.handleToday}>Today</Button>
                            <Button variant="lightgray" className="btn-sm" onClick={this.handleNext}>Next &gt;</Button>
                        </div>
                        <Calendar
                            ref={this.calendarRef}
                            height="800px"
                            isReadOnly={true}
                            view="month"
                            useDetailPopup={true}
                            schedules={this.state.schedules}
                            calendars={[
                                {
                                    id: '0',
                                    name: 'Events',
                                    bgColor: '#F7685B',
                                    borderColor: '#F7685B'
                                }
                            ]}
                            template={{
                                'popupDetailDate': (isAllDay, start, end) => {
                                    let tz = moment.tz.guess()
                                    // @ts-ignore
                                    let momentStart = moment(start.toDate()).tz(tz)
                                    // @ts-ignore
                                    let momentEnd = moment(end.toDate()).tz(tz)
                                    // @ts-ignore
                                    let isSameDate = momentStart.date() === momentEnd.date()

                                    return moment(momentStart).format('MMM. DD, YYYY, HH:mm z -') + ' ' +
                                        moment(momentEnd).format((isSameDate ? '' : 'MMM DD, YYYY, ') + 'HH:mm z')
                                },
                            }}
                            theme={{
                                'common.backgroundColor': 'transparent',
                                'common.todayColor': 'black'
                            }}
                        />
                    </Container>
                </Fade>
            </div>
        )
    }
}

// TODO: Optimize pulling calendar events to only current month.
