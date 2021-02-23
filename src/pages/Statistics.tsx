import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, HiCheck } from 'react-icons/all'
import { Container } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Moment from 'react-moment'
import moment from 'moment'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import StatisticCalendar from '../components/StatisticCalendar'
import { asDuration, asSeconds, ratingInt } from '../helpers/utils'
import axiosInstance from '../helpers/axiosInstance'

export default class Statistics extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            userStats: [],
            dailyStats: [],
        }
    }

    componentDidMount() {
        this.fetchUserStatistics()
        this.fetchDailyStatistics()
    }

    fetchUserStatistics() {
        axiosInstance
            .get('/api/connections/statistics')
            .then(res => this.setState({ userStats: res.data }))
    }

    fetchDailyStatistics() {
        axiosInstance
            .get('/api/connections/daily/' + moment().year())
            .then(res => this.setState({ dailyStats: res.data }))
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Controller Statistics"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <div style={{height: 300}}>
                            <StatisticCalendar data={this.state.dailyStats}/>
                        </div>
                        <DataTable
                            data={this.state.userStats}
                            noHeader
                            highlightOnHover
                            defaultSortField="name"
                            sortIcon={<BsArrowDown/>}
                            onRowClicked={row => this.props.history.push('/roster/' + row.cid) }
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
                                    cell: row => <div>
                                        <HiCheck size={25} className={(asSeconds(row.prev_prev_hours) >= 7200 ? 'fill-green' : 'fill-transparent') + ' mr-2'}/>
                                        {asDuration(row.prev_prev_hours)}
                                    </div>
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM" subtract={{ months: 1 }}>{new Date()}</Moment>,
                                    selector: 'prev_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.prev_hours) > asSeconds(b.prev_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck size={25} className={(asSeconds(row.prev_hours) >= 7200 ? 'fill-green' : 'fill-transparent') + ' mr-2'}/>
                                        {asDuration(row.prev_hours)}
                                    </div>
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM">{new Date()}</Moment>,
                                    selector: 'curr_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.curr_hours) > asSeconds(b.curr_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck size={25} className={(asSeconds(row.curr_hours) >= 7200 ? 'fill-green' : 'fill-transparent') + ' mr-2'}/>
                                        {asDuration(row.curr_hours)}
                                    </div>
                                },
                            ]}
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
