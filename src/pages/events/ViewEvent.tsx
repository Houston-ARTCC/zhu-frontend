import { Component } from 'react';
import { Alert, Button, Col, Container, OverlayTrigger, Popover, ProgressBar, Row } from 'react-bootstrap'
import { FaRegEyeSlash, FaRegFolderOpen, RiPencilRuler2Line } from 'react-icons/all'
import { withSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
import Countdown from 'react-countdown'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import { getCID, isMember, isStaff } from '../../helpers/auth';
import Error404 from '../errors/Error404'
import parse from 'html-react-parser'
import { format } from 'date-fns-tz'
import Fade from 'react-reveal/Fade'
import IconAlert from '../../components/IconAlert'

class ViewEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            eventNotFound: false,
            event: {},
        }
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id + '/')
            .then(res => {
                this.setState({ event: res.data })
            })
            .catch(err => {
                if (err.response.status === 404) {
                    this.setState({ eventNotFound: true })
                }
            })
    }

    getEnroutePositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'CTR' || level === 'FSS'
        })
    }

    getEnrouteShifts() {
        let shifts: any[] = []
        this.getEnroutePositions()?.map(position => shifts.push(...position.shifts))
        return shifts
    }

    getTRACONPositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'APP' || level === 'DEP'
        })
    }

    getTRACONShifts() {
        let shifts: any[] = []
        this.getTRACONPositions()?.map(position => shifts.push(...position.shifts))
        return shifts
    }

    getLocalPositions() {
        return this.state.event.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'DEL' || level === 'GND' || level === 'TWR'
        })
    }

    getLocalShifts() {
        let shifts: any[] = []
        this.getLocalPositions()?.map(position => shifts.push(...position.shifts))
        return shifts
    }

    renderShift(shift, position) {
        const handleRequest = () => {
            axiosInstance
                .post('/api/events/request/' + shift.id + '/')
                .then(res => {
                    this.fetchEvent()
                    this.props.enqueueSnackbar('Requested ' + position.callsign + ' (' + (position.shifts.indexOf(shift) + 1) + ')', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
                .catch(err => {
                    this.props.enqueueSnackbar(err.toString(), {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
        }

        const handleUnrequest = () => {
            axiosInstance
                .delete('/api/events/request/' + shift.id + '/')
                .then(res => {
                    this.fetchEvent()
                    this.props.enqueueSnackbar('Unrequested ' + position.callsign + ' (' + (position.shifts.indexOf(shift) + 1) + ')', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
                .catch(err => {
                    this.props.enqueueSnackbar(err.toString(), {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
        }

        let requested = shift.requests.some(req => req.user.cid === getCID())
        return (
                <ProgressBar
                    style={shift.user || !isMember() ? {} : { cursor: 'pointer' }}
                    onClick={shift.user || !isMember() ? () => {} : requested ? handleUnrequest : handleRequest}
                    variant={
                        shift.user
                            ? 'green'
                            : requested
                                ? 'lightgray'
                                : 'transparent'
                    }
                    now={100 / position.shifts.length}
                    striped={!shift.user && requested}
                    className="flex-grow-1"
                    label={
                        <OverlayTrigger placement="bottom" overlay={
                            <Popover id="popover-basic">
                                <Popover.Title as="h3">{position.callsign} (Shift {position.shifts.indexOf(shift) + 1})</Popover.Title>
                                <Popover.Content>
                                    {format(new Date(shift.start), 'HH:mm')} - {format(new Date(shift.end), 'HH:mm')}
                                </Popover.Content>
                            </Popover>
                        }>
                            {shift.user
                                ? <span className="overflow-ellipses">{shift.user.first_name} {shift.user.last_name}</span>
                                : !isMember()
                                    ? <span className="text-black">Unassigned</span>
                                    : requested
                                        ? <span className="text-darkgray">Unrequest</span>
                                        : <span className="text-black">Request</span>
                            }
                        </OverlayTrigger>
                    }
                />
        )
    }

    renderPosition(position) {
        return (
            <li className="mb-3">
                <p className="mb-2">{position.callsign}</p>
                <div>
                    <ProgressBar>
                        {position.shifts.length > 0
                            ? position.shifts.map(shift => this.renderShift(shift, position))
                            : <ProgressBar
                                variant={'white'}
                                now={100}
                                label={<i className="text-black">No shifts have been posted.</i>}
                            />
                        }
                    </ProgressBar>
                </div>
            </li>
        )
    }

    render() {
        if (this.state.eventNotFound) {
            return <Error404/>
        }

        const enrouteShifts = this.getEnrouteShifts()?.filter(shift => !shift.user).length
        const TRACONShifts = this.getTRACONShifts()?.filter(shift => !shift.user).length
        const localShifts = this.getLocalShifts()?.filter(shift => !shift.user).length

        return (
            <>
                <Header
                    title={this.state.event.name}
                    subtitle={`Presented by ${this.state.event.host}`}
                />
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        {this.state.event.hidden &&
                            <Row className="justify-content-center mb-3">
                                <Col md={6}>
                                    <IconAlert variant="red" icon={FaRegEyeSlash} header="Event Hidden">
                                        <p className="m-0">This event is currently hidden from controllers. <Alert.Link as={Link} to={this.props.match.params.id + '/edit'} className="font-w500">Edit the event</Alert.Link> to make it visible.</p>
                                    </IconAlert>
                                </Col>
                            </Row>
                        }
                        {this.state.event.archived &&
                            <Row className="justify-content-center mb-3">
                                <Col md={6}>
                                    <IconAlert variant="purple" icon={FaRegFolderOpen} header="Event Archived">
                                        <p className="m-0">This event has passed and is now archived.</p>
                                    </IconAlert>
                                </Col>
                            </Row>
                        }
                        <Row className="mb-5 d-flex text-center align-items-center justify-content-center">
                            <Col md={6}>
                                <Row className="align-items-center mb-4">
                                    <Col xs={12} md={6} className="mb-2">
                                        <h4 className="text-black font-w500">Start</h4>
                                        <h5 className="font-w400">{this.state.event.start && format(new Date(this.state.event.start), 'MMM d, Y, HH:mm zzz')}</h5>
                                        <h4 className="text-black font-w500">End</h4>
                                        <h5 className="font-w400">{this.state.event.start && format(new Date(this.state.event.end), 'MMM d, Y, HH:mm zzz')}</h5>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <h4 className="text-black font-w500">Time Until Event</h4>
                                        {new Date(this.state.event.end) < new Date()
                                            ? <h5 className="font-w400">Event has ended.</h5>
                                            : <Countdown date={new Date(this.state.event.start)} renderer={
                                                ({ days, hours, minutes, seconds, completed }) => completed ? <h5 className="font-w400">Event has begun!</h5> : <h5 className="font-w400">{days}d {hours}h {minutes}m {seconds}s</h5>
                                            }/>
                                        }
                                    </Col>
                                </Row>
                                <p>
                                    {this.state.event.description
                                        ? parse(this.state.event.description?.replace(/(?:\r\n|\r|\n)/g, '<br/>'))
                                        : ''
                                    }
                                </p>
                                {isStaff() &&
                                    <Link to={this.state.event.id + '/edit'}>
                                        <Button variant="primary" className="mb-4"><RiPencilRuler2Line viewBox="3 3 20 20"/> Edit Event</Button>
                                    </Link>
                                }
                            </Col>
                            {this.state.event.banner &&
                                <Col md={6}>
                                    <img className="event-banner-lg" src={this.state.event.banner} alt={this.state.event.name}/>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col className="text-center text-md-left mb-4" xs={12} md={4}>
                                <h3 className="text-black font-w700 mb-1">Enroute Positions</h3>
                                <h5 className="text-gray font-w500 mb-3">{enrouteShifts} Shift{enrouteShifts === 1 ? '' : 's'} Available</h5>
                                <ul className="p-0 list-unstyled">
                                    {this.getEnroutePositions()?.length > 0
                                        ? this.getEnroutePositions()?.map(position => this.renderPosition(position))
                                        : <p>No positions posted.</p>
                                    }
                                </ul>
                            </Col>
                            <Col className="text-center text-md-left mb-4" xs={12} md={4}>
                                <h3 className="text-black font-w700 mb-1">TRACON Positions</h3>
                                <h5 className="text-gray font-w500 mb-3">{TRACONShifts} Shift{TRACONShifts === 1 ? '' : 's'} Available</h5>
                                <ul className="p-0 list-unstyled">
                                    {this.getTRACONPositions()?.length > 0
                                        ? this.getTRACONPositions()?.map(position => this.renderPosition(position))
                                        : <p>No positions posted.</p>
                                    }
                                </ul>
                            </Col>
                            <Col className="text-center text-md-left mb-4" xs={12} md={4}>
                                <h3 className="text-black font-w700 mb-1">Local Positions</h3>
                                <h5 className="text-gray font-w500 mb-3">{localShifts} Shift{localShifts === 1 ? '' : 's'} Available</h5>
                                <ul className="p-0 list-unstyled">
                                    {this.getLocalPositions()?.length > 0
                                        ? this.getLocalPositions()?.map(position => this.renderPosition(position))
                                        : <p>No positions posted.</p>
                                    }
                                </ul>
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </>
        )
    }
}

export default withSnackbar(ViewEvent)
