import { useEffect, useState } from 'react'
import { IoStar, IoStarOutline, RiCheckboxCircleFill, RiCheckboxCircleLine, RiCloseCircleFill, RiMailFill } from 'react-icons/all'
import { Button, Card, Col, Form, FormGroup, Modal, Row } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'
import IconAlert from '../../../components/IconAlert'

export default function PendingFeedback({ updateNotifs }) {
    const [feedback, setFeedback] = useState([])
    const [showConfirmApproveModal, setShowConfirmApproveModal] = useState(false)
    const [showConfirmRejectModal, setShowConfirmRejectModal] = useState(false)
    const [currentFeedback, setCurrentFeedback] = useState<any>({})
    const [reason, setReason] = useState('')

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchFeedback(), [])
    useEffect(() => updateNotifs(), [feedback]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchFeedback = () => {
        axiosInstance
            .get('/api/feedback/')
            .then(res => setFeedback(res.data))
    }

    const approveFeedback = (feedback) => {
        axiosInstance
            .put('/api/feedback/' + feedback.id + '/')
            .then(res => {
                fetchFeedback()
                enqueueSnackbar('Approved feedback for ' + (feedback.controller ? feedback.controller.first_name + ' ' + feedback.controller.last_name : 'the Houston ARTCC'), {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowConfirmApproveModal(false)
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

    const rejectFeedback = (feedback) => {
        axiosInstance
            .delete('/api/feedback/' + feedback.id + '/', { data: { reason: reason } })
            .then(res => {
                fetchFeedback()
                enqueueSnackbar('Rejected feedback for ' + (feedback.controller ? feedback.controller.first_name + ' ' + feedback.controller.last_name : 'the Houston ARTCC'), {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowConfirmRejectModal(false)
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

    const FeedbackCard = ({ feedback }) => (
        <Col md={6}>
            <Card>
                <Card.Body>
                    <div className="d-flex align-items-baseline">
                        <h4 className="text-black font-w700 mb-0 mr-2">{feedback.controller ? feedback.controller.first_name + ' ' + feedback.controller.last_name : 'General ARTCC Feedback'}</h4>
                        {feedback.controller && <h6 className="text-gray font-w500 mb-0">on {feedback.controller_callsign}</h6>}
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
                        {feedback.pilot_callsign && <p>Callsign: {feedback.pilot_callsign}</p>}
                    </blockquote>
                    <Button
                        variant="bg-green"
                        className="mr-2"
                        onClick={() => {
                            setShowConfirmApproveModal(true)
                            setCurrentFeedback(feedback)
                        }}
                    >
                        <RiCheckboxCircleFill viewBox="1 1 25 25"/> Approve
                    </Button>
                    <Button
                        variant="bg-red"
                        onClick={() => {
                            setShowConfirmRejectModal(true)
                            setCurrentFeedback(feedback)
                        }}
                    >
                        <RiCloseCircleFill viewBox="1 1 25 25"/> Reject
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    )

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                {feedback.length > 0
                    ? <Row>
                        {feedback.map(feedback => <FeedbackCard feedback={feedback}/>)}
                    </Row>
                    : <IconAlert variant="green" icon={RiCheckboxCircleLine} header="All caught up!">
                        <p className="m-0">There is currently no feedback pending review.</p>
                    </IconAlert>
                }
            </Fade>
            <Modal
                show={showConfirmApproveModal}
                onHide={() => setShowConfirmApproveModal(false)}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Approve Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you would like to <b>approve</b> feedback for {currentFeedback.controller ? currentFeedback.controller.first_name + ' ' + currentFeedback.controller.last_name : 'the Houston ARTCC'}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="lightgray" onClick={() => setShowConfirmApproveModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => approveFeedback(currentFeedback)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                size="lg"
                show={showConfirmRejectModal}
                onHide={() => {
                    setShowConfirmRejectModal(false)
                    setReason('')
                }}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Reject Feedback</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to <b>reject</b> feedback for {currentFeedback.controller ? currentFeedback.controller.first_name + ' ' + currentFeedback.controller.last_name : 'the Houston ARTCC'}?</p>
                        <FormGroup className="mb-0">
                            <Form.Label>The pilot will be sent the following as the reason for rejection:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="reason"
                                required
                                rows={2}
                                value={reason}
                                onChange={event => setReason(event.target.value)}
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowConfirmRejectModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" onClick={(e) => {
                            e.preventDefault()
                            rejectFeedback(currentFeedback)
                        }}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
