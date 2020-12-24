import { Component } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'

export default class Roster extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
        }
    }

    componentDidMount() {
        this.fetchUsers()
    }

    fetchUsers() {
        axiosInstance
            .get('/api/users')
            .then(res => {
                this.setState({ users: res.data })
            })
    }

    renderUser(user) {
        return (
            <Col sm={6} className="mx-auto">
                <Link to={`/roster/${user.cid}`}>
                    <Card className="mb-4">
                        <Card.Header>
                            <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                        </Card.Header>
                    </Card>
                </Link>
            </Col>
        )
    }

    render() {
        return (
            <Container>
                <h1 className="text-center">Roster</h1>
                <Row>
                    {this.state.users.map(user => this.renderUser(user))}
                </Row>
            </Container>
        )
    }
}
