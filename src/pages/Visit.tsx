import React, { Component } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../components/Header'
import axiosInstance from '../helpers/axiosInstance'
import { parseJWT } from '../helpers/auth'
import { RiCheckFill, RiCloseFill } from 'react-icons/all'

class Visit extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            form: {},
            ratingCheck: false,
            ratingTimeCheck: false,
            ratingHoursCheck: false,
            membershipCheck: false,
            pendingApplicationCheck: false,
            isEligible: false,
        }
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.checkEligibility()
    }

    checkEligibility() {
        axiosInstance
            .get('/api/visit/eligible/')
            .then(res => this.setState({
                ratingCheck: res.data.rating_check,
                ratingTimeCheck: res.data.rating_time_check,
                ratingHoursCheck: res.data.rating_hours_check,
                membershipCheck: res.data.membership_check,
                pendingApplicationCheck: res.data.pending_application_check,
                isEligible: res.data.is_eligible,
            }))
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
            .post('/api/visit/', this.state.form)
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
                <Header title="Visit Houston"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <p>Hello and thank you for your interest in becoming a visiting controller at the virtual Houston ARTCC! Onced trained, visiting controllers are able to control the same positions and fields as home controllers. If you would like to leave your current facility and join Houston as a home controller, you must instead submit a <a href="https://www.vatusa.net/my/profile">transfer request through VATUSA</a>.</p>
                        <p className="mb-5">As per the VATSIM Transfer and Visiting Controller Policy, <b>we are not able to provide rating training to visiting controllers</b>. You must contact your home facility's training department for rating training. The Houston ARTCC training department will only provide local procedure training and major endorsement checkouts.</p>
                        <h4>Visiting Checklist</h4>
                        <ul className="list-unstyled mb-5">
                            <li>
                                {this.state.ratingCheck ? <RiCheckFill size={23} className="mr-2 fill-green"/> : <RiCloseFill size={23} className="mr-2 fill-red"/>}
                                You hold an S2 controller rating or greater
                            </li>
                            <li>
                                {this.state.ratingTimeCheck ? <RiCheckFill size={23} className="mr-2 fill-green"/> : <RiCloseFill size={23} className="mr-2 fill-red"/>}
                                You have held your current rating for at least 90 days
                            </li>
                            <li>
                                {this.state.ratingHoursCheck ? <RiCheckFill size={23} className="mr-2 fill-green"/> : <RiCloseFill size={23} className="mr-2 fill-red"/>}
                                You have at least 50 hours of controlling time at current rating
                            </li>
                            <li>
                                {this.state.membershipCheck ? <RiCheckFill size={23} className="mr-2 fill-green"/> : <RiCloseFill size={23} className="mr-2 fill-red"/>}
                                You are not an active MAVP, visiting, or home controller at Houston
                            </li>
                            <li>
                                {this.state.pendingApplicationCheck ? <RiCheckFill size={23} className="mr-2 fill-green"/> : <RiCloseFill size={23} className="mr-2 fill-red"/>}
                                You do not have any pending visiting applications
                            </li>
                            <hr className="w-25 mx-0 my-2"/>
                            <li>
                                {this.state.isEligible ? <RiCheckFill size={23} className="mr-2 fill-green"/> : <RiCloseFill size={23} className="mr-2 fill-red"/>}
                                You are eligible to apply as a visiting controller at Houston
                            </li>
                        </ul>
                        <Form onSubmit={this.handleSubmit} style={this.state.isEligible ? {} : { opacity: '50%', pointerEvents: 'none' }}>
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
                                        <Form.Group as={Col} md={3}>
                                            <Form.Label>Home Facility</Form.Label>
                                            <Form.Control required type="text" value={user.facility} readOnly/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={3}>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control required type="text" value={user.rating} readOnly/>
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
