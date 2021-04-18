import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import { Alert, Button, Card, Col, Form, FormGroup, Modal, Row } from 'react-bootstrap'
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiCloseCircleFill } from 'react-icons/all'
import axiosInstance from '../../../helpers/axiosInstance'
import { withSnackbar } from 'notistack'

class VisitingRequests extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            requests: [],
            showConfirmApproveModal: false,
            showConfirmRejectModal: false,
            currentRequest: {},
            reason: '',
        }
    }

    componentDidMount() {
        this.fetchRequests()
    }

    fetchRequests() {
        axiosInstance
            .get('/api/visit/')
            .then(res => this.setState({ requests: res.data }, () => this.props.updateNotifs()))
    }

    approveRequest(request) {
        axiosInstance
            .put('/api/visit/' + request.id + '/')
            .then(res => {
                this.fetchRequests()
                this.props.enqueueSnackbar('Approved ' + request.user.first_name + ' ' + request.user.last_name + '\'s visiting application', {
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

    rejectRequest(request) {
        axiosInstance
            .delete('/api/visit/' + request.id + '/', { data: { reason: this.state.reason } })
            .then(res => {
                this.fetchRequests()
                this.props.enqueueSnackbar('Rejected ' + request.user.first_name + ' ' + request.user.last_name + '\'s visiting application', {
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

    renderCard(request) {
        return (
            <Col md={6}>
                <Card>
                    <Card.Body>
                        <div className="d-flex align-items-baseline mb-2">
                            <h4 className="text-black font-w700 mb-0 mr-2">{request.user.first_name} {request.user.last_name}</h4>
                            <h6 className="text-gray font-w500 mb-0">from {request.user.home_facility}</h6>
                        </div>
                        <p className="mb-0"><b>Rating:</b> {request.user.rating.long}</p>
                        <p className="mb-4"><b>CID:</b> {request.user.cid}</p>
                        <blockquote className="mb-4">
                            <em>{request.reason}</em>
                        </blockquote>
                        <Button
                            variant="bg-green"
                            className="mr-2"
                            onClick={() => this.setState({ showConfirmApproveModal: true, currentRequest: request })}
                        >
                            <RiCheckboxCircleFill viewBox="1 1 25 25"/> Approve
                        </Button>
                        <Button
                            variant="bg-red"
                            onClick={() => this.setState({ showConfirmRejectModal: true, currentRequest: request })}
                        >
                            <RiCloseCircleFill viewBox="1 1 25 25"/> Reject
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    render() {
        return (
            <>
                <Fade bottom duration={1250} distance="50px">
                    {this.state.requests.length > 0
                        ? <Row>
                            {this.state.requests.map(request => this.renderCard(request))}
                        </Row>
                        : <Alert variant="green" className="position-unset d-flex mb-5">
                            <RiCheckboxCircleLine className="fill-green mr-3" size={25} preserveAspectRatio="xMaxYMin"/>
                            <div>
                                <h5>All caught up!</h5>
                                <p className="m-0">
                                    There are currently no visiting requests pending review.
                                </p>
                            </div>
                        </Alert>
                    }
                </Fade>
                <Modal
                    show={this.state.showConfirmApproveModal}
                    onHide={() => this.setState({ showConfirmApproveModal: false })}
                    keyboard={false}
                    backdrop="static"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Approve Visitor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to <b>approve</b> {this.state.currentRequest.user?.first_name} {this.state.currentRequest.user?.last_name}'s visiting request?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => this.setState({ showConfirmApproveModal: false })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.approveRequest(this.state.currentRequest)}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="lg"
                    show={this.state.showConfirmRejectModal}
                    onHide={() => this.setState({ showConfirmRejectModal: false, reason: '' })}
                    keyboard={false}
                    backdrop="static"
                    centered
                >
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Reject Visitor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you would like to <b>reject</b> {this.state.currentRequest.user?.first_name} {this.state.currentRequest.user?.last_name}'s visiting request?</p>
                            <FormGroup className="mb-0">
                                <Form.Label>The applicant will be sent the following as the reason for rejection:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="reason"
                                    required
                                    rows={2}
                                    value={this.state.reason}
                                    onChange={event => this.setState({ reason: event.target.value })}
                                />
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="lightgray" onClick={() => this.setState({ showConfirmRejectModal: false })}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" onClick={(e) => {
                                e.preventDefault()
                                this.rejectRequest(this.state.currentRequest)
                            }}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}

export default withSnackbar(VisitingRequests)
