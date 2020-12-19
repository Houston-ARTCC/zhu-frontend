import { Component } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import axiosInstance from "../axiosInstance"
import swal from "@sweetalert/with-react"
import Select  from 'react-select'
import qs from 'qs'
import { FaTimes, FaUserTimes } from "react-icons/all";

export default class EditEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {}
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id)
            .then(res => this.setState({ event: res.data }))
    }

    handleTextChange(event) {
        let newEvent = {...this.state.event}
        newEvent[event.target.name] = event.target.value;
        this.setState({event: newEvent})
    }

    handleDateChange(event) {
        let newEvent = {...this.state.event}
        newEvent[event.target.name] = event.target.value + 'Z'
        this.setState({event: newEvent})
    }

    handleSwitchChange(event) {
        let newEvent = {...this.state.event}
        newEvent[event.target.name] = !newEvent[event.target.name]
        this.setState({event: newEvent})
    }

    handleSubmit(e) {
        e.preventDefault();
        axiosInstance
            .put('/api/events/' + this.props.match.params.id + '/', qs.stringify({...this.state.event}))
            .then(res => swal({
                title: 'Success!',
                text: 'Event details were successfully saved.',
                icon: 'success',
                buttons: {
                    return: 'Return to Event',
                    confirm: 'Continue Editing',
                }
            }).then((value) => {
                switch (value) {
                    case 'return':
                        this.props.history.push('/events/' + this.props.match.params.id)
                        break
                    default:
                        break
                }
            }))
            .catch(err => swal({
                title: 'Uh oh!',
                text: 'Something went wrong while processing your request!',
                icon: 'error',
                buttons: {
                    cancel: 'Return to Event',
                }
            }))
    }

    renderPosition(position) {
        const handleAssign = (value) => {
            axiosInstance
                .patch('/api/events/position/' + position.id + '/', qs.stringify({user: value}))
                .then(res => this.fetchEvent())
        }

        const handleDelete = () => {
            axiosInstance
                .delete('/api/events/position/' + position.id)
                .then(res => this.fetchEvent())
        }

        const handleUnassign = () => {
            axiosInstance
                .patch('/api/events/position/' + position.id + '/', qs.stringify({user: null}))
                .then(res => this.fetchEvent())
                .catch(err => console.log(err.response))
        }

        const formatLabel = (request) => {
            return (
                <div>
                    {request.user.first_name} {request.user.last_name} <Badge variant="success">100%</Badge>
                </div>
            )
        }

        return (
            <div className="text-left">
                <p>{position.callsign} - {position.user?.cid}</p>
                <div>
                    <Button variant="bg-danger" onClick={handleDelete}><FaTimes/> <b>Remove</b></Button>
                    <Button variant="bg-info" onClick={handleUnassign}><FaUserTimes/> <b>Unassign</b></Button>
                </div>
                <Select
                    className="mb-3"
                    options={position.requests}
                    getOptionValue={option => option.user.cid}
                    formatOptionLabel={formatLabel}
                    onChange={handleAssign}
                />
            </div>
        )
    }

    render() {
        return (
            <Container className="text-center">
                <Link to={'/events/' + this.props.match.params.id}>&lt; Back to Event</Link>
                <h1 className="my-4">Editing {this.state.event.name}</h1>
                <div className="text-left">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md={4}>
                                <Form.Label>Event Name</Form.Label>
                                <Form.Control required type="text" name="name" value={this.state.event.name} onChange={this.handleTextChange}/>
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                                <Form.Label>Event Host</Form.Label>
                                <Form.Control required type="text" name="host" value={this.state.event.host} onChange={this.handleTextChange}/>
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                                <Form.Label>Banner URL</Form.Label>
                                <Form.Control required type="text" name="banner" value={this.state.event.banner} onChange={this.handleTextChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Start</Form.Label>
                                <Form.Control required type="datetime-local" name="start" value={this.state.event.start?.slice(0, -1)} onChange={this.handleDateChange}/>
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label>End</Form.Label>
                                <Form.Control required type="datetime-local" name="end" value={this.state.event.end?.slice(0, -1)} onChange={this.handleDateChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label> End</Form.Label>
                            <Form.Control as="textarea" rows={5} name="description" value={this.state.event.description} onChange={this.handleTextChange}/>
                        </Form.Group>
                        <Form.Switch className="mb-3" id="hidden" name="hidden" label="Event hidden from controllers." checked={this.state.event.hidden} onChange={this.handleSwitchChange}/>
                        <Button className="mb-3" variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </div>
                <Row>
                    <Col md={4}>{this.state.event.positions?.map(position => this.renderPosition(position))}</Col>
                </Row>
            </Container>
        )
    }
}
