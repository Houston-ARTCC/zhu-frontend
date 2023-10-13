import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { RiArrowRightLine, RiCheckboxCircleLine } from 'react-icons/ri'
import { useSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'
import { dataTableStyle } from '../../../helpers/constants'
import axiosInstance from '../../../helpers/axiosInstance'
import { Badge, Button, Col, Form, Modal } from 'react-bootstrap'
import { format } from 'date-fns-tz'
import IconAlert from '../../../components/IconAlert'
import { UserTrainingRequests } from '../../../models'

export default function TrainingRequests({ updateNotifs }) {
    const [requests, setRequests] = useState<UserTrainingRequests[]>([])
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [request, setRequest] = useState<any>({})
    const [modifiedRequest, setModifiedRequest] = useState<any>(undefined)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchRequests(), [])
    useEffect(() => updateNotifs(), [requests]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchRequests = () => {
        axiosInstance
            .get('/api/training/request/pending/')
            .then(res => setRequests(res.data))
    }

    const handleClickRequest = (row) => {
        let newRequest = {...row}
        newRequest['start'] = new Date(row.start)
        newRequest['end'] = new Date(row.end)

        setRequest(row)
        setModifiedRequest(newRequest)
        setShowRequestModal(true)
    }

    const handleLevelChange = (selected) => {
        let newRequest = { ...modifiedRequest }
        newRequest['level'] = selected.value
        setModifiedRequest(newRequest)
    }

    const handleTypeChange = (selected) => {
        let newRequest = { ...modifiedRequest }
        newRequest['type'] = selected.value
        setModifiedRequest(newRequest)
    }

    const handlePositionChange = (event) => {
        let newRequest = { ...modifiedRequest }
        newRequest['position'] = event.target.value
        setModifiedRequest(newRequest)
    }

    const handleSubmitRequest = (e) => {
        e.preventDefault()
        axiosInstance
            .put('/api/training/request/' + request.id + '/', modifiedRequest)
            .then(res => {
                fetchRequests()
                setShowRequestModal(false)
                enqueueSnackbar('Successfully scheduled training with ' + request.user.first_name + ' ' + request.user.last_name, {
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

    const ExpandableComponent = (row) => (
        <div className="px-3 pt-2">
            {row.data.requests.map((request) => (
                <p>
                    <Button
                        size="sm"
                        variant="bg-primary"
                        className="mr-2"
                        onClick={() => handleClickRequest(request)}
                    >
                        Book
                    </Button>
                    {levelDisplay(request.level)} {typeDisplay(request.type)}
                    {' '}on <b>{format(new Date(request.start), 'MMM d')}</b>
                    {' '}from <b>{format(new Date(request.start), 'HH:mm')}</b>
                    {' '}to <b>{format(new Date(request.end), 'HH:mm z')}</b>
                </p>
            ))}
        </div>
    );

    let marks = {}
    let start = new Date(request.start).getTime()
    let end = new Date(request.end).getTime()
    while (start < end) {
        marks[start] = undefined
        start = start - (start % 900000) + 900000
    }
    marks[end] = undefined

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                {requests.length > 0
                    ? <DataTable
                        data={requests}
                        noHeader
                        highlightOnHover
                        pointerOnHover
                        expandableRows
                        expandableRowsComponent={<ExpandableComponent/>}
                        noDataComponent={<div className="p-4">No pending training requests</div>}
                        columns={[
                            {
                                name: 'Student',
                                selector: 'student',
                                sortable: true,
                                format: row => row.user.first_name + ' ' + row.user.last_name,
                            },
                            {
                                name: 'Last Session',
                                selector: 'last_session',
                                sortable: true,
                                format: row => row.last_session ? format(new Date(row.last_session), 'MMM dd, yyyy') : <i>Never</i>,
                            },
                            {
                                name: 'Requests',
                                selector: 'requests',
                                sortable: true,
                                format: row => row.requests.length,
                            },
                        ]}
                        customStyles={dataTableStyle}
                    />
                    : <IconAlert variant="green" icon={RiCheckboxCircleLine} header="All caught up!">
                        <p className="m-0">There are currently no pending training requests.</p>
                    </IconAlert>
                }
            </Fade>
            <Modal
                size="lg"
                show={showRequestModal}
                onHide={() => setShowRequestModal(false)}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Form onSubmit={handleSubmitRequest}>
                    <Modal.Header closeButton>
                        <Modal.Title>Scheduling Training with {request.user?.first_name} {request.user?.last_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Drag the slider to set the start and end times for the training session. The limits are automatically set to what the student indicated as their availability.</p>
                        <div className="my-4">
                            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-3">
                                <Badge variant="darkblue" style={{ minWidth: 200 }}>{modifiedRequest && format(modifiedRequest.start, 'MMM d, y @ HH:mm zzz')}</Badge>
                                <RiArrowRightLine size={30} className="fill-darkblue mx-3"/>
                                <Badge variant="darkblue" style={{ minWidth: 200 }}>{modifiedRequest && format(modifiedRequest.end, 'MMM d, y @ HH:mm zzz')}</Badge>
                            </div>
                            <Slider.Range
                                // @ts-ignore
                                step={null}
                                marks={marks}
                                allowCross={false}
                                min={new Date(request.start).getTime()}
                                max={new Date(request.end).getTime()}
                                defaultValue={[new Date(request.start).getTime(), new Date(request.end).getTime()]}
                                onChange={(val) => {
                                    let newRequest = {...modifiedRequest}
                                    newRequest['start'] = new Date(val[0])
                                    newRequest['end'] = new Date(val[1])

                                    setModifiedRequest(newRequest)
                                }}
                            />
                        </div>
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
                                    value={{
                                        value: modifiedRequest?.type,
                                        label: typeDisplay(modifiedRequest?.type),
                                    }}
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
                                    ]}
                                    value={{
                                        value: modifiedRequest?.level,
                                        label: levelDisplay(modifiedRequest?.level),
                                    }}
                                    onChange={handleLevelChange}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>Position (Optional)</Form.Label>
                            <Form.Control type="text" name="position" value={modifiedRequest?.position} onChange={handlePositionChange}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowRequestModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
