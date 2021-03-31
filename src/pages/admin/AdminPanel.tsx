import React, { Component } from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import 'react-quill/dist/quill.snow.css'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { isAdmin, isSeniorStaff } from '../../helpers/auth'

export default class AdminPanel extends Component<any, any> {
    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Site Administration"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row>
                            <Col md={2}>
                                <div style={{ top: 150 }} className="p-0 sticky-top">
                                    <div className="mb-4">
                                        <h6 className="text-primary">General</h6>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/admin'}>
                                            <Link to="/admin">
                                                ARTCC Information
                                            </Link>
                                        </ListGroup.Item>
                                        {isAdmin() &&
                                            <ListGroup.Item as="li">
                                                <a href={process.env.REACT_APP_API_URL + '/admin'} target="_blank" rel="noreferrer">
                                                    Django Panel
                                                </a>
                                            </ListGroup.Item>
                                        }
                                    </div>
                                    <div className="mb-4">
                                        <h6 className="text-primary">Approval Queue</h6>
                                        {isAdmin() &&
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/visit'}>
                                                <Link to="/admin/visit">
                                                    Visiting Requests
                                                </Link>
                                            </ListGroup.Item>
                                        }
                                        {isSeniorStaff() &&
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/feedback'}>
                                                <Link to="/admin/feedback">
                                                    Pending Feedback
                                                </Link>
                                            </ListGroup.Item>
                                        }
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/support'}>
                                            <Link to="/admin/support">
                                                Event Support
                                            </Link>
                                        </ListGroup.Item>
                                    </div>
                                    <div className="mb-4">
                                        <h6 className="text-primary">Roster</h6>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/user'}>
                                            <Link to="/admin/user">
                                                Find User
                                            </Link>
                                        </ListGroup.Item>
                                        {isAdmin() &&
                                            <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/purge'}>
                                                <Link to="/admin/purge">
                                                    Roster Purge
                                                </Link>
                                            </ListGroup.Item>
                                        }
                                    </div>
                                    <div>
                                        <h6 className="text-primary">Announcements</h6>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/announcement'}>
                                            <Link to="/admin/announcement">
                                                Site Announcement
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={this.props.location.pathname === '/admin/broadcast'}>
                                            <Link to="/admin/broadcast">
                                                Email Broadcast
                                            </Link>
                                        </ListGroup.Item>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ml-5">
                                {this.props.view}
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </div>
        )
    }
}
