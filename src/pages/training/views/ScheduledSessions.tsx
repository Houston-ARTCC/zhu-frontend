import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, RiCloseFill, RiFileUserLine, RiMoreFill, RiUserSearchLine } from 'react-icons/all'
import { Badge, Button, Dropdown, Form, Modal } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'
import { dataTableStyle } from '../../../helpers/constants'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'
import { format } from 'date-fns-tz'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

export default function ScheduledSessions() {
    const [sessions, setSessions] = useState([])
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showNoShowModal, setShowNoShowModal] = useState(false)
    const [currentSession, setCurrentSession] = useState<any>(null)

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchSessions(), [])

    const fetchSessions = () => {
        axiosInstance
            .get('/api/training/')
            .then(res => setSessions(res.data))
    }

    const handleCancelSession = (e) => {
        e.preventDefault()
        axiosInstance
            .delete('/api/training/session/' + currentSession.id + '/')
            .then(res => {
                fetchSessions()
                setShowCancelModal(false)
                enqueueSnackbar('Successfully cancelled training session', {
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

    const handleNoShowSession = (e) => {
        e.preventDefault()
        axiosInstance
            .put('/api/training/session/' + currentSession.id + '/', { status: 3 })
            .then(res => {
                fetchSessions()
                setShowNoShowModal(false)
                enqueueSnackbar('Successfully cancelled training session', {
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

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                <DataTable
                    data={sessions}
                    noHeader
                    highlightOnHover
                    defaultSortField="date"
                    sortIcon={<BsArrowDown/>}
                    customStyles={dataTableStyle}
                    className="overflow-visible"
                    columns={[
                        {
                            name: '',
                            button: true,
                            center: true,
                            allowOverflow: true,
                            cell: (row) => (
                                <Dropdown>
                                    <Dropdown.Toggle variant="link">
                                        <RiMoreFill size={20}/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => history.push('/training/session/' + row.id + '/file')}>
                                            <RiFileUserLine size={20}/> File
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            setCurrentSession(row)
                                            setShowCancelModal(true)
                                        }}>
                                            <RiCloseFill size={20}/> Cancel
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            setCurrentSession(row)
                                            setShowNoShowModal(true)
                                        }}>
                                            <RiUserSearchLine size={20}/> No-Show
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ),
                            width: '65px',
                        },
                        {
                            name: 'Date',
                            selector: 'date',
                            sortable: true,
                            format: row => format(new Date(row.start), 'MMM d, Y @ HH:mm zzz'),
                            sortFunction: (a: any, b: any) => new Date(a.start) > new Date(b.start) ? 1 : -1,
                            minWidth: '22%',
                        },
                        {
                            name: 'Student',
                            selector: 'student',
                            sortable: true,
                            format: row => row.student.first_name + ' ' + row.student.last_name,
                            sortFunction: (a, b) => a.student.first_name > b.student.first_name ? 1 : -1,
                        },
                        {
                            name: 'Instructor',
                            selector: 'instructor',
                            sortable: true,
                            format: row => row.instructor.first_name + ' ' + row.instructor.last_name,
                            sortFunction: (a, b) => a.instructor.first_name > b.instructor.first_name ? 1 : -1,
                        },
                        {
                            name: 'Level',
                            selector: 'level',
                            sortable: true,
                            format: row => levelDisplay(row.level),
                        },
                        {
                            name: 'Type',
                            selector: 'type',
                            sortable: true,
                            format: row => typeDisplay(row.type),
                        },
                        {
                            name: 'Status',
                            selector: 'status',
                            sortable: true,
                            format: row => <Badge variant="primary rounded">Scheduled</Badge>,
                        },
                    ]}
                />
            </Fade>
            <Modal
                size="lg"
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Form onSubmit={handleCancelSession}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cancelling {currentSession?.student.first_name} {currentSession?.student.last_name}'s Training Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to cancel {currentSession?.student.first_name} {currentSession?.student.last_name}'s training session on <b>{currentSession && format(new Date(currentSession?.start), 'MMM d, Y')}</b>?</p>
                        <p>The student will be sent an email notifying them of this cancellation. It is still recommended that you notify the student directly to ensure that they are aware of this change.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowCancelModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Confirm</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal
                size="lg"
                show={showNoShowModal}
                onHide={() => setShowNoShowModal(false)}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Form onSubmit={handleNoShowSession}>
                    <Modal.Header closeButton>
                        <Modal.Title>No-Show {currentSession?.student.first_name} {currentSession?.student.last_name}'s Training Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to mark {currentSession?.student.first_name} {currentSession?.student.last_name}'s training session on {currentSession && format(new Date(currentSession?.start), 'MMM d, Y')} as a no-show?</p>
                        <p>By proceeding, you are confirming that the student did not show up at the session for 15 minutes after the scheduled starting time.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowNoShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Confirm</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
