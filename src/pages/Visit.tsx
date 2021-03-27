import React, { Component } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import axiosInstance from '../helpers/axiosInstance'
import { parseJWT } from '../helpers/auth'

class Visit extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            form: {},
        }
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleTextChange(event) {
        let modifiedForm = { ...this.state.form }
        modifiedForm[event.target.name] = event.target.value;
        this.setState({ form: modifiedForm })
    }

    handleSwitchChange(event) {
        let modifiedForm = { ...this.state.form }
        modifiedForm[event.target.name] = !modifiedForm[event.target.name]
        this.setState({ form: modifiedForm })
    }

    handleSubmit(e) {
        e.preventDefault()
        axiosInstance
            .put('/api/visit/', this.state.form + '/')
            .then(res => {
                this.props.enqueueSnackbar('Successfully submitted visiting request!', {
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
        const user = parseJWT()
        return (
            <div>
                <Navigation/>
                <Header title="Visit Houston"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <p>Hello and thank you for your interest in visiting the virtual Houston ARTCC!</p>
                        <p>If you would like to leave your current facility and join Houston as a home controller, you must instead submit a <a href="https://www.vatusa.net/my/profile">transfer request through VATUSA</a>.</p>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>CID</Form.Label>
                                            <Form.Control required type="number" value={user.cid} readOnly/>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control required type="text" value={user.first_name} readOnly/>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control required type="text" value={user.last_name} readOnly/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" value={user.email} readOnly/>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Home Facility</Form.Label>
                                            <Form.Control required type="text" value={user.facility} readOnly/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Switch required className="mb-3" id="emails" name="emails" label="I agree to receive notification emails from Houston ARTCC." onChange={this.handleSwitchChange}/>
                                    <Form.Switch required className="mb-3" id="privacy" name="privacy" label={<>I have read and agree to the <a href="/privacy" target="_blank">Privacy Policy</a>.</>} onChange={this.handleSwitchChange}/>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Why do you want to visit Houston?</Form.Label>
                                        <Form.Control required as="textarea" rows={5} name="reason" onChange={this.handleTextChange}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button className="mb-3" variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Container>
                </Fade>
            </div>
        )
    }
}

export default withSnackbar(Visit)
