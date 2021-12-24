import Fade from 'react-reveal/Fade'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import TuiCalendar from '../../../components/TuiCalendar'
import DataTable from 'react-data-table-component'
import { BsArrowDown, RiDeleteBinLine, RiQuestionLine } from 'react-icons/all'
import { dataTableStyle } from '../../../helpers/constants'
import { format } from 'date-fns-tz'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../helpers/axiosInstance'
import { useSnackbar } from 'notistack'
import IconAlert from '../../../components/IconAlert'

export default function Bookings() {
    const [bookings, setBookings] = useState<any>([])
    const [bookingSchedules, setBookingSchedules] = useState([])
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [newBooking, setNewBooking] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchBookings(), [])
    useEffect(() => createBookingSchedules(), [bookings]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchBookings = () => {
        axiosInstance
            .get('/api/booking/')
            .then(res => setBookings(res.data))
    }

    const createBookingSchedules = () => {
        setBookingSchedules(
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
        )
    }

    const cancelBooking = (row) => {
        axiosInstance
            .delete('/api/booking/' + row.id + '/')
            .then(res => {
                fetchBookings()
                enqueueSnackbar('Successfully cancelled booking', {
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
    }

    const handleSubmitRequest = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/booking/', newBooking)
            .then(res => {
                setShowCreationModal(false)
                fetchBookings()
                enqueueSnackbar('Successfully booked ' + newBooking?.callsign, {
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
    }

    const handleTextChange = (event) => {
        let modifiedBooking = { ...newBooking }
        modifiedBooking[event.target.name] = event.target.value
        setNewBooking(modifiedBooking)
    }

    const handleDateChange = (event) => {
        let modifiedBooking = { ...newBooking }
        modifiedBooking[event.target.name] = event.target.value
        setNewBooking(modifiedBooking)
    }

    const handleCreateSchedule = (event) => {
        if (event.end.toDate() < new Date()) {
            enqueueSnackbar('Booking must end after the current time', {
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
            })
        } else {
            setShowCreationModal(true)
            setNewBooking({
                start: event.start.toDate().toISOString().slice(0, -1),
                end: event.end.toDate().toISOString().slice(0, -1),
            })
        }
        event.guide.clearGuideElement()
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="mb-5">
                <Card>
                    <Card.Body>
                        <DataTable
                            data={bookings}
                            noHeader
                            highlightOnHover
                            defaultSortField="date"
                            sortIcon={<BsArrowDown/>}
                            pagination={true}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            noDataComponent={<div className="p-4">No controller bookings</div>}
                            customStyles={dataTableStyle}
                            columns={[
                                {
                                    name: 'Cancel',
                                    button: true,
                                    cell: row => <Button variant="link" onClick={() => cancelBooking(row)}><RiDeleteBinLine size={20}/></Button>,
                                },
                                {
                                    name: 'Start',
                                    selector: 'start',
                                    sortable: true,
                                    format: row => format(new Date(row.start), 'MMM d, y @ HH:mm zzz'),
                                    sortFunction: (a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1,
                                },
                                {
                                    name: 'End',
                                    selector: 'end',
                                    sortable: true,
                                    format: row => format(new Date(row.end), 'MMM d, y @ HH:mm zzz'),
                                    sortFunction: (a, b) => new Date(a.end) > new Date(b.end) ? 1 : -1,
                                },
                                {
                                    name: 'Callsign',
                                    selector: 'callsign',
                                    sortable: true,
                                },
                            ]}
                        />
                    </Card.Body>
                </Card>
            </div>
            <IconAlert variant="purple" className="mb-4" icon={RiQuestionLine} header="How do I use this?">
                <p className="m-0">
                    To book a position, indicate the time for which you are going to be online on that position.
                    To select a time, drag your mouse across multiple boxes on the calendar below.
                </p>
            </IconAlert>
            <TuiCalendar view="week" onCreateSchedule={handleCreateSchedule} additionalSchedules={bookingSchedules} />
            <Modal
                show={showCreationModal}
                onHide={() => setShowCreationModal(false)}
                centered
            >
                <Form onSubmit={handleSubmitRequest}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Start (Zulu)</Form.Label>
                            <Form.Control required type="datetime-local" name="start" value={newBooking?.start} onChange={handleDateChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End (Zulu)</Form.Label>
                            <Form.Control required type="datetime-local" name="end" value={newBooking?.end} onChange={handleDateChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Callsign</Form.Label>
                            <Form.Control required name="callsign" onChange={handleTextChange}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowCreationModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Fade>
    )
}
