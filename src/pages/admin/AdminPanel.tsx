import React, { useEffect, useState } from 'react'
import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import 'react-quill/dist/quill.snow.css'
import Header from '../../components/Header'
import { isAdmin, isSeniorStaff } from '../../helpers/auth'
import { useLocation } from 'react-router'
import axiosInstance from '../../helpers/axiosInstance'

export default function AdminPanel(props) {
    const [visitingNotifs, setVisitingNotifs] = useState(0)
    const [feedbackNotifs, setFeedbackNotifs] = useState(0)
    const [supportNotifs, setSupportNotifs] = useState(0)
    const [loaNotifs, setLoaNotifs] = useState(0)

    const location = useLocation()

    useEffect(() => updateNotifs(), [])

    const updateNotifs = () => {
        axiosInstance
            .get('/api/administration/notifications/')
            .then(res => {
                setVisitingNotifs(res.data.visiting_applications)
                setFeedbackNotifs(res.data.pending_feedback)
                setSupportNotifs(res.data.support_requests)
                setLoaNotifs(res.data.loa_requests)
            })
    }

    return (
        <div>
            <Header title="Site Administration"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <div style={{ top: 150 }} className="mb-5 p-0 sticky-top">
                                <div className="mb-4">
                                    <h6 className="text-primary">General</h6>
                                    <ListGroup.Item as="li" active={location.pathname === '/admin'}>
                                        <Link to="/admin">
                                            ARTCC Information
                                        </Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/audit'}>
                                        <Link to="/admin/audit">
                                            Audit Log
                                        </Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li">
                                        <a href={process.env.REACT_APP_API_URL + '/admin'} target="_blank" rel="noreferrer">
                                            Django Panel
                                        </a>
                                    </ListGroup.Item>
                                </div>
                                <div className="mb-4">
                                    <h6 className="text-primary">Announcements</h6>
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/announcement'}>
                                        <Link to="/admin/announcement">
                                            Site Announcement
                                        </Link>
                                    </ListGroup.Item>
                                </div>
                                <div className="mb-4">
                                    <h6 className="text-primary">Roster</h6>
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/user'}>
                                        <Link to="/admin/user">
                                            Find User
                                        </Link>
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/scores'}>
                                        <Link to="/admin/scores">
                                            Event Scores
                                        </Link>
                                    </ListGroup.Item>
                                    {isAdmin() &&
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/purge'}>
                                        <Link to="/admin/purge">
                                            Roster Purge
                                        </Link>
                                    </ListGroup.Item>
                                    }
                                    {isAdmin() &&
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/loa'}>
                                        <Link to="/admin/loa">
                                            LOA Requests {loaNotifs > 0 && <Badge variant="red rounded">{loaNotifs}</Badge>}
                                        </Link>
                                    </ListGroup.Item>
                                    }
                                </div>
                                <div>
                                    <h6 className="text-primary">Approval Queue</h6>
                                    {isAdmin() &&
                                        <ListGroup.Item as="li" active={location.pathname === '/admin/visit'}>
                                            <Link to="/admin/visit">
                                                Visiting Requests {visitingNotifs > 0 && <Badge variant="red rounded">{visitingNotifs}</Badge>}
                                            </Link>
                                        </ListGroup.Item>
                                    }
                                    {isSeniorStaff() &&
                                        <ListGroup.Item as="li" active={location.pathname === '/admin/feedback'}>
                                            <Link to="/admin/feedback">
                                                Pending Feedback {feedbackNotifs > 0 && <Badge variant="red rounded">{feedbackNotifs}</Badge>}
                                            </Link>
                                        </ListGroup.Item>
                                    }
                                    <ListGroup.Item as="li" active={location.pathname === '/admin/support'}>
                                        <Link to="/admin/support">
                                            Event Support {supportNotifs > 0 && <Badge variant="red rounded">{supportNotifs}</Badge>}
                                        </Link>
                                    </ListGroup.Item>
                                </div>
                            </div>
                        </Col>
                        <Col className="ml-0 ml-md-5">
                            <props.view updateNotifs={updateNotifs}/>
                        </Col>
                    </Row>
                </Container>
            </Fade>
        </div>
    )
}
