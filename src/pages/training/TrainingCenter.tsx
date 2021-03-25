import React, { Component } from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { Link } from 'react-router-dom'
import { isTrainingStaff } from '../../helpers/auth'

class TrainingCenter extends Component<any, any> {
    render() {
        return (
            <>
                <Navigation/>
                <Header title="Training Center"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row>
                            <Col md={2}>
                                <div style={{ top: 150 }} className="p-0 sticky-top">
                                    <div className="mb-4">
                                        <h6 className="text-primary">Student</h6>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/training' || this.props.location.pathname === '/training/sessions'}>
                                            <Link to="/training">
                                                Sessions
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/training/request'}>
                                            <Link to="/training/request">
                                                Request Training
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/training/exams'}>
                                            <Link to="/training/exams">
                                                Exams
                                            </Link>
                                        </ListGroup.Item>
                                    </div>
                                    {isTrainingStaff() &&
                                        <div>
                                            <h6 className="text-primary">Instructor</h6>
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/training/schedule'}>
                                                <Link to="/training/schedule">
                                                    Scheduled Sessions
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/training/requests'}>
                                                <Link to="/training/requests">
                                                    Training Requests
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/training/profile'}>
                                                <Link to="/training/profile">
                                                    Student Profile
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/training/mentor'}>
                                                <Link to="/training/mentor">
                                                    Mentor History
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/training/assign'}>
                                                <Link to="/training/assign">
                                                    Assign Exam
                                                </Link>
                                            </ListGroup.Item>
                                        </div>
                                    }
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
