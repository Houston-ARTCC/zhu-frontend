import { Component } from "react";
import { Container } from "react-bootstrap"
import axiosInstance from "../axiosInstance"

export default class ViewEvent extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            event: {}
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

    render() {
        return (
            <Container>
                <h1 className="text-center">{this.state.event.name}</h1>
                {this.state.event.positions != null
                    ? this.state.event.positions.map(position => {return <p>{position.callsign}</p>})
                    : <p>Loading...</p>
                }
            </Container>
        )
    }
}
