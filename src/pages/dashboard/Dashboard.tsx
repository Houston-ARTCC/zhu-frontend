import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { isMember } from '../../helpers/auth'

export default function Dashboard(props) {
    const location = useLocation()

    return (
        <>
            <Header title="Dashboard"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <div style={{ top: 150 }} className="p-0 mb-5 sticky-top">
                                <div className={isMember() && 'mb-4'}>
                                    <h6 className="text-primary">Other</h6>
                                    <ListGroup.Item as="li" active={location.pathname === '/settings' || location.pathname === '/dashboard'}>
                                        <Link to="/settings">
                                            Settings
                                        </Link>
                                    </ListGroup.Item>
                                </div>
                                {isMember() &&
                                    <div>
                                        <h6 className="text-primary">Requests</h6>
                                        <ListGroup.Item as="li" active={location.pathname === '/bookings'}>
                                            <Link to="/bookings">
                                                Bookings
                                            </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" active={location.pathname === '/loa'}>
                                            <Link to="/loa">
                                                Request LOA
                                            </Link>
                                        </ListGroup.Item>
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col className="ml-0 ml-md-5">
                            <props.view/>
                        </Col>
                    </Row>
                </Container>
            </Fade>
        </>
    )
}
