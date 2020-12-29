import React, { Component } from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default class AllEvents extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
        }
    }

    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {
        axiosInstance
            .get('/api/events')
            .then(res => this.setState({ events: res.data }))
    }

    renderEvent(event) {
        return (
            <Col sm={6}>
                <Link to={`/events/${event.id}`}>
                    <Card className="mb-4">
                        <Card.Header>
                            <Card.Title>{event.name}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Image width="100%" src={event.banner}/>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        )
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Events"/>
                <Container fluid>
                    <Row>
                        {this.state.events.map(event => this.renderEvent(event))}
                    </Row>
                </Container>
            </div>
        )
    }
}
