import 'tui-calendar/dist/tui-calendar.css'
import Fade from 'react-reveal/Fade'
import TuiCalendar from '../../../components/TuiCalendar'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import axiosInstance from '../../../helpers/axiosInstance'
import { subHours } from 'date-fns'
import { RiQuestionLine } from 'react-icons/all'
import IconAlert from '../../../components/IconAlert'

export default function RequestLOA() {
    const [request, setRequest] = useState<any>({})
    const [showRequestModal, setShowRequestModal] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const handleSubmitRequest = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/loa/', request)
            .then(res => {
                setShowRequestModal(false)
                enqueueSnackbar('Successfully submitted LOA request', {
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

    const handleTextChange = (event) => {
        let modifiedRequest = { ...request }
        modifiedRequest[event.target.name] = event.target.value
        setRequest(modifiedRequest)
    }

    const handleDateChange = (event) => {
        let modifiedRequest = { ...request }
        modifiedRequest[event.target.name] = event.target.value
        setRequest(modifiedRequest)
    }

    const handleCreateSchedule = (event) => {
        if (event.start.toDate() < new Date()) {
            enqueueSnackbar('LOA must begin after the current day', {
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
            })
        } else {
            setShowRequestModal(true)
            setRequest({
                start: subHours(event.start.toDate(), 23).toISOString().split('T')[0],
                end: subHours(event.end.toDate(), 23).toISOString().split('T')[0],
            })
        }
        event.guide.clearGuideElement()
    }

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                <IconAlert variant="purple" className="mb-4" icon={RiQuestionLine} header="How do I use this?">
                    <p className="m-0">
                        To request a leave of absence, indicate the days for which you will be unable to remain active within the ARTCC.
                        To select a range, drag your mouse across multiple boxes on the calendar below.
                        Once your request is reviewed, you will receive an email with the status of your LOA.
                    </p>
                </IconAlert>
                <TuiCalendar view="month" onCreateSchedule={handleCreateSchedule}/>
            </Fade>
            <Modal
                show={showRequestModal}
                onHide={() => setShowRequestModal(false)}
                centered
            >
                <Form onSubmit={handleSubmitRequest}>
                    <Modal.Header closeButton>
                        <Modal.Title>Request LOA</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Start (Zulu)</Form.Label>
                            <Form.Control required type="date" name="start" value={request?.start} onChange={handleDateChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End (Zulu)</Form.Label>
                            <Form.Control required type="date" name="end" value={request?.end} onChange={handleDateChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control required as="textarea" rows={5} name="remarks" onChange={handleTextChange}/>
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
