import React, { Component } from 'react'
import { IoStar, IoStarOutline, RiCheckboxCircleFill, RiCheckboxCircleLine, RiCloseCircleFill, RiMailFill } from 'react-icons/all'
import { Alert, Button, Card, Col, Form, FormGroup, Modal, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'

class PendingFeedback extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            feedback: [],
            showConfirmApproveModal: false,
            showConfirmRejectModal: false,
            currentFeedback: {},
            reason: '',
        }
    }

    componentDidMount() {
        this.fetchFeedback()
    }

    fetchFeedback() {
        axiosInstance
            .get('/api/feedback/')
            .then(res => this.setState({ feedback: res.data }, () => this.props.updateNotifs()))
    }

    approveFeedback(feedback) {
        axiosInstance
            .put('/api/feedback/' + feedback.id + '/')
            .then(res => {
                this.fetchFeedback()
                this.props.enqueueSnackbar('Approved feedback for ' + feedback.controller.first_name + ' ' + feedback.controller.last_name, {
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

    rejectFeedback(feedback) {
        axiosInstance
            .delete('/api/feedback/' + feedback.id + '/', { data: { reason: this.state.reason } })
            .then(res => {
                this.fetchFeedback()
                this.props.enqueueSnackbar('Rejected feedback for ' + feedback.controller.first_name + ' ' + feedback.controller.last_name, {
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

    renderCard(feedback) {
        return (
            <Col md={6}>
                <Card>
                    <Card.Body>
                        <div className="d-flex align-items-baseline">
                            <h4 className="text-black font-w700 mb-0 mr-2">{feedback.controller.first_name} {feedback.controller.last_name}</h4>
                            <h6 className="text-gray font-w500 mb-0">on {feedback.controller_callsign}</h6>
                        </div>
                        <div className="mb-4">
                            {[...Array(5)].map((x, i) => {
                                return (
                                    i >= feedback.rating
                                        ? <IoStarOutline key={i} size={20} className="mr-1"/>
                                        : <IoStar key={i} size={20} className="mr-1"/>
                                )
                            })}
                        </div>
                        <blockquote className="mb-4">
                            <p><em>{feedback.comments}</em></p>
                            <p className="mb-0"><b>{feedback.pilot.first_name} {feedback.pilot.last_name} - {feedback.pilot.cid}</b> <a href={'mailto:' + feedback.pilot.email}><RiMailFill/></a></p>
                            <p>Callsign: {feedback.pilot_callsign}</p>
                        </blockquote>
                        <Button
                            variant="bg-green"
                            className="mr-2"
                            onClick={() => this.setState({ showConfirmApproveModal: true, currentFeedback: feedback })}
                        >
                            <RiCheckboxCircleFill viewBox="1 1 25 25"/> Approve
                        </Button>
                        <Button
                            variant="bg-red"
                            onClick={() => this.setState({ showConfirmRejectModal: true, currentFeedback: feedback })}
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
                    {this.state.feedback.length > 0
                        ? <Row>
                            {this.state.feedback.map(feedback => this.renderCard(feedback))}
                        </Row>
                        : <Alert variant="green" className="position-unset d-flex mb-5">
                            <RiCheckboxCircleLine className="fill-green mr-3" size={25} preserveAspectRatio="xMaxYMin"/>
                            <div>
                                <h5>All caught up!</h5>
                                <p className="m-0">
                                    There is currently no feedback pending review.
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
                        <Modal.Title>Confirm Approve Feedback</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to <b>approve</b> feedback for {this.state.currentFeedback.controller?.first_name} {this.state.currentFeedback.controller?.last_name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => this.setState({ showConfirmApproveModal: false })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.approveFeedback(this.state.currentFeedback)}>
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
                            <Modal.Title>Confirm Reject Feedback</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you would like to <b>reject</b> feedback for {this.state.currentFeedback.controller?.first_name} {this.state.currentFeedback.controller?.last_name}?</p>
                            <FormGroup className="mb-0">
                                <Form.Label>The pilot will be sent the following as the reason for rejection:</Form.Label>
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
                                this.rejectFeedback(this.state.currentFeedback)
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

export default withSnackbar(PendingFeedback)
