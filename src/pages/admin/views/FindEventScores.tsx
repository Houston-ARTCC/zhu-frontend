import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../../helpers/axiosInstance'
import EventScoreTable from '../../../components/EventScoreTable'

export default class FindEventScores extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            userOptions: null,
            currentUser: undefined,
        }
    }

    componentDidMount() {
        this.fetchUsers()
    }

    fetchUsers() {
        axiosInstance
            .get('/api/users/simplified/')
            .then(res => {
                let homeControllerOptions : any[] = []
                res.data.home?.map(controller =>
                    homeControllerOptions.push({
                        value: controller.cid,
                        label: controller.first_name + ' ' + controller.last_name,
                        score: controller.event_score,
                    })
                )
                let visitingControllerOptions : any[] = []
                res.data.visiting?.map(controller =>
                    visitingControllerOptions.push({
                        value: controller.cid,
                        label: controller.first_name + ' ' + controller.last_name,
                        score: controller.event_score,
                    })
                )
                let mavpControllerOptions : any[] = []
                res.data.mavp?.map(controller =>
                    mavpControllerOptions.push({
                        value: controller.cid,
                        label: controller.first_name + ' ' + controller.last_name,
                        score: controller.event_score,
                    })
                )
                let groupedOptions = [
                    {
                        label: 'Home Controllers',
                        options: homeControllerOptions,
                    },
                    {
                        label: 'Visiting Controllers',
                        options: visitingControllerOptions,
                    },
                    {
                        label: 'MAVP Controllers',
                        options: mavpControllerOptions,
                    },
                ]

                this.setState({ userOptions: groupedOptions })
            })
    }

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <div className="position-relative">
                    <Select
                        options={this.state.userOptions}
                        onChange={selected => this.setState({ currentUser: selected.value })}
                        placeholder="Select user..."
                        className="mb-4"
                    />
                    <EventScoreTable cid={this.state.currentUser}/>
                </div>
            </Fade>
        )
    }
}
