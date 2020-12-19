import { Component } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import axiosInstance from "../axiosInstance"
import swal from "@sweetalert/with-react"
import Select  from 'react-select'
import qs from 'qs'
import { FaTimes, FaUserTimes } from "react-icons/all";

export default class EditUser extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchUser()
    }

    fetchUser() {
        axiosInstance
            .get('/api/users/' + this.props.match.params.cid)
            .then(res => this.setState({ user: res.data }))
    }

    handleTextChange(event) {
        let modifiedUser = {...this.state.user}
        modifiedUser[event.target.name] = event.target.value;
        this.setState({user: modifiedUser})
    }

    handleSubmit(e) {
        e.preventDefault();
        axiosInstance
            .put('/api/users/' + this.props.match.params.cid + '/', qs.stringify({...this.state.user}))
            .then(res => swal({
                title: 'Success!',
                text: 'User details were successfully saved.',
                icon: 'success',
                buttons: {
                    return: 'Return to Profile',
                    confirm: 'Continue Editing',
                }
            }).then((value) => {
                switch (value) {
                    case 'return':
                        this.props.history.push('/roster/' + this.props.match.params.cid)
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
                    cancel: 'Return to Profile',
                }
            }))
    }

    render() {
        return (
            <Container className="text-center">
                <Link to={'/events/' + this.props.match.params.id}>&lt; Back to Event</Link>
                <h1 className="my-4">Editing {this.state.user.first_name} {this.state.user.last_name}</h1>
                <div className="text-left">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control required type="text" name="first_name" value={this.state.user.first_name} onChange={this.handleTextChange}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control required type="text" name="last_name" value={this.state.user.last_name} onChange={this.handleTextChange}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control required type="email" name="email" value={this.state.user.email} onChange={this.handleTextChange}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Initials</Form.Label>
                                <Form.Control required type="text" name="initials" value={this.state.user.initials} onChange={this.handleTextChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Button className="mb-3" variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </div>
            </Container>
        )
    }
}
