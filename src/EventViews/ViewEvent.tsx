import { Component } from 'react';
import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { getCID } from '../Helpers';

export default class ViewEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {},
        }
    }

    componentDidMount() {
        this.fetchEvent()
    }

    fetchEvent() {
        axiosInstance
            .get('/api/events/' + this.props.match.params.id)
            .then(res => this.setState({ event: res.data }))
    }

    renderPosition(position) {
        const handleRequest = () => {
            axiosInstance
                .post('/api/events/request/' + position.id + '/')
                .then(res => this.fetchEvent())
                .catch(err => console.log(err.response))
        }

        const handleUnrequest = () => {
            axiosInstance
                .delete('/api/events/request/' + position.id)
                .then(res => this.fetchEvent())
                .catch(err => console.log(err.response))
        }

        return (
            <p>{position.user != null
                ? <Button variant="bg-dark">{position.user.first_name} {position.user.last_name}</Button>
                : position.requests.some(request => request.user.cid === getCID())
                    ? <Button variant="bg-success" onClick={() => handleUnrequest()}>Unrequest {position.callsign}</Button>
                    : <Button variant="bg-danger" onClick={() => handleRequest()}>Request {position.callsign}</Button>
            }</p>
        )
    }

    render() {
        return (
            <Container className="text-center">
                <Link className="mr-5" to="/events">&lt; Back to Events</Link><Link to={'/events/' + this.props.match.params.id + '/edit'}>Edit
                Event &gt;</Link>
                <h1 className="mt-5">{this.state.event.name}</h1>
                <h5 className="text-black-50">Presented by {this.state.event.host}</h5>
                <div className="my-5">
                    <img src={this.state.event.banner} alt="Banner" width="75%"/>
                </div>
                <p>{this.state.event.description}</p>
                {this.state.event.positions?.map(position => this.renderPosition(position))}
            </Container>
        )
    }
}
