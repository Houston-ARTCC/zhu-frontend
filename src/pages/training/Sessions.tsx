import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../helpers/axiosInstance'
import { getCID } from '../../helpers/auth'
import SessionTable from '../../components/SessionTable'

export default class Sessions extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            loading: true,
        }
    }

    componentDidMount() {
        this.fetchSessions()
    }

    fetchSessions() {
        axiosInstance
            .get('/api/training/sessions/' + getCID() + '/')
            .then(res => this.setState({ sessions: res.data, loading: false }))
    }

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <SessionTable data={this.state.sessions}/>
            </Fade>
        )
    }
}
