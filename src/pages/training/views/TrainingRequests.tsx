import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, RiArrowRightLine } from 'react-icons/all'
import { useSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import moment from 'moment'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'
import { dataTableStyle } from '../../../helpers/constants'
import axiosInstance from '../../../helpers/axiosInstance'
import { Badge, Button, Col, Form, Modal } from 'react-bootstrap'

export default function TrainingRequests({ updateNotifs }) {
    const [requests, setRequests] = useState([])
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [request, setRequest] = useState<any>({})
    const [modifiedRequest, setModifiedRequest] = useState<any>({})

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
        newRequest['start'] = moment(row.start)
        newRequest['end'] = moment(row.end)

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

    let marks = {}
    let start = moment(request.start).valueOf()
    let end = moment(request.end).valueOf()
    while (start < end) {
        marks[start] = undefined
        start = start - (start % 900000) + 900000
    }
    marks[end] = undefined

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                <DataTable
                    data={requests}
                    noHeader
                    highlightOnHover
                    pointerOnHover
                    expandableRows
                    expandableRowsHideExpander={true}
                    expandableRowsComponent={<ExpandableComponent/>}
                    expandableRowExpanded={row => row.remarks}
                    defaultSortField="start"
                    sortIcon={<BsArrowDown/>}
                    pagination={true}
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 15, 20, 25]}
                    noDataComponent={<div className="p-4">No pending training requests</div>}
                    onRowClicked={handleClickRequest}
                    conditionalRowStyles={[
                        {
                            when: row => row.remarks,
                            style: { borderBottom: 'none!important' }
                        }
                    ]}
                    columns={[
                        {
                            name: 'Student',
                            selector: 'student',
                            sortable: true,
                            format: row => row.user.first_name + ' ' + row.user.last_name,
                            sortFunction: (a, b) => {
                                return a.first_name > b.first_name ? 1 : -1
                            },
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
                            name: 'Start',
                            selector: 'start',
                            sortable: true,
                            format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                        },
                        {
                            name: 'End',
                            selector: 'end',
                            sortable: true,
                            format: row => moment(row.end).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                        },
                    ]}
                    customStyles={dataTableStyle}
                />
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
                                <Badge variant="darkblue" style={{ minWidth: 200 }}>{modifiedRequest.start?.tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z')}</Badge>
                                <RiArrowRightLine size={30} className="fill-darkblue mx-3"/>
                                <Badge variant="darkblue" style={{ minWidth: 200 }}>{modifiedRequest.end?.tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z')}</Badge>
                            </div>
                            <Slider.Range
                                // @ts-ignore
                                step={null}
                                marks={marks}
                                allowCross={false}
                                min={moment(request.start).valueOf()}
                                max={moment(request.end).valueOf()}
                                defaultValue={[moment(request.start).valueOf(), moment(request.end).valueOf()]}
                                onChange={(val) => {
                                    let newRequest = {...modifiedRequest}
                                    newRequest['start'] = moment(val[0])
                                    newRequest['end'] = moment(val[1])

                                    setModifiedRequest(newRequest)
                                }}
                            />
                        </div>
                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Type</Form.Label>
                                    <Select
                                        options={[
                                            { value: 0, label: 'Classroom' },
                                            { value: 1, label: 'Sweatbox' },
                                            { value: 2, label: 'Online' },
                                            { value: 3, label: 'OTS' },
                                        ]}
                                        value={{
                                            value: modifiedRequest.type,
                                            label: typeDisplay(modifiedRequest.type),
                                        }}
                                        onChange={handleTypeChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
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
                                        value={{
                                            value: modifiedRequest.level,
                                            label: levelDisplay(modifiedRequest.level),
                                        }}
                                        onChange={handleLevelChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>Position (Optional)</Form.Label>
                            <Form.Control type="text" name="position" value={modifiedRequest.position} onChange={handlePositionChange}/>
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

const ExpandableComponent = (row) => {
    return (
        <div className="px-3 pb-3 pt-2" style={{ backgroundColor: '#F9F9F9' }}>
            <p className="mb-0"><i><b>Remarks:</b> {row.data.remarks}</i></p>
        </div>
    )
}
