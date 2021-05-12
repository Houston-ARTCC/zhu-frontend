import { useEffect, useRef, useState } from 'react'
import { Badge, Button } from 'react-bootstrap'
import Calendar from '@toast-ui/react-calendar'
import { tuiCalendars, tuiTemplates, tuiTheme, tuiTimezones } from '../helpers/constants'
import axiosInstance from '../helpers/axiosInstance'
import { typeDisplay } from '../helpers/utils'
import { format, subMonths, addMonths, addDays } from 'date-fns'
import { FaCircle } from 'react-icons/all'

export default function TuiCalendar({ view = 'month', isReadOnly = false, onCreateSchedule = (event) => {}, additionalSchedules = undefined }) {
    const [events, setEvents] = useState<any>([])
    const [sessions, setSessions] = useState<any>([])
    const [bookings, setBookings] = useState<any>([])
    const [schedules, setSchedules] = useState<any>([])
    const [requested] = useState<any>([])
    const [current, setCurrent] = useState(new Date())

    const calendarRef = useRef<Calendar>(null)

    useEffect(() => fetchCalendar(), []) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => createEventSchedules(), [events]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => createSessionSchedules(), [sessions]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => createBookingSchedules(), [bookings]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchCalendar = () => {
        let prev = subMonths(current, 1)
        let next = addMonths(current, 1)
        requestCalendar(prev.getFullYear(), prev.getMonth() + 1)
        requestCalendar(current.getFullYear(), current.getMonth() + 1)
        requestCalendar(next.getFullYear(), next.getMonth() + 1)
    }

    const requestCalendar = (year, month) => {
        if (!requested.includes(year.toString() + month.toString())) {
            requested.push(year.toString() + month.toString())
            axiosInstance
                .get('/api/calendar/' + year + '/' + month + '/')
                .then(res => {
                    setEvents(res.data.events)
                    setSessions(res.data.sessions)
                    setBookings(res.data.bookings)
                })
        }
    }

    const createEventSchedules = () => {
        setSchedules(schedules.concat(
            events.map(event => ({
                id: event.id,
                calendarId: 0,
                title: event.name,
                location: event.host,
                category: 'time',
                isReadOnly: true,
                start: event.start,
                end: event.end,
            }))
        ))
    }

    const createSessionSchedules = () => {
        setSchedules(schedules.concat(
            sessions.map(session => ({
                id: session.id,
                calendarId: 1,
                title: session.student.first_name + ' ' + session.student.last_name + '\'s ' + typeDisplay(session.type) + ' Session',
                location: session.position !== 'N/A' && session.position,
                category: 'time',
                isReadOnly: true,
                start: session.start,
                end: session.end,
            }))
        ))
    }

    const createBookingSchedules = () => {
        setSchedules(schedules.concat(
            bookings.map(booking => ({
                id: booking.id,
                calendarId: 3,
                title: booking.callsign + ' [' + booking.user.first_name + ' ' + booking.user.last_name + ']',
                location: booking.callsign,
                category: 'time',
                isReadOnly: true,
                start: booking.start,
                end: booking.end,
            }))
        ))
    }

    const handlePrev = () => {
        let cal = calendarRef.current?.getInstance()
        cal?.prev()
        updateCalendar(cal)
    }

    const handleToday = () => {
        let cal = calendarRef.current?.getInstance()
        cal?.today()
        updateCalendar(cal)
    }

    const handleNext = () => {
        let cal = calendarRef.current?.getInstance()
        cal?.next()
        updateCalendar(cal)
    }

    const updateCalendar = (calRef) => {
        calRef?.render(true)
        let diff = calRef?.getDateRangeEnd().getTime() - calRef?.getDateRangeStart().getTime()
        let mean = Math.ceil(diff / (1000 * 3600 * 24 * 2))
        setCurrent(addDays(calRef?.getDateRangeStart().toDate(), mean))
        fetchCalendar()
    }

    return (
        <>
            <div className="text-center mb-4">
                <h1>{format(current, 'MMMM Y')}</h1>
                <Button variant="lightgray" className="mr-2 btn-sm" onClick={handlePrev}>&lt; Previous</Button>
                <Button variant="lightgray" className="mr-2 btn-sm" onClick={handleToday}>Today</Button>
                <Button variant="lightgray" className="btn-sm" onClick={handleNext}>Next &gt;</Button>
            </div>
            <div className="text-center mb-5">
                <Badge variant="light-primary rounded" className="mr-2 mb-2 mb-md-0"><FaCircle size={7} className="mr-1"/> Events</Badge>
                <Badge variant="light-red rounded" className="mr-2 mb-2 mb-md-0"><FaCircle size={7} className="mr-1"/> Training Sessions</Badge>
                <Badge variant="light-green rounded"><FaCircle size={7} className="mr-1"/> Controller Bookings</Badge>
            </div>
            <Calendar
                ref={calendarRef}
                height="800px"
                view={view}
                taskView={false}
                useDetailPopup={true}
                isReadOnly={isReadOnly || false}
                onBeforeCreateSchedule={onCreateSchedule}
                schedules={schedules.concat(additionalSchedules || [])}
                calendars={tuiCalendars}
                timezones={tuiTimezones}
                template={tuiTemplates}
                theme={tuiTheme}
            />
        </>
    )
}