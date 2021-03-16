import React, { Component } from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { Link } from 'react-router-dom'
import { isTrainingStaff } from '../../helpers/auth'

class TrainingCenter extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            activeNav: 'Sessions',
        }
    }
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
                                    <div className="mb-5">
                                        <h6 className="text-primary">Student</h6>
                                        <ListGroup.Item as="li" active={this.state.activeNav === 'Sessions'}>
                                            <Link
                                                to="/training"
                                                onClick={() => this.setState({ activeNav: 'Sessions' })}
                                            >
                                                Sessions
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={this.state.activeNav === 'Request Training'}>
                                            <Link
                                                to="/training/request"
                                                onClick={() => this.setState({ activeNav: 'Request Training' })}
                                            >
                                                Request Training
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={this.state.activeNav === 'Exams'}>
                                            <Link
                                                to="/training/exams"
                                                onClick={() => this.setState({ activeNav: 'Exams' })}
                                            >
                                                Exams
                                            </Link>
                                        </ListGroup.Item>
                                    </div>
                                    {isTrainingStaff() &&
                                        <div>
                                            <h6 className="text-primary">Instructor</h6>
                                            <ListGroup.Item as="li" active={this.state.activeNav === 'Scheduled Sessions'}>
                                                <Link
                                                    to="/training/schedule"
                                                    onClick={() => this.setState({ activeNav: 'Scheduled Sessions' })}
                                                >
                                                    Scheduled Sessions
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.state.activeNav === 'Training Requests'}>
                                                <Link
                                                    to="/training/requests"
                                                    onClick={() => this.setState({ activeNav: 'Training Requests' })}
                                                >
                                                    Training Requests
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.state.activeNav === 'Student Profile'}>
                                                <Link
                                                    to="/training/profile"
                                                    onClick={() => this.setState({ activeNav: 'Student Profile' })}
                                                >
                                                    Student Profile
                                                </Link>
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li" active={this.state.activeNav === 'Assign Exam'}>
                                                <Link
                                                    to="/training/assign"
                                                    onClick={() => this.setState({ activeNav: 'Assign Exam' })}
                                                >
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
