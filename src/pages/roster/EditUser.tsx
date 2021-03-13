import React, { Component } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import axiosInstance from '../../helpers/axiosInstance'

class EditUser extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            roles: [],
        }
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleRoleChange = this.handleRoleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.fetchUser()
        this.fetchRoles()
    }

    fetchUser() {
        axiosInstance
            .get('/api/users/' + this.props.match.params.cid)
            .then(res => {
                this.setState({ user: res.data })
            })
    }

    fetchRoles() {
        axiosInstance
            .get('/api/users/roles')
            .then(res => this.setState({ roles: res.data }))
    }

    handleTextChange(event) {
        let modifiedUser = { ...this.state.user }
        modifiedUser[event.target.name] = event.target.value
        this.setState({ user: modifiedUser })
    }

    handleRoleChange(event) {
        let userRoles : any[] = []
        event.map(role => userRoles.push({id: role.id, short: role.value, long: role.label}))
        let modifiedUser = { ...this.state.user }
        modifiedUser['roles'] = userRoles.sort((a, b) => a.id > b.id ? 1 : -1)
        this.setState({ user: modifiedUser })
    }

    handleSubmit(e) {
        e.preventDefault()
        axiosInstance
            .patch('/api/users/' + this.props.match.params.cid + '/', this.state.user)
            .then(res => {
                this.props.enqueueSnackbar('Changes to user details saved!', {
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

    userRolesToOptions() {
        let userRoles : any[] = []
        this.state.user.roles?.map(role => userRoles.push({id: role.id, value: role.short, label: role.long}))
        return userRoles
    }

    render() {
        const roleOptions : any[] = []
        this.state.roles.map(role => roleOptions.push({id: role.id, value: role.short, label: role.long}))

        return (
            <div>
                <Navigation/>
                <Header
                    title={this.state.user.first_name + ' ' + this.state.user.last_name}
                    subtitle="Editing User"
                />
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Link to={'/roster/' + this.props.match.params.cid}>Back to Profile</Link>
                        <div className="text-left">
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col>
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control required type="text" name="first_name" value={this.state.user.first_name}
                                                              onChange={this.handleTextChange}/>
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control required type="text" name="last_name" value={this.state.user.last_name}
                                                              onChange={this.handleTextChange}/>
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                                <Form.Label>Initials</Form.Label>
                                                <Form.Control required type="text" name="initials" value={this.state.user.initials} onChange={this.handleTextChange}/>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control required type="email" name="email" value={this.state.user.email} onChange={this.handleTextChange}/>
                                            </Form.Group>
                                        </Form.Row>
                                    </Col>
                                    <Col>
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Roles</Form.Label>
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    isClearable={false}
                                                    options={roleOptions}
                                                    value={this.userRolesToOptions()}
                                                    onChange={this.handleRoleChange}
                                                />
                                            </Form.Group>
                                        </Form.Row>
                                    </Col>
                                </Row>
                                <Button className="mb-3" variant="primary" type="submit">
                                    Save
                                </Button>
                            </Form>
                        </div>
                    </Container>
                </Fade>
            </div>
        )
    }
}

export default withSnackbar(EditUser)
