import { useEffect, useState } from 'react';
import { FaRegEyeSlash, HiOutlineCalendar, HiOutlineClock, MdPersonOutline } from 'react-icons/all'
import { Button, Card, Col, Collapse, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'
import Moment from 'react-moment'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'

export default function Events() {
    const [events, setEvents] = useState([])
    const [archivedEvents, setArchivedEvents] = useState([])
    const [showArchivedEvents, setShowArchivedEvents] = useState(false)

    useEffect(() => fetchEvents(), [])

    const fetchEvents = () => {
        axiosInstance
            .get('/api/events/')
            .then(res => setEvents(res.data))
    }

    const fetchArchivedEvents = () => {
        axiosInstance
            .get('/api/events/archived/')
            .then(res => setArchivedEvents(res.data))
    }

    const handleViewArchivedEvents = () => {
        if (archivedEvents.length < 1) fetchArchivedEvents()
        setShowArchivedEvents(!showArchivedEvents)
    }

    const Event = ({ event }) => (
        <Col md={6}>
            <Link to={`/events/${event.id}`}>
                <Card>
                    <Card.Body>
                        <h3 className="text-black font-w700 m-0">{event.name} {event.hidden && <FaRegEyeSlash className="fill-red" size={35}/>}</h3>
                        <h5 className="text-gray font-w500 mb-3">Presented by {event.host}</h5>
                        <Row>
                            <Col>
                                <div className="li-flex">
                                    <HiOutlineCalendar size={30} className="mr-2"/>
                                    <Moment local className="font-w500 font-lg" format="MMMM D, YYYY">{event.start}</Moment>
                                </div>
                                <div className="li-flex font-w500 font-lg">
                                    <HiOutlineClock size={30} className="mr-2"/>
                                    <Moment local tz={moment.tz.guess()} format="HH:mm z →&nbsp;" className="font-w500 font-lg">{event.start}</Moment>
                                    <Moment local tz={moment.tz.guess()} format="HH:mm z" className="font-w500 font-lg">{event.end}</Moment>
                                </div>
                            </Col>
                            <Col>
                                <div className="li-flex font-w500 font-lg">
                                    <MdPersonOutline size={30} className="mr-2"/>
                                    {event.available_shifts} Shift{event.available_shifts === 1 ? '' : 's'} Available
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                    {event.banner &&
                        <Card.Footer>
                            <img className="event-banner-lg" src={event.banner} alt={event.name}/>
                        </Card.Footer>
                    }
                </Card>
            </Link>
        </Col>
    )

    return (
        <div>
            <Header title="Events"/>
            <Container fluid>
                <Row>
                    {events.map(event => <Event event={event}/>)}
                </Row>
                <hr/>
                <div className="text-center mb-4">
                    <Button variant="bg-primary" onClick={handleViewArchivedEvents}>
                        View archived events
                    </Button>
                </div>
                <Collapse in={showArchivedEvents}>
                    <Row id="archived">
                        {archivedEvents.map(event => <Event event={event}/>)}
                    </Row>
                </Collapse>
            </Container>
        </div>
    )
}
