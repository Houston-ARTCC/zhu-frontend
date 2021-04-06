import React, { Component } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import axiosInstance from '../helpers/axiosInstance'
import { getCID, getFullName } from '../helpers/auth'

export default class Feedback extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            feedbackForm: {
                rating: 1,
            },
            controllerOptions: [],
            eventOptions: [],
        }
        this.handleControllerChange = this.handleControllerChange.bind(this)
        this.handleEventChange = this.handleEventChange.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleRatingChange = this.handleRatingChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.fetchControllers()
        this.fetchEvents()
    }

    fetchControllers() {
        axiosInstance
            .get('/api/users/simplified/')
            .then(res => {
                let controllers = res.data.home.concat(res.data.visiting).concat(res.data.mavp)
                let controllerOptions : any[] = []
                controllers.map(controller =>
                    controllerOptions.push({
                        value: controller.cid,
                        label: controller.first_name + ' ' + controller.last_name,
                    })
                )
                this.setState({ controllerOptions: controllerOptions })
            })
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events/archived/')
            .then(res => {
                let eventOptions : any[] = []
                res.data.slice(0, 5).map(event =>
                    eventOptions.push({
                        value: event.id,
                        label: event.name,
                    })
                )
                this.setState({ eventOptions: eventOptions })
            })
    }

    handleControllerChange(selected) {
        let updatedForm = { ...this.state.feedbackForm }
        updatedForm['controller'] = selected.value
        this.setState({ feedbackForm: updatedForm })
    }

    handleEventChange(selected) {
        let updatedForm = { ...this.state.feedbackForm }
        updatedForm['event'] = selected.value
        this.setState({ feedbackForm: updatedForm })
    }

    handleTextChange(event) {
        let updatedForm = { ...this.state.feedbackForm }
        updatedForm[event.target.name] = event.target.value
        this.setState({ feedbackForm: updatedForm })
    }

    handleRatingChange(rating) {
        let updatedForm = { ...this.state.feedbackForm }
        updatedForm['rating'] = rating
        this.setState({ feedbackForm: updatedForm })
    }

    handleSubmit(e) {
        e.preventDefault()
        axiosInstance
            .post('/api/feedback/', this.state.feedbackForm)
            .then(res => {
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    render() {
        return (
            <div>
                <Header title="Submit Feedback"/>
                <Container fluid>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Controller's Name</Form.Label>
                                        <Select
                                            options={this.state.controllerOptions}
                                            onChange={this.handleControllerChange}
                                            getOptionLabel={(option) => <span>{option.label} - {option.value}</span>}
                                            filterOption={(obj, filter) => {
                                                return obj.data.label.toLowerCase().includes(filter.toLowerCase())
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Controller Callsign</Form.Label>
                                        <Form.Control type="text" name="controller_callsign" onChange={this.handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event</Form.Label>
                                        <Select
                                            options={this.state.eventOptions}
                                            onChange={this.handleEventChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Your Callsign</Form.Label>
                                        <Form.Control type="text" name="pilot_callsign" onChange={this.handleTextChange}/>
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
                                    <Form.Label>Rating</Form.Label>
                                    <StarRating onChange={this.handleRatingChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Comments</Form.Label>
                                    <Form.Control as="textarea" rows={5} name="comments" value={this.state.feedbackForm.comments} onChange={this.handleTextChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="mb-3" variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </div>
        )
    }
}

// TODO: Implement general ARTCC feedback.
