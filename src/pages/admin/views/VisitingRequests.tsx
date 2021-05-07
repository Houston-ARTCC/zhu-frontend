import { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import { Button, Card, Col, Form, FormGroup, Modal, Row } from 'react-bootstrap'
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiCloseCircleFill } from 'react-icons/all'
import axiosInstance from '../../../helpers/axiosInstance'
import { useSnackbar } from 'notistack'
import IconAlert from '../../../components/IconAlert'

export default function VisitingRequests({ updateNotifs }) {
    const [requests, setRequests] = useState([])
    const [showConfirmApproveModal, setShowConfirmApproveModal] = useState(false)
    const [showConfirmRejectModal, setShowConfirmRejectModal] = useState(false)
    const [currentRequest, setCurrentRequest] = useState<any>({})
    const [reason, setReason] = useState('')

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchRequests(), [])
    useEffect(() => updateNotifs(), [requests]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchRequests = () => {
        axiosInstance
            .get('/api/visit/')
            .then(res => setRequests(res.data))
    }

    const approveRequest = (request) => {
        axiosInstance
            .put('/api/visit/' + request.id + '/')
            .then(res => {
                fetchRequests()
                enqueueSnackbar('Approved ' + request.user.first_name + ' ' + request.user.last_name + '\'s visiting application', {
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

    const rejectRequest = (request) => {
        axiosInstance
            .delete('/api/visit/' + request.id + '/', { data: { reason: reason } })
            .then(res => {
                fetchRequests()
                enqueueSnackbar('Rejected ' + request.user.first_name + ' ' + request.user.last_name + '\'s visiting application', {
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

    const RequestCard = ({ request }) => (
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
                        onClick={() => {
                            setShowConfirmApproveModal(true)
                            setCurrentRequest(request)
                        }}
                    >
                        <RiCheckboxCircleFill viewBox="1 1 25 25"/> Approve
                    </Button>
                    <Button
                        variant="bg-red"
                        onClick={() => {
                            setShowConfirmRejectModal(true)
                            setCurrentRequest(request)
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
                {requests.length > 0
                    ? <Row>
                        {requests.map(request => <RequestCard request={request}/>)}
                    </Row>
                    : <IconAlert variant="green" icon={RiCheckboxCircleLine} header="All caught up!">
                        <p className="m-0">There are currently no visiting requests pending review.</p>
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
                    <Modal.Title>Confirm Approve Visitor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you would like to <b>approve</b> {currentRequest.user?.first_name} {currentRequest.user?.last_name}'s visiting request?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="lightgray" onClick={() => setShowConfirmApproveModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => approveRequest(currentRequest)}>
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
                        <Modal.Title>Confirm Reject Visitor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to <b>reject</b> {currentRequest.user?.first_name} {currentRequest.user?.last_name}'s visiting request?</p>
                        <FormGroup className="mb-0">
                            <Form.Label>The applicant will be sent the following as the reason for rejection:</Form.Label>
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
                            rejectRequest(currentRequest)
                        }}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
