import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../helpers/axiosInstance'
import SessionTable from '../../components/SessionTable'

export default class MentorHistory extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            instructors: [],
            mentors: [],
            sessions: [],
            expanded: {},
            loading: false,
        }
        this.handleMentorChange = this.handleMentorChange.bind(this)
    }

    componentDidMount() {
        this.fetchMentors()
    }

    fetchMentors() {
        axiosInstance
            .get('/api/users/staff/')
            .then(res => this.setState({ instructors: res.data.ins, mentors: res.data.mtr }))
    }

    handleMentorChange(selected) {
        this.setState({ loading: true })
        axiosInstance
            .get('/api/training/mentor/' + selected.value + '/')
            .then(res => this.setState({ sessions: res.data, loading: false }))
    }

    render() {
        const instructorOptions : any[] = []
        this.state.instructors.map(instructor => instructorOptions.push({value: instructor.cid, label: instructor.first_name + ' ' + instructor.last_name}))
        const mentorOptions : any[] = []
        this.state.mentors.map(mentor => mentorOptions.push({value: mentor.cid, label: mentor.first_name + ' ' + mentor.last_name}))
        const groupedOptions = [
            {
                label: 'Instructors',
                options: instructorOptions,
            },
            {
                label: 'Mentors',
                options: mentorOptions,
            }
        ]

        return (
            <Fade bottom duration={1250} distance="50px">
                <div className="position-relative">
                    <Select
                        options={groupedOptions}
                        onChange={this.handleMentorChange}
                        placeholder="Select mentor..."
                        className="mb-4"
                    />
                    <SessionTable data={this.state.sessions} loading={this.state.loading}/>
                </div>
            </Fade>
        )
    }
}
