import React, { useEffect, useState } from 'react'
import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'
import { isTrainingStaff } from '../../helpers/auth'
import { useLocation } from 'react-router'
import axiosInstance from '../../helpers/axiosInstance'

export default function TrainingCenter(props) {
    const [requestNotifs, setRequestNotifs] = useState(0)

    const location = useLocation()

    useEffect(() => {
        updateNotifs()
    }, [])

    const updateNotifs = () => {
        axiosInstance
            .get('/api/training/notifications/')
            .then(res => {
                setRequestNotifs(res.data.training_requests)
            })
    }

    return (
        <>
            <Header title="Training Center"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <div style={{ top: 150 }} className="p-0 mb-5 sticky-top">
                                <div className="mb-4">
                                    <h6 className="text-primary">Student</h6>
                                    <ListGroup.Item as="li" active={location.pathname === '/training' || location.pathname === '/training/sessions'}>
                                        <Link to="/training">
                                            Sessions
                                        </Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" active={location.pathname === '/training/request'}>
                                        <Link to="/training/request">
                                            Request Training
                                        </Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" active={location.pathname === '/training/exams'}>
                                        <Link to="/training/exams">
                                            Exams
                                        </Link>
                                    </ListGroup.Item>
                                </div>
                                {isTrainingStaff() &&
                                    <div>
                                        <h6 className="text-primary">Instructor</h6>
                                        <ListGroup.Item as="li" active={location.pathname === '/training/scheduled'}>
                                            <Link to="/training/scheduled">
                                                Scheduled Sessions
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={location.pathname === '/training/requests'}>
                                            <Link to="/training/requests">
                                                Training Requests {requestNotifs > 0 && <Badge variant="red rounded">{requestNotifs}</Badge>}
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={location.pathname === '/training/profile'}>
                                            <Link to="/training/profile">
                                                Student Profile
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={location.pathname === '/training/mentor'}>
                                            <Link to="/training/mentor">
                                                Mentor History
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={location.pathname === '/training/assign'}>
                                            <Link to="/training/assign">
                                                Assign Exam
                                            </Link>
                                        </ListGroup.Item>
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col className="ml-0 ml-md-5">
                            <props.view updateNotifs={updateNotifs}/>
                        </Col>
                    </Row>
                </Container>
            </Fade>
        </>
    )
}
