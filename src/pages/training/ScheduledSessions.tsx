import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import {
    BsArrowDown,
    RiArrowRightCircleFill,
    RiCheckboxCircleFill,
    RiCloseCircleFill,
    RiIndeterminateCircleFill,
} from 'react-icons/all'
import moment from 'moment'
import { Alert, Badge } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../helpers/axiosInstance'
import { dataTableStyle } from '../../helpers/constants'
import { levelDisplay, statusDisplay, typeDisplay } from '../../helpers/utils'


export default class ScheduledSessions extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
        }
    }

    componentDidMount() {
        this.fetchSessions()
    }

    fetchSessions() {
        axiosInstance
            .get('/api/training/')
            .then(res => this.setState({ sessions: res.data }))
    }

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <DataTable
                    data={this.state.sessions}
                    noHeader
                    highlightOnHover
                    defaultSortField="date"
                    defaultSortAsc={false}
                    sortIcon={<BsArrowDown/>}
                    pagination={true}
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    columns={[
                        {
                            name: 'Date',
                            selector: 'date',
                            sortable: true,
                            format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                            minWidth: '25%',
                        },
                        {
                            name: 'Level',
                            selector: 'level',
                            sortable: true,
                            format: row => levelDisplay(row.level),
                        },
                        {
                            name: 'Type',
                            selector: 'type',
                            sortable: true,
                            format: row => typeDisplay(row.type),
                        },
                        {
                            name: 'Instructor',
                            selector: 'instructor',
                            sortable: true,
                            format: row => row.instructor.first_name + ' ' + row.instructor.last_name,
                            sortFunction: (a, b) => {
                                return a.first_name > b.first_name ? 1 : -1
                            },
                        },
                        {
                            name: 'Status',
                            selector: 'status',
                            sortable: true,
                            format: row => <Badge variant="primary rounded">Scheduled</Badge>,
                        },
                    ]}
                    customStyles={dataTableStyle}
                />
            </Fade>
        )
    }
}
