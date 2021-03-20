import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../helpers/axiosInstance'
import SessionTable from '../../components/SessionTable'

export default class StudentProfile extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
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
            .then(res => this.setState({ students: res.data }))
    }

    handleStudentChange(selected) {
        this.setState({ loading: true })
        axiosInstance
            .get('/api/training/sessions/' + selected.value + '/')
            .then(res => this.setState({ sessions: res.data, loading: false }))
    }

    render() {
        const studentOptions : any[] = []
        this.state.students.map(students => studentOptions.push({value: students.cid, label: students.first_name + ' ' + students.last_name}))

        return (
            <Fade bottom duration={1250} distance="50px">
                <div className="position-relative">
                    <Select
                        options={studentOptions}
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
