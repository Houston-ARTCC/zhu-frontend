import { Component } from 'react';
import { Badge, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'

export default class Profile extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/users/' + this.props.match.params.cid)
            .then(res => this.setState({ user: res.data }))
    }

    render() {
        return (
            <Container className="text-center">
                <Link to="/roster" className="mr-5">&lt; Back to Roster</Link><Link to={'/roster/' + this.props.match.params.cid + '/edit'}>Edit
                User &gt;</Link>
                <h1 className="mt-5">{this.state.user.first_name} {this.state.user.last_name} ({this.state.user.initials})</h1>
                <h4 className="text-black-50">CID: {this.state.user.cid}</h4>
                <h4 className="text-black-50">Rating: {this.state.user.rating?.short}</h4>
                {this.state.user.roles?.map(role => <Badge className="mr-1" variant="primary">{role.long}</Badge>)}
            </Container>
        )
    }
}
