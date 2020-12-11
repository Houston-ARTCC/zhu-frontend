import { Component } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { getFirstName } from './Helpers'

export default class Home extends Component<any, any> {
    render() {
        return (
            <Container className="text-center">
                <h1>Welcome {getFirstName()}!</h1>
                <Link to="/login">
                    <Button variant="secondary">Login with VATSIM</Button>
                </Link>
            </Container>
        )
    }
}