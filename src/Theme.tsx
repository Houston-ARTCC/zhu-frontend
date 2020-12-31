import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';

export default function Theme() {
    return (
        <Container fluid>
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
                <Button className="mr-2" variant="primary" disabled>primary</Button>
                <Button className="mr-2" variant="yellow" disabled>yellow</Button>
                <Button className="mr-2" variant="red" disabled>red</Button>
                <Button className="mr-2" variant="green" disabled>green</Button>
                <Button className="mr-2" variant="purple" disabled>purple</Button>
                <Button className="mr-2" variant="black" disabled>black</Button>
                <Button className="mr-2" variant="darkgray" disabled>darkgray</Button>
                <Button className="mr-2" variant="darkblue" disabled>darkblue</Button>
                <Button className="mr-2" variant="gray" disabled>gray</Button>
                <Button className="mr-2" variant="lightgray" disabled>lightgray</Button>
                <Button className="mr-2" variant="white" disabled>white</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="primary">primary</Button>
                <Button className="mr-2" variant="yellow">yellow</Button>
                <Button className="mr-2" variant="red">red</Button>
                <Button className="mr-2" variant="green">green</Button>
                <Button className="mr-2" variant="purple">purple</Button>
                <Button className="mr-2" variant="black">black</Button>
                <Button className="mr-2" variant="darkgray">darkgray</Button>
                <Button className="mr-2" variant="darkblue">darkblue</Button>
                <Button className="mr-2" variant="gray">gray</Button>
                <Button className="mr-2" variant="lightgray">lightgray</Button>
                <Button className="mr-2" variant="white">white</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="light-primary">primary</Button>
                <Button className="mr-2" variant="light-yellow">yellow</Button>
                <Button className="mr-2" variant="light-red">red</Button>
                <Button className="mr-2" variant="light-green">green</Button>
                <Button className="mr-2" variant="light-purple">purple</Button>
                <Button className="mr-2" variant="light-black">black</Button>
                <Button className="mr-2" variant="light-darkgray">darkgray</Button>
                <Button className="mr-2" variant="light-darkblue">darkblue</Button>
                <Button className="mr-2" variant="lightgray">gray</Button>
                <Button className="mr-2" variant="light-lightgray">lightgray</Button>
                <Button className="mr-2" variant="light-white">white</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="outline-primary">primary</Button>
                <Button className="mr-2" variant="outline-yellow">yellow</Button>
                <Button className="mr-2" variant="outline-red">red</Button>
                <Button className="mr-2" variant="outline-green">green</Button>
                <Button className="mr-2" variant="outline-purple">purple</Button>
                <Button className="mr-2" variant="outline-black">black</Button>
                <Button className="mr-2" variant="outline-darkgray">darkgray</Button>
                <Button className="mr-2" variant="outline-darkblue">darkblue</Button>
                <Button className="mr-2" variant="outline-gray">gray</Button>
                <Button className="mr-2" variant="outline-lightgray">lightgray</Button>
                <Button className="mr-2" variant="outline-white">white</Button>
            </Row>
            <Row className="mb-2">
                <Button className="mr-2" variant="bg-primary">primary</Button>
                <Button className="mr-2" variant="bg-yellow">yellow</Button>
                <Button className="mr-2" variant="bg-red">red</Button>
                <Button className="mr-2" variant="bg-green">green</Button>
                <Button className="mr-2" variant="bg-purple">purple</Button>
                <Button className="mr-2" variant="bg-black">black</Button>
                <Button className="mr-2" variant="bg-darkgray">darkgray</Button>
                <Button className="mr-2" variant="bg-darkblue">darkblue</Button>
                <Button className="mr-2" variant="bg-gray">gray</Button>
                <Button className="mr-2" variant="bg-lightgray">lightgray</Button>
                <Button className="mr-2" variant="bg-white">white</Button>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="primary">primary</Badge>
                <Badge className="mr-2" variant="yellow">yellow</Badge>
                <Badge className="mr-2" variant="red">red</Badge>
                <Badge className="mr-2" variant="green">green</Badge>
                <Badge className="mr-2" variant="purple">purple</Badge>
                <Badge className="mr-2" variant="black">black</Badge>
                <Badge className="mr-2" variant="darkgray">darkgray</Badge>
                <Badge className="mr-2" variant="darkblue">darkblue</Badge>
                <Badge className="mr-2" variant="gray">gray</Badge>
                <Badge className="mr-2" variant="lightgray">lightgray</Badge>
                <Badge className="mr-2" variant="white">white</Badge>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="light-primary">primary</Badge>
                <Badge className="mr-2" variant="light-yellow">yellow</Badge>
                <Badge className="mr-2" variant="light-red">red</Badge>
                <Badge className="mr-2" variant="light-green">green</Badge>
                <Badge className="mr-2" variant="light-purple">purple</Badge>
                <Badge className="mr-2" variant="light-black">black</Badge>
                <Badge className="mr-2" variant="light-darkgray">darkgray</Badge>
                <Badge className="mr-2" variant="light-darkblue">darkblue</Badge>
                <Badge className="mr-2" variant="lightgray">gray</Badge>
                <Badge className="mr-2" variant="light-lightgray">lightgray</Badge>
                <Badge className="mr-2" variant="light-white">white</Badge>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="outline-primary">primary</Badge>
                <Badge className="mr-2" variant="outline-yellow">yellow</Badge>
                <Badge className="mr-2" variant="outline-red">red</Badge>
                <Badge className="mr-2" variant="outline-green">green</Badge>
                <Badge className="mr-2" variant="outline-purple">purple</Badge>
                <Badge className="mr-2" variant="outline-black">black</Badge>
                <Badge className="mr-2" variant="outline-darkgray">darkgray</Badge>
                <Badge className="mr-2" variant="outline-darkblue">darkblue</Badge>
                <Badge className="mr-2" variant="outline-gray">gray</Badge>
                <Badge className="mr-2" variant="outline-lightgray">lightgray</Badge>
                <Badge className="mr-2" variant="outline-white">white</Badge>
            </Row>
            <Row className="mb-2">
                <Badge className="mr-2" variant="primary rounded">1</Badge>
                <Badge className="mr-2" variant="yellow rounded">1</Badge>
                <Badge className="mr-2" variant="red rounded">1</Badge>
                <Badge className="mr-2" variant="green rounded">1</Badge>
                <Badge className="mr-2" variant="purple rounded">1</Badge>
                <Badge className="mr-2" variant="black rounded">1</Badge>
                <Badge className="mr-2" variant="darkgray rounded">1</Badge>
                <Badge className="mr-2" variant="darkblue rounded">1</Badge>
                <Badge className="mr-2" variant="gray rounded">1</Badge>
                <Badge className="mr-2" variant="lightgray rounded">1</Badge>
                <Badge className="mr-2" variant="white rounded">1</Badge>
            </Row>
            <Row className="mb-2">
                <Alert className="mr-2" variant="primary">primary</Alert>
                <Alert className="mr-2" variant="yellow">yellow</Alert>
                <Alert className="mr-2" variant="red">red</Alert>
                <Alert className="mr-2" variant="green">green</Alert>
                <Alert className="mr-2" variant="purple">purple</Alert>
                <Alert className="mr-2" variant="black">black</Alert>
                <Alert className="mr-2" variant="darkgray">darkgray</Alert>
                <Alert className="mr-2" variant="darkblue">darkblue</Alert>
                <Alert className="mr-2" variant="gray">gray</Alert>
                <Alert className="mr-2" variant="lightgray">lightgray</Alert>
                <Alert className="mr-2" variant="white">white</Alert>
            </Row>
        </Container>
    );
}
