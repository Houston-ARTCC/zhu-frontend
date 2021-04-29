import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, RiArrowRightLine } from 'react-icons/all'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import moment from 'moment'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'
import { dataTableStyle } from '../../../helpers/constants'
import axiosInstance from '../../../helpers/axiosInstance'
import { Badge, Button, Col, Form, Modal } from 'react-bootstrap'
import { withSnackbar } from 'notistack'

class TrainingRequests extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            requests: [],
            showRequestModal: false,
            request: {},
            modifiedRequest: {},
        }
        this.handleClickRequest = this.handleClickRequest.bind(this)
        this.handleLevelChange = this.handleLevelChange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handlePositionChange = this.handlePositionChange.bind(this)
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this)
    }

    componentDidMount() {
        this.fetchRequests()
    }

    fetchRequests() {
        axiosInstance
            .get('/api/training/request/pending/', {...this.state.request,
                start: this.state.start,
                end: this.state.end,
                position: this.state.position,
            })
            .then(res => this.setState({ requests: res.data }, () => this.props.updateNotifs()))
    }

    handleClickRequest(row) {
        let newRequest = {...row}
        newRequest['start'] = moment(row.start)
        newRequest['end'] = moment(row.end)

        this.setState({
            request: row,
            modifiedRequest: newRequest,
            showRequestModal: true,
        })
    }

    handleLevelChange(selected) {
        let newRequest = { ...this.state.modifiedRequest }
        newRequest['level'] = selected.value
        this.setState({ modifiedRequest: newRequest })
    }

    handleTypeChange(selected) {
        let newRequest = { ...this.state.modifiedRequest }
        newRequest['type'] = selected.value
        this.setState({ modifiedRequest: newRequest })
    }

    handlePositionChange(event) {
        let newRequest = { ...this.state.modifiedRequest }
        newRequest['position'] = event.target.value
        this.setState({ modifiedRequest: newRequest })
    }

    handleSubmitRequest(e) {
        e.preventDefault()
        axiosInstance
            .put('/api/training/request/' + this.state.request.id + '/', this.state.modifiedRequest)
            .then(res => {
                this.fetchRequests()
                this.setState({ showRequestModal: false })
                this.props.enqueueSnackbar('Successfully scheduled training with ' + this.state.request.user.first_name + ' ' + this.state.request.user.last_name, {
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
        let marks = {}
        let start = moment(this.state.request.start).valueOf()
        let end = moment(this.state.request.end).valueOf()
        while (start < end) {
            marks[start] = undefined
            start = start - (start % 900000) + 900000
        }
        marks[end] = undefined

        const ExpandableComponent = (row) => {
            return (
                <div className="px-3 pb-3 pt-2" style={{ backgroundColor: '#F9F9F9' }}>
                    <p className="mb-0"><i><b>Remarks:</b> {row.data.remarks}</i></p>
                </div>
            )
        }

        return (
            <>
                <Fade bottom duration={1250} distance="50px">
                    <DataTable
                        data={this.state.requests}
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
                        onRowClicked={this.handleClickRequest}
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
                    show={this.state.showRequestModal}
                    onHide={() => this.setState({showRequestModal: false})}
                    keyboard={false}
                    backdrop="static"
                    centered
                >
                    <Form onSubmit={this.handleSubmitRequest}>
                        <Modal.Header closeButton>
                            <Modal.Title>Scheduling Training with {this.state.request.user?.first_name} {this.state.request.user?.last_name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Drag the slider to set the start and end times for the training session. The limits are automatically set to what the student indicated as their availability.</p>
                            <div className="my-4">
                                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-3">
                                    <Badge variant="darkblue" style={{ minWidth: 200 }}>{this.state.modifiedRequest.start?.tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z')}</Badge>
                                    <RiArrowRightLine size={30} className="fill-darkblue mx-3"/>
                                    <Badge variant="darkblue" style={{ minWidth: 200 }}>{this.state.modifiedRequest.end?.tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z')}</Badge>
                                </div>
                                <Slider.Range
                                    // @ts-ignore
                                    step={null}
                                    marks={marks}
                                    allowCross={false}
                                    min={moment(this.state.request.start).valueOf()}
                                    max={moment(this.state.request.end).valueOf()}
                                    defaultValue={[moment(this.state.request.start).valueOf(), moment(this.state.request.end).valueOf()]}
                                    onChange={(val) => {
                                        let newRequest = {...this.state.modifiedRequest}
                                        newRequest['start'] = moment(val[0])
                                        newRequest['end'] = moment(val[1])

                                        this.setState({
                                            modifiedRequest: newRequest,
                                        })
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
                                                value: this.state.modifiedRequest.type,
                                                label: typeDisplay(this.state.modifiedRequest.type),
                                            }}
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
                                            value={{
                                                value: this.state.modifiedRequest.level,
                                                label: levelDisplay(this.state.modifiedRequest.level),
                                            }}
                                            onChange={this.handleLevelChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                            <Form.Group>
                                <Form.Label>Position (Optional)</Form.Label>
                                <Form.Control type="text" name="position" value={this.state.modifiedRequest.position} onChange={this.handlePositionChange}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="lightgray" onClick={() => this.setState({showRequestModal: false})}>
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

export default withSnackbar(TrainingRequests)
