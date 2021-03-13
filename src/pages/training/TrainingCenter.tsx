import React, { Component } from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { Link } from 'react-router-dom'

class TrainingCenter extends Component<any, any> {
    render() {
        return (
            <>
                <Navigation/>
                <Header title="Training Center"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row>
                            <Col md={3}>
                                <div style={{ top: 150 }} className="p-0 sticky-top">
                                    <ListGroup.Item as="li" active={this.props.view.type.name === "Sessions"}>
                                        <Link to="/training">Sessions</Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" active={this.props.view.type.name === "RequestTraining"}>
                                        <Link to="/training/request">Request Training</Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" active={this.props.view.type.name === "Exams"}>
                                        <Link to="/training/exams">Exams</Link>
                                    </ListGroup.Item>
                                </div>
                            </Col>
                            <Col className="ml-5">
                                {this.props.view}
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </>
        )
    }
}

export default withSnackbar(TrainingCenter)
