import React, { Component } from 'react'
import { Alert, Button, Card, Col, Form, Modal } from 'react-bootstrap'
import { BsArrowDown, RiDeleteBinLine, RiQuestionLine } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import moment from 'moment'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'
import axiosInstance from '../../../helpers/axiosInstance'
import { dataTableStyle } from '../../../helpers/constants'
import TuiCalendar from '../../../components/TuiCalendar'
import { withSnackbar } from 'notistack'

class RequestTraining extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            showCreationModal: false,
            sessionRequest: {},
            pendingRequests: [],
            pendingRequestsSchedules: [],
        }
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleLevelChange = this.handleLevelChange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleCreateSchedule = this.handleCreateSchedule.bind(this)
    }

    componentDidMount() {
        this.fetchPendingRequests()
    }

    fetchPendingRequests() {
        axiosInstance
            .get('/api/training/request/')
            .then(res => {
                this.setState({ pendingRequests: res.data }, () => {
                    this.props.updateNotifs()
                    this.createPendingRequestsSchedules()
                })
            })
    }

    createPendingRequestsSchedules() {
        let schedules: object[] = []
        this.state.pendingRequests.forEach(request => {
            schedules.push({
                id: request.id,
                calendarId: 2,
                title: 'Training Request (Pending)',
                category: 'time',
                customStyle: 'btn',
                color: '#ffffff',
                isReadOnly: true,
                isPending: true,
                start: request.start,
                end: request.end,
            })
        })
        this.setState({pendingRequestsSchedules: schedules})
    }

    handleSubmitRequest(e) {
        e.preventDefault()
        axiosInstance
            .post('/api/training/request/', this.state.sessionRequest)
            .then(res => {
                this.setState({showCreationModal: false})
                this.fetchPendingRequests()
                this.props.enqueueSnackbar('Successfully requested training', {
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

    handleTextChange(event) {
        let newRequest = { ...this.state.sessionRequest }
        newRequest[event.target.name] = event.target.value
        this.setState({ sessionRequest: newRequest })
    }

    handleDateChange(event) {
        let newRequest = { ...this.state.sessionRequest }
        newRequest[event.target.name] = event.target.value
        this.setState({ sessionRequest: newRequest })
    }

    handleLevelChange(selected) {
        let newRequest = { ...this.state.sessionRequest }
        newRequest['level'] = selected.value
        this.setState({ sessionRequest: newRequest })
    }

    handleTypeChange(selected) {
        let newRequest = { ...this.state.sessionRequest }
        newRequest['type'] = selected.value
        this.setState({ sessionRequest: newRequest })
    }

    handleCreateSchedule(event) {
        this.setState({
            showCreationModal: true,
            sessionRequest: {
                start: event.start.toDate().toISOString().slice(0, -1),
                end: event.end.toDate().toISOString().slice(0, -1),
            },
        })
        event.guide.clearGuideElement()
    }

    cancelRequest(row) {
        axiosInstance
            .delete('/api/training/request/' + row.id + '/')
            .then(res => {
                this.fetchPendingRequests()
                this.props.enqueueSnackbar('Successfully cancelled training request', {
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

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <div className="mb-5">
                    <Card>
                        <Card.Body>
                            <DataTable
                                data={this.state.pendingRequests}
                                noHeader
                                highlightOnHover
                                defaultSortField="date"
                                sortIcon={<BsArrowDown/>}
                                noDataComponent={<div className="p-4">No pending training requests</div>}
                                columns={[
                                    {
                                        name: 'Cancel',
                                        button: true,
                                        cell: (row) => <Button variant="link" onClick={() => this.cancelRequest(row)}><RiDeleteBinLine size={20}/></Button>,
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
                                customStyles={dataTableStyle}
                            />
                        </Card.Body>
                    </Card>
                </div>
                <Alert variant="purple" className="position-unset d-flex mb-5">
                    <RiQuestionLine className="fill-purple mr-3" size={50} preserveAspectRatio="xMaxYMin"/>
                    <div>
                        <h5>How do I use this?</h5>
                        <p className="m-0">
                            To request training, indicate the range of time for which you are <b>100% available</b>. When your request is submitted, a
                            mentor or instructor will be able to accept the request and set any time within that range that works for them. To select
                            a time, drag your mouse across multiple boxes on the calendar below.
                        </p>
                    </div>
                </Alert>
                <TuiCalendar view="week" onCreateSchedule={this.handleCreateSchedule} additionalSchedules={this.state.pendingRequestsSchedules}/>
                <Modal
                    size="lg"
                    show={this.state.showCreationModal}
                    onHide={() => this.setState({showCreationModal: false})}
                    keyboard={false}
                    backdrop="static"
                    centered
                >
                    <Form onSubmit={this.handleSubmitRequest}>
                        <Modal.Header closeButton>
                            <Modal.Title>Request Training</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Start (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="start" value={this.state.sessionRequest.start} onChange={this.handleDateChange}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>End (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="end" value={this.state.sessionRequest.end} onChange={this.handleDateChange}/>
                                    </Form.Group>
                                </Col>
                            </Form.Row>
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
                                            onChange={this.handleTypeChange}
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
                                            onChange={this.handleLevelChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                            <Form.Group>
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control as="textarea" rows={4} name="remarks" onChange={this.handleTextChange}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="lightgray" onClick={() => this.setState({showCreationModal: false})}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Fade>
        )
    }
}

export default withSnackbar(RequestTraining)
