import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';

export default function Theme() {
    return (
        <div className="container">
            <h1>Houston ARTCC</h1>
            <h2>Houston ARTCC</h2>
            <h3>Houston ARTCC</h3>
            <h4>Houston ARTCC</h4>
            <h5>Houston ARTCC</h5>
            <h6>Houston ARTCC</h6>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Subtitle>Card Subtitle</Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="primary" disabled>Primary</Button>
                <Button className="mr-2" variant="secondary" disabled>Secondary</Button>
                <Button className="mr-2" variant="success" disabled>Success</Button>
                <Button className="mr-2" variant="danger" disabled>Danger</Button>
                <Button className="mr-2" variant="warning" disabled>Warning</Button>
                <Button className="mr-2" variant="info" disabled>Info</Button>
                <Button className="mr-2" variant="light" disabled>Light</Button>
                <Button className="mr-2" variant="dark" disabled>Dark</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="primary">Primary</Button>
                <Button className="mr-2" variant="secondary">Secondary</Button>
                <Button className="mr-2" variant="success">Success</Button>
                <Button className="mr-2" variant="danger">Danger</Button>
                <Button className="mr-2" variant="warning">Warning</Button>
                <Button className="mr-2" variant="info">Info</Button>
                <Button className="mr-2" variant="light">Light</Button>
                <Button className="mr-2" variant="dark">Dark</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="light-primary">Primary</Button>
                <Button className="mr-2" variant="light-secondary">Secondary</Button>
                <Button className="mr-2" variant="light-success">Success</Button>
                <Button className="mr-2" variant="light-danger">Danger</Button>
                <Button className="mr-2" variant="light-warning">Warning</Button>
                <Button className="mr-2" variant="light-info">Info</Button>
                <Button className="mr-2" variant="light-light">Light</Button>
                <Button className="mr-2" variant="light-dark">Dark</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="outline-primary">Primary</Button>
                <Button className="mr-2" variant="outline-secondary">Secondary</Button>
                <Button className="mr-2" variant="outline-success">Success</Button>
                <Button className="mr-2" variant="outline-danger">Danger</Button>
                <Button className="mr-2" variant="outline-warning">Warning</Button>
                <Button className="mr-2" variant="outline-info">Info</Button>
                <Button className="mr-2" variant="outline-light">Light</Button>
                <Button className="mr-2" variant="outline-dark">Dark</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="bg-primary">Primary</Button>
                <Button className="mr-2" variant="bg-secondary">Secondary</Button>
                <Button className="mr-2" variant="bg-success">Success</Button>
                <Button className="mr-2" variant="bg-danger">Danger</Button>
                <Button className="mr-2" variant="bg-warning">Warning</Button>
                <Button className="mr-2" variant="bg-info">Info</Button>
                <Button className="mr-2" variant="bg-light">Light</Button>
                <Button className="mr-2" variant="bg-dark">Dark</Button>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="primary">Primary</Badge>
                <Badge className="mr-2" variant="secondary">Secondary</Badge>
                <Badge className="mr-2" variant="success">Success</Badge>
                <Badge className="mr-2" variant="danger">Danger</Badge>
                <Badge className="mr-2" variant="warning">Warning</Badge>
                <Badge className="mr-2" variant="info">Info</Badge>
                <Badge className="mr-2" variant="light">Light</Badge>
                <Badge className="mr-2" variant="dark">Dark</Badge>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="light-primary">Primary</Badge>
                <Badge className="mr-2" variant="light-secondary">Secondary</Badge>
                <Badge className="mr-2" variant="light-success">Success</Badge>
                <Badge className="mr-2" variant="light-danger">Danger</Badge>
                <Badge className="mr-2" variant="light-warning">Warning</Badge>
                <Badge className="mr-2" variant="light-info">Info</Badge>
                <Badge className="mr-2" variant="light-light">Light</Badge>
                <Badge className="mr-2" variant="light-dark">Dark</Badge>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="outline-primary">Primary</Badge>
                <Badge className="mr-2" variant="outline-secondary">Secondary</Badge>
                <Badge className="mr-2" variant="outline-success">Success</Badge>
                <Badge className="mr-2" variant="outline-danger">Danger</Badge>
                <Badge className="mr-2" variant="outline-warning">Warning</Badge>
                <Badge className="mr-2" variant="outline-info">Info</Badge>
                <Badge className="mr-2" variant="outline-light">Light</Badge>
                <Badge className="mr-2" variant="outline-dark">Dark</Badge>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="primary rounded">1</Badge>
                <Badge className="mr-2" variant="secondary rounded">1</Badge>
                <Badge className="mr-2" variant="success rounded">1</Badge>
                <Badge className="mr-2" variant="danger rounded">1</Badge>
                <Badge className="mr-2" variant="warning rounded">1</Badge>
                <Badge className="mr-2" variant="info rounded">1</Badge>
                <Badge className="mr-2" variant="light rounded">1</Badge>
                <Badge className="mr-2" variant="dark rounded">1</Badge>
            </Row>
        </div>
    );
}
