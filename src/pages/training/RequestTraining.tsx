import React, { Component } from 'react'
import { Alert, Button, Col, Form, Modal } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import Select from 'react-select'
import { levelDisplay, typeDisplay } from '../../helpers/utils'
import axiosInstance from '../../helpers/axiosInstance'
import { BsArrowDown, RiErrorWarningLine } from 'react-icons/all'
import { dataTableStyle } from '../../helpers/constants'
import TuiCalendar from '../../components/TuiCalendar'

export default class RequestTraining extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            showCreationModal: false,
            sessionRequest: {},
            pendingRequests: [],
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
            .get('/api/training/request/pending/')
            .then(res => this.setState({ pendingRequests: res.data }))
    }

    handleSubmitRequest(e) {
        e.preventDefault()
        axiosInstance
            .post('/api/training/request/', this.state.sessionRequest)
            .then(res => {
                this.setState({showCreationModal: false})
                this.fetchPendingRequests()
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
    }

    render() {
        return (
            <>
                <DataTable
                    data={this.state.pendingRequests}
                    noHeader
                    highlightOnHover
                    defaultSortField="date"
                    defaultSortAsc={false}
                    sortIcon={<BsArrowDown/>}
                    pagination={true}
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    columns={[
                        {
                            name: 'Date',
                            selector: 'date',
                            sortable: true,
                            format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z') + ' - ' + moment(row.end).tz(moment.tz.guess()).format('HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                            minWidth: '25%',
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
                <Alert variant="primary" className="position-unset d-flex">
                    <RiErrorWarningLine className="fill-primary mr-3" size={45} preserveAspectRatio="xMaxYMin"/>
                    <div>
                        <h5>How do I use this?</h5>
                        <p className="m-0">
                            To request training, indicate the range of time for which you are <b>100% available</b>. When your request is submitted, a
                            mentor or instructor will be able to accept the request and set any time within that range that works for them. To select
                            a time, drag your mouse across multiple boxes on the calendar below.
                        </p>
                    </div>
                </Alert>
                <TuiCalendar view="week" onCreateSchedule={this.handleCreateSchedule}/>
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
            </>
        )
    }
}