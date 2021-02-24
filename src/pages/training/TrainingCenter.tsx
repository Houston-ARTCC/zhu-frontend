import React, { Component } from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Sessions from './Sessions'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'

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
                                <ListGroup.Item as="li" active>
                                    Sessions
                                </ListGroup.Item>
                            </Col>
                            <Col className="ml-5">
                                <Sessions/>
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </>
        )
    }
}

export default withSnackbar(TrainingCenter)
