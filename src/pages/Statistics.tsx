import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, HiCheck } from 'react-icons/all'
import { Button, ButtonGroup, Container, Form } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Moment from 'react-moment'
import moment from 'moment'
import Header from '../components/Header'
import StatisticCalendar from '../components/StatisticCalendar'
import { formatDurationStr, durationStrAsSeconds, ratingInt } from '../helpers/utils'
import axiosInstance from '../helpers/axiosInstance'
import { dataTableStyle } from '../helpers/constants'
import Spinner from '../components/Spinner'

export default class Statistics extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            currentRoster: 'home',
            allUserStats: {},
            userStats: [],
            dailyStats: [],
            loading: true,
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
                    loading: false,
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
                <Header title="Controller Statistics"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <StatisticCalendar data={this.state.dailyStats} height={window.innerWidth < 768 ? 1000 : 300} vertical={window.innerWidth < 768}/>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                            <div className="mb-4">
                                <Form.Control placeholder="Search for controller..." value={this.state.filter} onChange={event => this.setState({ filter: event.target.value })}/>
                            </div>
                            <ButtonGroup className="mb-4">
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
                            progressPending={this.state.loading}
                            progressComponent={<Spinner/>}
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
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.prev_prev_hours) > durationStrAsSeconds(b.prev_prev_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.prev_prev_hours) >= durationStrAsSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.prev_prev_hours)}
                                    </div>,
                                    minWidth: '150px',
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM" subtract={{ months: 1 }}>{new Date()}</Moment>,
                                    selector: 'prev_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.prev_hours) > durationStrAsSeconds(b.prev_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.prev_hours) >= durationStrAsSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.prev_hours)}
                                    </div>,
                                    minWidth: '150px',
                                },
                                {
                                    name: <Moment tz="UTC" format="MMMM">{new Date()}</Moment>,
                                    selector: 'curr_hours',
                                    sortable: true,
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.curr_hours) > durationStrAsSeconds(b.curr_hours) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.curr_hours) >= durationStrAsSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.curr_hours)}
                                    </div>,
                                    minWidth: '150px',
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
