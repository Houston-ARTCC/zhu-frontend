import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal } from 'react-bootstrap'
import { BsArrowDown, RiDeleteBinLine, RiQuestionLine } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'
import axiosInstance from '../../../helpers/axiosInstance'
import { dataTableStyle } from '../../../helpers/constants'
import TuiCalendar from '../../../components/TuiCalendar'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns-tz'
import IconAlert from '../../../components/IconAlert'

export default function RequestTraining({ updateNotifs }) {
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [sessionRequest, setSessionRequest] = useState<any>({})
    const [pendingRequests, setPendingRequests] = useState<any>([])
    const [pendingRequestsSchedules, setPendingRequestsSchedules] = useState<any>([])

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchPendingRequests(), [])
    useEffect(() => {
        createPendingRequestsSchedules()
        updateNotifs()
    }, [pendingRequests]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchPendingRequests = () => {
        axiosInstance
            .get('/api/training/request/')
            .then(res => setPendingRequests(res.data))
    }

    const createPendingRequestsSchedules = () => {
        setPendingRequestsSchedules(
            pendingRequests.map(request => ({
                id: request.id,
                calendarId: 2,
                title: 'Training Request (Pending)',
                category: 'time',
                color: '#ffffff',
                isReadOnly: true,
                isPending: true,
                start: request.start,
                end: request.end,
            }))
        )
    }

    const cancelRequest = (row) => {
        axiosInstance
            .delete('/api/training/request/' + row.id + '/')
            .then(res => {
                fetchPendingRequests()
                enqueueSnackbar('Successfully cancelled training request', {
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
            .post('/api/training/request/', sessionRequest)
            .then(res => {
                setShowCreationModal(false)
                fetchPendingRequests()
                enqueueSnackbar('Successfully requested training', {
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
        let newRequest = { ...sessionRequest }
        newRequest[event.target.name] = event.target.value
        setSessionRequest(newRequest)
    }

    const handleDateChange = (event) => {
        let newRequest = { ...sessionRequest }
        newRequest[event.target.name] = event.target.value
        setSessionRequest(newRequest)
    }

    const handleLevelChange = (selected) => {
        let newRequest = { ...sessionRequest }
        newRequest['level'] = selected.value
        setSessionRequest(newRequest)
    }

    const handleTypeChange = (selected) => {
        let newRequest = { ...sessionRequest }
        newRequest['type'] = selected.value
        setSessionRequest(newRequest)
    }

    const handleCreateSchedule = (event) => {
        setShowCreationModal(true)
        setSessionRequest({
            start: event.start.toDate().toISOString().slice(0, -1),
            end: event.end.toDate().toISOString().slice(0, -1),
        })
        event.guide.clearGuideElement()
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="mb-5">
                <Card>
                    <Card.Body>
                        <DataTable
                            data={pendingRequests}
                            noHeader
                            highlightOnHover
                            defaultSortField="date"
                            sortIcon={<BsArrowDown/>}
                            pagination={true}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            noDataComponent={<div className="p-4">No pending training requests</div>}
                            customStyles={dataTableStyle}
                            columns={[
                                {
                                    name: 'Cancel',
                                    button: true,
                                    cell: (row) => <Button variant="link" onClick={() => cancelRequest(row)}><RiDeleteBinLine size={20}/></Button>,
                                },
                                {
                                    name: 'Start',
                                    selector: 'start',
                                    sortable: true,
                                    format: row => format(new Date(row.start), 'MMM d, Y @ HH:mm zzz'),
                                    sortFunction: (a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1,
                                },
                                {
                                    name: 'End',
                                    selector: 'end',
                                    sortable: true,
                                    format: row => format(new Date(row.end), 'MMM d, Y @ HH:mm zzz'),
                                    sortFunction: (a, b) => new Date(a.end) > new Date(b.end) ? 1 : -1,
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
                            ]}
                        />
                    </Card.Body>
                </Card>
            </div>
            <IconAlert variant="purple" className="mb-4" icon={RiQuestionLine} header="How do I use this?">
                <p className="m-0">
                    To request training, indicate the range of time for which you are <b>100% available</b>. When your request is submitted, a
                    mentor or instructor will be able to accept the request and set any time within that range that works for them. To select
                    a time, drag your mouse across multiple boxes on the calendar below.
                </p>
            </IconAlert>
            <TuiCalendar view="week" onCreateSchedule={handleCreateSchedule} additionalSchedules={pendingRequestsSchedules}/>
            <Modal
                size="lg"
                show={showCreationModal}
                onHide={() => setShowCreationModal(false)}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Form onSubmit={handleSubmitRequest}>
                    <Modal.Header closeButton>
                        <Modal.Title>Request Training</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Start (Zulu)</Form.Label>
                                <Form.Control required type="datetime-local" name="start" value={sessionRequest.start} onChange={handleDateChange}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>End (Zulu)</Form.Label>
                                <Form.Control required type="datetime-local" name="end" value={sessionRequest.end} onChange={handleDateChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Type</Form.Label>
                                <Select
                                    options={[
                                        { value: 0, label: 'Classroom' },
                                        { value: 1, label: 'Sweatbox' },
                                        { value: 2, label: 'Online' },
                                        { value: 3, label: 'OTS' },
                                    ]}
                                    onChange={handleTypeChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Level</Form.Label>
                                <Select
                                    options={[
                                        { value: 0, label: 'Minor Ground' },
                                        { value: 1, label: 'Major Ground' },
                                        { value: 2, label: 'Minor Tower' },
                                        { value: 3, label: 'Major Tower' },
                                        { value: 4, label: 'Minor Approach' },
                                        { value: 5, label: 'Major Approach' },
                                        { value: 6, label: 'Center' },
                                        { value: 7, label: 'Oceanic' },
                                    ]}
                                    onChange={handleLevelChange}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control as="textarea" rows={4} name="remarks" onChange={handleTextChange}/>
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
