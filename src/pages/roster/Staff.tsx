import React, { useEffect, useState } from 'react';
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { BiEnvelope } from 'react-icons/all'
import ScrollSpy from 'react-scrollspy'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import profilePlaceholder from '../../img/profile.png'

export default function Staff() {
    const [staff, setStaff] = useState(Object)

    useEffect(() => {
        axiosInstance
            .get('/api/users/staff/')
            .then(res => setStaff(res.data))
    })

    return (
        <div>
            <Header title="Staff"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <ScrollSpy
                                as={ListGroup}
                                style={{ top: 150 }}
                                className="p-0 mb-3 sticky-top"
                                currentClassName="active"
                                items={['core-staff', 'assistant-staff', 'training-team', 'web-team']}
                                offset={-150}
                            >
                                <ListGroup.Item as="li">
                                    <a href="#core-staff">Core Staff</a>
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    <a href="#assistant-staff">Assistant Staff</a>
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    <a href="#training-team">Training Team</a>
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    <a href="#web-team">Web Team</a>
                                </ListGroup.Item>
                            </ScrollSpy>
                        </Col>
                        <Col className="ml-0 ml-md-5">
                            <section className="mb-5" id="core-staff">
                                <h2 className="font-w700">Core Staff</h2>
                                <h5 className="text-gray mb-3">Responsible for the bulk of ARTCC operations.</h5>
                                <Row>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Body>
                                                {renderUser(staff?.atm?.user, 'Air Traffic Manager')}
                                                <p className="mt-3">Responsible for the macro-management of the ARTCC. Oversees day-to-day operations and ensures the ARTCC runs smoothly.</p>
                                                <a className="text-black font-w700" href="mailto:atm@zhuartcc.org">
                                                    <BiEnvelope size={20} viewBox="0 3 22 22"/> Mail
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Body>
                                                {renderUser(staff?.datm?.user, 'Deputy Air Traffic Manager')}
                                                <p className="mt-3">Assists the Air Traffic Manager with the management of the ARTCC. Acts as the ATM when necessary.</p>
                                                <a className="text-black font-w700" href="mailto:datm@zhuartcc.org">
                                                    <BiEnvelope size={20} viewBox="0 3 22 22"/> Mail
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Body>
                                                {renderUser(staff?.ta?.user, 'Training Administrator')}
                                                <p className="mt-3">Responsible for the creation of training programs and procedures. Oversees instructors and mentors.</p>
                                                <a className="text-black font-w700" href="mailto:ta@zhuartcc.org">
                                                    <BiEnvelope size={20} viewBox="0 3 22 22"/> Mail
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Body>
                                                {renderUser(staff?.fe?.user, 'Facility Engineer')}
                                                <p className="mt-3">Responsible for the creation of sector files, radar client files, training scenarios, and other ARTCC resources.</p>
                                                <a className="text-black font-w700" href="mailto:fe@zhuartcc.org">
                                                    <BiEnvelope size={20} viewBox="0 3 22 22"/> Mail
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Body>
                                                {renderUser(staff?.ec?.user, 'Events Coordinator')}
                                                <p className="mt-3">Responsible for the planning and advertising of events with neighboring facilities, virtual airlines, VATUSA, and VATSIM.</p>
                                                <a className="text-black font-w700" href="mailto:ec@zhuartcc.org">
                                                    <BiEnvelope size={20} viewBox="0 3 22 22"/> Mail
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Body>
                                                {renderUser(staff?.wm?.user, 'Webmaster')}
                                                <p className="mt-3">Responsible for the operation and maintenance of ARTCC IT services. Oversees the web team.</p>
                                                <a className="text-black font-w700" href="mailto:wm@zhuartcc.org">
                                                    <BiEnvelope size={20} viewBox="0 3 22 22"/> Mail
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </section>
                            <section className="mb-5" id="assistant-staff">
                                <h2 className="font-w700">Assistant Staff</h2>
                                <h5 className="text-gray mb-3">Assist the senior staff in their respective duties.</h5>
                                <Row>
                                    {staff?.ta?.assistants.map(user => renderUserCard(user, 'Assistant Training Administrator'))}
                                    {staff?.fe?.assistants.map(user => renderUserCard(user, 'Assistant Facility Engineer'))}
                                    {staff?.ec?.assistants.map(user => renderUserCard(user, 'Assistant Events Coordinator'))}
                                    {staff?.wm?.assistants.map(user => renderUserCard(user, 'Assistant Webmaster'))}
                                </Row>
                            </section>
                            <section className="mb-5" id="training-team">
                                <h2 className="font-w700">Training Team</h2>
                                <h5 className="text-gray mb-3">Responsible for mentoring and training controllers.</h5>
                                <Row>
                                    {staff?.ins?.map(instructor => renderUserCard(instructor, 'Instructor'))}
                                    {staff?.mtr?.map(mentor => renderUserCard(mentor, 'Mentor'))}
                                </Row>
                            </section>
                            <section id="web-team">
                                <h2 className="font-w700">Web Team</h2>
                                <h5 className="text-gray mb-3">Assist the webmaster with maintaining ARTCC IT services.</h5>
                                <Row>
                                    {staff?.web?.map(web => renderUserCard(web, 'Web Team'))}
                                </Row>
                            </section>
                        </Col>
                    </Row>
                </Container>
            </Fade>
        </div>
    )
}

function renderUser(user, title) {
    return (
        <div className="d-flex align-items-center">
            <img
                className="profile-lg mr-3"
                src={user ? process.env.REACT_APP_API_URL + user.profile : profilePlaceholder}
                alt={user ? user.first_name + ' ' + user.last_name : 'Vacant'}
            />
            <div>
                <h4 className="mb-1 text-black">{user ? user.first_name + ' ' + user.last_name : 'Vacant'}</h4>
                <p className="text-gray m-0">{title}</p>
            </div>
        </div>
    )
}

function renderUserCard(user, title) {
    return (
        <Col md={6}>
            <Card>
                <Card.Body>
                    {renderUser(user, title)}
                </Card.Body>
            </Card>
        </Col>
    )
}
