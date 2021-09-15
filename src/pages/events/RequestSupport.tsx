import Header from '../../components/Header'
import Fade from 'react-reveal/Fade'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'
import { getCID, getFullName } from '../../helpers/auth'
import StarRating from '../../components/StarRating'
import { AiOutlineCheckCircle } from 'react-icons/all'
import axiosInstance from '../../helpers/axiosInstance'

export default function RequestSupport() {
    const [supportForm, setSupportForm] = useState<any>({})
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    const handleTextChange = (event) => {
        let updatedForm = { ...supportForm }
        updatedForm[event.target.name] = event.target.value
        setSupportForm(updatedForm)
    }

    const handleDateChange = (event) => {
        let updatedForm = { ...supportForm }
        updatedForm[event.target.name] = event.target.value + 'Z'
        setSupportForm(updatedForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/events/support/', supportForm)
            .then(res => {
                enqueueSnackbar('Successfully submitted support request', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowSuccessModal(true)
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

    return (
        <>
            <Header title="Request Support"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control required type="text" name="name" onChange={handleTextChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Banner</Form.Label>
                                        <Form.Control type="url" name="banner" onChange={handleTextChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Host</Form.Label>
                                        <Form.Control type="text" name="host" onChange={handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="start" onChange={handleDateChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>End (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="end" onChange={handleDateChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Your Name</Form.Label>
                                        <Form.Control required type="text" value={getFullName()} disabled/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Your CID</Form.Label>
                                        <Form.Control required type="text" value={getCID()} disabled/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                            <Col md={7}>
                                <Form.Group>
                                    <Form.Label>Event Description</Form.Label>
                                    <Form.Control required as="textarea" rows={8} name="comments" value={supportForm.comments} onChange={handleTextChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="mb-3" variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </Fade>
            <Modal backdrop="static" show={showSuccessModal} centered>
                <Modal.Body className="text-center">
                    <AiOutlineCheckCircle className="fill-green mb-3" size={80}/>
                    <h5 className="mb-4">Your support request has been successfully submitted! You will be redirected to the homepage.</h5>
                    <Button variant="primary" onClick={() => history.push('/')}>
                        Hooray!
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}
