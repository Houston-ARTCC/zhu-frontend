import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../../helpers/axiosInstance'
import SessionTable from '../../../components/SessionTable'

export default class StudentProfile extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            studentOptions: [],
            sessions: [],
            expanded: {},
            loading: false,
        }
        this.handleStudentChange = this.handleStudentChange.bind(this)
    }

    componentDidMount() {
        this.fetchStudents()
    }

    fetchStudents() {
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

                this.setState({ studentOptions: groupedOptions })
            })
    }

    handleStudentChange(selected) {
        this.setState({ loading: true })
        axiosInstance
            .get('/api/training/sessions/' + selected.value + '/')
            .then(res => this.setState({ sessions: res.data, loading: false }))
    }

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <div className="position-relative">
                    <Select
                        options={this.state.studentOptions}
                        onChange={this.handleStudentChange}
                        placeholder="Select student..."
                        className="mb-4"
                    />
                    <SessionTable data={this.state.sessions} loading={this.state.loading}/>
                </div>
            </Fade>
        )
    }
}
