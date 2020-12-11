import { Component } from "react";
import { Container } from "react-bootstrap";

export default class Error404 extends Component<any, any> {
    render() {
        return (
            <Container className="text-center">
                <h1>Uh oh! We couldn't find that page... :(</h1>
            </Container>
        )
    }
}
