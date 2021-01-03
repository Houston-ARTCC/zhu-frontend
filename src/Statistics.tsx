import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Header from './components/Header'
import axiosInstance from './axiosInstance'
import { asDuration, asSeconds, ratingInt } from './Helpers'
import Navigation from './components/Navigation'
import Moment from 'react-moment'
import DataTable from 'react-data-table-component';
import { BiCheck, BsArrowDown, FaCheck, HiCheck, RiCheckFill } from 'react-icons/all'

export default class Statistics extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            stats: [],
        }
    }

    componentDidMount() {
        this.fetchStatistics()
    }

    fetchStatistics() {
        axiosInstance
            .get('/api/connections/statistics')
            .then(res => this.setState({ stats: res.data }))
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Statistics"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <DataTable
                            noHeader
                            highlightOnHover
                            defaultSortField="name"
                            sortIcon={<BsArrowDown/>}
                            columns={[
                                {
                                    name: 'Name',
                                    selector: 'name',
                                    sortable: true,
                                    sortFunction: (a, b) => {return a.first_name > b.first_name ? 1 : -1},
                                    format: row => row.first_name + ' ' + row.last_name,
                                },
                                {
                                    name: 'CID',
                                    selector: 'cid',
                                    sortable: true,
                                },
                                {
                                    name: 'Rating',
                                    selector: 'rating',
                                    sortFunction: (a, b) => {return ratingInt(a.rating) > ratingInt(b.rating) ? 1 : -1},
                                    sortable: true,
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM" subtract={{ months: 2 }}>{new Date()}</Moment>,
                                    selector: 'prev_prev_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.prev_prev_hours) > asSeconds(b.prev_prev_hours) ? 1 : -1},
                                    cell: row => asDuration(row.prev_prev_hours),
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM" subtract={{ months: 1 }}>{new Date()}</Moment>,
                                    selector: 'prev_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.prev_hours) > asSeconds(b.prev_hours) ? 1 : -1},
                                    cell: row => asDuration(row.prev_hours),
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM">{new Date()}</Moment>,
                                    selector: 'curr_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.curr_hours) > asSeconds(b.curr_hours) ? 1 : -1},
                                    cell: row => <div><HiCheck size={25} className={(asSeconds(row.curr_hours) >= 7200 ? 'fill-green' : 'fill-transparent') + ' mr-2'}/> {asDuration(row.curr_hours)}</div>
                                },
                            ]}
                            data={this.state.stats}
                            customStyles={{
                                table: {
                                    style: {
                                        backgroundColor: 'transparent'
                                    }
                                },
                                rows: {
                                    style: {
                                        backgroundColor: 'transparent'
                                    },
                                    highlightOnHoverStyle: {
                                        borderColor: 'transparent'
                                    }
                                },
                                headRow: {
                                    style: {
                                        backgroundColor: 'transparent'
                                    }
                                },
                            }}
                        />
                    </Container>
                </Fade>
            </div>
        )
    }
}
