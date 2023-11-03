import {Component} from 'react'
import DataTable from 'react-data-table-component'
import {BsArrowDown, HiCheck} from 'react-icons/all'
import {Button, ButtonGroup, Container, Form} from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Header from '../components/Header'
import StatisticCalendar from '../components/StatisticCalendar'
import {durationStrAsSeconds, formatDurationStr, ratingInt} from '../helpers/utils'
import axiosInstance from '../helpers/axiosInstance'
import {dataTableStyle} from '../helpers/constants'
import BounceLoader from '../components/BounceLoader'

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
            .get('/api/connections/daily/' + new Date().getFullYear() + '/')
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
            <>
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
                            progressComponent={<BounceLoader/>}
                            onRowClicked={row => this.props.history.push('/roster/' + row.cid) }
                            columns={[
                                {
                                    name: 'Name',
                                    selector: 'name',
                                    sortable: true,
                                    sortFunction: (a, b) => a.first_name > b.first_name ? 1 : -1,
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
                                    sortFunction: (a, b) => ratingInt(a.rating) > ratingInt(b.rating) ? 1 : -1,
                                    sortable: true,
                                },
                                {
                                    name: `Q1 ${new Date().getUTCFullYear()}`,
                                    selector: 'q1',
                                    sortable: true,
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.q1) > durationStrAsSeconds(b.q1) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.q1) >= durationStrAsSeconds(row.activity_requirement)
                                                    ? 'fill-green'
                                                    : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.q1)}
                                    </div>,
                                    minWidth: '150px',
                                },
                                {
                                    name: `Q2 ${new Date().getUTCFullYear()}`,
                                    selector: 'q2',
                                    sortable: true,
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.q2) > durationStrAsSeconds(b.q2) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.q2) >= durationStrAsSeconds(row.activity_requirement)
                                                        ? 'fill-green'
                                                        : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.q2)}
                                    </div>,
                                    minWidth: '150px',
                                },
                                {
                                    name: `Q3 ${new Date().getUTCFullYear()}`,
                                    selector: 'q3',
                                    sortable: true,
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.q3) > durationStrAsSeconds(b.q3) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.q3) >= durationStrAsSeconds(row.activity_requirement)
                                                        ? 'fill-green'
                                                        : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.q3)}
                                    </div>,
                                    minWidth: '150px',
                                },
                                {
                                    name: `Q4 ${new Date().getUTCFullYear()}`,
                                    selector: 'q4',
                                    sortable: true,
                                    sortFunction: (a, b) => {return durationStrAsSeconds(a.q4) > durationStrAsSeconds(b.q4) ? 1 : -1},
                                    cell: row => <div>
                                        <HiCheck
                                            size={25}
                                            className={
                                                (durationStrAsSeconds(row.activity_requirement) !== 0 && durationStrAsSeconds(row.q4) >= durationStrAsSeconds(row.activity_requirement)
                                                        ? 'fill-green'
                                                        : 'fill-transparent'
                                                ) + ' mr-2'
                                            }
                                        />
                                        {formatDurationStr(row.q4)}
                                    </div>,
                                    minWidth: '150px',
                                },
                            ]}
                            customStyles={dataTableStyle}
                        />
                    </Container>
                </Fade>
            </>
        )
    }
}
