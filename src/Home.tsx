import { Component } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { getFirstName } from './Helpers'

export default class Home extends Component<any, any> {
    render() {
        return (
            <Container className="text-center">
                <h1>Welcome{getFirstName() ? ' ' + getFirstName() : ''}!</h1>
                <Link to="/login">
                    <Button className="mr-3" variant="light-primary">Login with VATSIM</Button>
                </Link>
                <Link to="/logout">
                    <Button variant="light-danger">Logout</Button>
                </Link>
            </Container>
        )
    }
}
