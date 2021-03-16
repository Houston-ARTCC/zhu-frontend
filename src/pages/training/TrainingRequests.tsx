import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../helpers/axiosInstance'
import { BsArrowDown } from 'react-icons/all'
import moment from 'moment'
import { levelDisplay, typeDisplay } from '../../helpers/utils'
import { dataTableStyle } from '../../helpers/constants'
import DataTable from 'react-data-table-component'

export default class TrainingRequests extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            requests: [],
        }
    }

    componentDidMount() {
        this.fetchRequests()
    }

    fetchRequests() {
        axiosInstance
            .get('/api/training/request/pending/')
            .then(res => this.setState({ requests: res.data }))
    }

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <DataTable
                    data={this.state.requests}
                    noHeader
                    highlightOnHover
                    defaultSortField="date"
                    sortIcon={<BsArrowDown/>}
                    noDataComponent={<div className="p-4">No pending training requests</div>}
                    columns={[
                        {
                            name: 'Date',
                            selector: 'date',
                            sortable: true,
                            format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z') + ' → ' + moment(row.end).tz(moment.tz.guess()).format('HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                            minWidth: '40%',
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
                    ]}
                    customStyles={dataTableStyle}
                />
            </Fade>
        )
    }
}
