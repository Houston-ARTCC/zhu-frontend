import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, HiCheck } from 'react-icons/all'
import { Button, ButtonGroup, Container, Form } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Moment from 'react-moment'
import moment from 'moment'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import StatisticCalendar from '../components/StatisticCalendar'
import { asDuration, asSeconds, ratingInt } from '../helpers/utils'
import axiosInstance from '../helpers/axiosInstance'
import { dataTableStyle } from '../helpers/constants'

export default class Statistics extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            currentRoster: 'home',
            allUserStats: {},
            userStats: [],
            dailyStats: [],
        }
        this.userFilter = this.userFilter.bind(this)
    }

    componentDidMount() {
        this.fetchDailyStatistics()
        this.fetchUserStatistics()
    }

    fetchDailyStatistics() {
        axiosInstance
            .get('/api/connections/daily/' + moment().year() + '/')
            .then(res => this.setState({ dailyStats: res.data }))
    }

    fetchUserStatistics() {
        axiosInstance
            .get('/api/connections/statistics/')
            .then(res => {
                this.setState({
                    allUserStats: res.data,
                    userStats: res.data.home,
                })
            })
    }

    switchRoster(roster) {
        let userStats
        if (roster === 'all') {
            userStats = this.state.allUserStats.home.concat(this.state.allUserStats.visiting).concat(this.state.allUserStats.mavp)
        } else {
            userStats = this.state.allUserStats[roster]
        }
        this.setState({
            currentRoster: roster,
            userStats: userStats,
        })
    }

    userFilter(user) {
        let filter = this.state.filter.toLowerCase()
        let full_name = user.first_name + ' ' + user.last_name
        return (
            full_name.toLowerCase().includes(filter) ||
            user.cid.toString().includes(filter) ||
            user.initials.toLowerCase().includes(filter) ||
            user.rating.toLowerCase().includes(filter)
        )
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Controller Statistics"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <StatisticCalendar data={this.state.dailyStats} height={300}/>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div>
                                <Form.Control placeholder="Search for controller..." value={this.state.filter} onChange={event => this.setState({ filter: event.target.value })}/>
                            </div>
                            <ButtonGroup>
                                <Button
                                    variant={'outline-darkblue' + (this.state.currentRoster === 'home' ? ' active' : '')}
                                    onClick={() => this.switchRoster('home')}
                                >
                                    Home
                                </Button>
                                <Button
                                    variant={'outline-darkblue' + (this.state.currentRoster === 'visiting' ? ' active' : '')}
                                    onClick={() => this.switchRoster('visiting')}
                                >
                                    Visiting
                                </Button>
                                <Button
                                    variant={'outline-darkblue' + (this.state.currentRoster === 'mavp' ? ' active' : '')}
                                    onClick={() => this.switchRoster('mavp')}
                                >
                                    MAVP
                                </Button>
                                <Button
                                    variant={'outline-darkblue' + (this.state.currentRoster === 'all' ? ' active' : '')}
                                    onClick={() => this.switchRoster('all')}
                                >
                                    All
                                </Button>
                            </ButtonGroup>
                        </div>
                        <DataTable
                            data={this.state.userStats.filter(this.userFilter)}
                            noHeader
                            pointerOnHover
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
                                    format: row => row.first_name + ' ' + row.last_name + ' (' + row.initials + ')',
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
                                        <HiCheck
                                            size={25}
                                            className={
                                                (asSeconds(row.activity_requirement) !== 0 && asSeconds(row.prev_prev_hours) >= asSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {asDuration(row.prev_prev_hours)}
                                    </div>
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM" subtract={{ months: 1 }}>{new Date()}</Moment>,
                                    selector: 'prev_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.prev_hours) > asSeconds(b.prev_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (asSeconds(row.activity_requirement) !== 0 && asSeconds(row.prev_hours) >= asSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {asDuration(row.prev_hours)}
                                    </div>
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM">{new Date()}</Moment>,
                                    selector: 'curr_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return asSeconds(a.curr_hours) > asSeconds(b.curr_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (asSeconds(row.activity_requirement) !== 0 && asSeconds(row.curr_hours) >= asSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {asDuration(row.curr_hours)}
                                    </div>
                                },
                            ]}
                            customStyles={dataTableStyle}
                        />
                    </Container>
                </Fade>
            </div>
        )
    }
}
