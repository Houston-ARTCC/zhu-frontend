import { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import { Button, Card, Col, Form, FormGroup, Modal, Row } from 'react-bootstrap'
import { HiOutlineCalendar, HiOutlineClock, RiCheckboxCircleFill, RiCheckboxCircleLine, RiCloseCircleFill, RiMailFill } from 'react-icons/all'
import axiosInstance from '../../../helpers/axiosInstance'
import { useSnackbar } from 'notistack'
import parse from 'html-react-parser'
import { format } from 'date-fns-tz'
import IconAlert from '../../../components/IconAlert'

export default function SupportRequests({ updateNotifs }) {
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
            .get('/api/events/support/')
            .then(res => setRequests(res.data))
    }

    const approveRequest = (request) => {
        axiosInstance
            .put('/api/events/support/' + request.id + '/')
            .then(res => {
                fetchRequests()
                enqueueSnackbar('Approved support for "' + request.name + '"', {
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
            .delete('/api/events/support/' + request.id + '/', { data: { reason: reason } })
            .then(res => {
                fetchRequests()
                enqueueSnackbar('Rejected support for "' + request.name + '"', {
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
                    <h5 className="text-black font-w700 mb-0">{request.name}</h5>
                    <h6 className="text-gray font-w500 mb-3">Presented by {request.host}</h6>
                    <div className="li-flex">
                        <HiOutlineCalendar size={25} className="mr-2"/>
                        <p className="font-w500 font-md mb-0">{format(new Date(request.start), 'MMM d, Y')}</p>
                    </div>
                    <div className="li-flex mb-4">
                        <HiOutlineClock size={25} className="mr-2"/>
                        <p className="font-w500 font-md mb-0">{format(new Date(request.start), 'HH:mm zzz')} →&nbsp;</p>
                        <p className="font-w500 font-md mb-0">{format(new Date(request.end), 'HH:mm zzz')}</p>
                    </div>
                    <blockquote>
                        <p>
                            {request.description
                                ? parse(request.description?.replace(/(?:\r\n|\r|\n)/g, '<br/>'))
                                : ''
                            }
                        </p>
                    </blockquote>
                    <p className="font-w700 mb-0">{request.user.first_name} {request.user.last_name}</p>
                    <p className="mb-4"><a href={'mailto:' + request.user.email}><b className="text-gray">Contact <RiMailFill className="fill-gray"/></b></a></p>
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
                        <p className="m-0">There are currently no event support requests pending review.</p>
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
                    <Modal.Title>Confirm Approve Support Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you would like to <b>approve</b> the event support request for {currentRequest?.name}?</p>
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
                        <Modal.Title>Confirm Reject Support Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to <b>reject</b> the event support request for {currentRequest?.name}?</p>
                        <FormGroup className="mb-0">
                            <Form.Label>The user will be sent the following as the reason for rejection:</Form.Label>
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
