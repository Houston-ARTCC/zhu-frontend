import { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap"
import axiosInstance from "../axiosInstance"

export default class AllResources extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            resources: {},
            categories: ['VRC', 'vSTARS', 'vERAM', 'vATIS', 'SOP', 'LOA', 'MAVP', 'Misc']
        }
        this.fetchResources()
    }

    componentDidMount() {
        this.fetchResources()
    }

    fetchResources() {
        axiosInstance
            .get('/api/resources')
            .then(res => {
                this.setState({ resources: res.data })
            })
    }

    render() {
        return (
            <Container>
                <h1 className="text-center">Resources</h1>
                <Row>
                    {this.state.categories.map(category => {
                        return (
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header>
                                        <Card.Title>{category}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        {Object.keys(this.state.resources).length > 0
                                            ? this.state.resources[category.toLowerCase()].map(resource => {
                                                return <p>{resource.name}</p>
                                            })
                                            : <p>Loading...</p>
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        )
    }
}
