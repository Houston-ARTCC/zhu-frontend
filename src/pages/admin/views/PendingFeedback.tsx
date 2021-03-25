import React, { Component } from 'react'
import { IoStar, IoStarOutline, RiCheckboxCircleFill, RiCheckboxCircleLine, RiCloseCircleFill, RiMailFill } from 'react-icons/all'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'

class PendingFeedback extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            feedback: [],
        }
    }

    componentDidMount() {
        this.fetchFeedback()
    }

    fetchFeedback() {
        axiosInstance
            .get('/api/feedback/')
            .then(res => this.setState({ feedback: res.data }))
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
            .delete('/api/feedback/' + feedback.id + '/')
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
                        <blockquote>
                            <p><em>{feedback.comments}</em></p>
                            <p className="mb-0"><b>{feedback.pilot.first_name} {feedback.pilot.last_name} - {feedback.pilot.cid}</b> <a href={'mailto:' + feedback.pilot.email}><RiMailFill/></a></p>
                            <p>Callsign: {feedback.pilot_callsign}</p>
                        </blockquote>
                        <Button
                            variant="bg-green"
                            className="mr-2"
                            onClick={() => this.approveFeedback(feedback)}
                        >
                            <RiCheckboxCircleFill viewBox="1 1 25 25"/> Approve
                        </Button>
                        <Button
                            variant="bg-red"
                            onClick={() => this.rejectFeedback(feedback)}
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
        )
    }
}

export default withSnackbar(PendingFeedback)
