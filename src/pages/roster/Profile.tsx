import React, { Component } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { BsArrowDown, FaCircle, IoStar, IoStarOutline, RiCalendarEventLine, RiPencilRuler2Line, RiPlaneLine } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import moment from 'moment'
import Header from '../../components/Header'
import StatisticCalendar from '../../components/StatisticCalendar'
import axiosInstance from '../../helpers/axiosInstance'
import { asDuration } from '../../helpers/utils'
import { isStaff } from '../../helpers/auth'
import { dataTableStyle } from '../../helpers/constants'

export default class Profile extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            connections: [],
            userStats: [],
            feedback: [],
            expanded: {},
        }
    }

    componentDidMount() {
        this.fetchUser()
        this.fetchUserConnections()
        this.fetchUserDailyStatistics()
        if (isStaff()) this.fetchUserFeedback()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.cid !== this.props.match.params.cid) {
            this.fetchUser()
            this.fetchUserConnections()
            this.fetchUserDailyStatistics()
        }
    }

    fetchUser() {
        axiosInstance
            .get('/api/users/' + this.props.match.params.cid + '/')
            .then(res => this.setState({ user: res.data }))
    }

    fetchUserConnections() {
        axiosInstance
            .get('/api/connections/sessions/' + this.props.match.params.cid + '/')
            .then(res => this.setState({ connections: res.data }))
    }

    fetchUserDailyStatistics() {
        axiosInstance
            .get('/api/connections/daily/' + moment().year() + '/' + this.props.match.params.cid + '/')
            .then(res => this.setState({ userStats: res.data }))
    }

    fetchUserFeedback() {
        axiosInstance
            .get('/api/users/' + this.props.match.params.cid + '/feedback/')
            .then(res => this.setState({ feedback: res.data }))
    }

    renderRole(role) {
        let color
        switch(role.short) {
            case 'INS':
            case 'MTR': color = 'yellow'; break
            case 'HC':
            case 'VC':
            case 'MC': color = 'darkblue'; break
            default: color = 'red'
        }
        return (
            <Badge variant={color} className="mr-2 mb-2">{role.long}</Badge>
        )
    }

    renderCertification(certification) {
        let color, cert
        switch (certification) {
            case 1:
                color = 'yellow'
                cert = 'Minor'
                break
            case 2:
                color = 'green'
                cert = 'Major'
                break
            case 3:
                color = 'red'
                cert = 'Solo'
                break
            default:
                color = 'lightgray'
                cert = 'None'
                break
        }
        return <Badge variant={color + ' rounded'}>{cert}</Badge>
    }

    renderSmallCertification(certification) {
        let color;
        switch (certification) {
            case 1: color = 'yellow'; break
            case 2: color = 'green'; break
            case 3: color = 'red'; break
            default: color = 'lightgray'; break
        }
        return <FaCircle className={'fill-' + color}/>
    }

    ExpandableFeedback = (row) => {
        return (
            <div className="px-5 py-3" style={{ backgroundColor: '#F9F9F9' }}>
                <p className="font-w500"><RiPlaneLine size={25} className="mr-2"/>{row.data.pilot_callsign}</p>
                <p className="font-w500"><RiCalendarEventLine size={25} className="mr-2"/>{row.data.event ? row.data.event.name : 'N/A'}</p>
                {row.data.comments}
            </div>
        )
    }

    render() {
        return (
            <div>
                <Header
                    title={this.state.user.first_name + ' ' + this.state.user.last_name}
                    subtitle={this.state.user.rating?.long + ' - ' + this.state.user.cid}
                />
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row>
                            <Col>
                                <div className="d-flex flex-column flex-md-row">
                                    <div className="d-flex flex-column align-items-center mr-0 mr-md-4">
                                        <img
                                            className="profile-xl mb-4"
                                            src={process.env.REACT_APP_API_URL + this.state.user.profile}
                                            alt={this.state.user.first_name + ' ' + this.state.user.last_name}
                                        />
                                        {isStaff() &&
                                            <Link to={this.state.user.cid + '/edit'}>
                                                <Button variant="primary" className="mb-5"><RiPencilRuler2Line className="fill-white" viewBox="3 3 20 20"/> Edit User</Button>
                                            </Link>
                                        }
                                    </div>
                                    <div className="text-center text-md-left">
                                        <div className="mb-2">
                                            {this.state.user.roles?.map(role => this.renderRole(role))}
                                        </div>
                                        <p className="mb-5">{this.state.user.biography ? this.state.user.biography : 'This user has not set a biography.'}</p>
                                    </div>
                                </div>
                                <table className="w-100 text-center mb-5 d-none d-md-table" style={{ tableLayout: 'fixed' }}>
                                    <tr>
                                        <th><h6>Delivery</h6></th>
                                        <th><h6>Ground</h6></th>
                                        <th><h6>Tower</h6></th>
                                        <th><h6>Approach</h6></th>
                                        <th><h6>Center</h6></th>
                                        <th><h6>Oceanic</h6></th>
                                    </tr>
                                    <tr>
                                        <td>{this.renderCertification(this.state.user.del_cert)}</td>
                                        <td>{this.renderCertification(this.state.user.gnd_cert)}</td>
                                        <td>{this.renderCertification(this.state.user.twr_cert)}</td>
                                        <td>{this.renderCertification(this.state.user.app_cert)}</td>
                                        <td>{this.renderCertification(this.state.user.ctr_cert)}</td>
                                        <td>{this.renderCertification(this.state.user.ocn_cert)}</td>
                                    </tr>
                                </table>
                                <table className="w-100 text-center mb-5 d-table d-md-none" style={{ tableLayout: 'fixed' }}>
                                    <tr>
                                        <th><h6>DEL</h6></th>
                                        <th><h6>GND</h6></th>
                                        <th><h6>TWR</h6></th>
                                        <th><h6>APP</h6></th>
                                        <th><h6>CTR</h6></th>
                                        <th><h6>OCN</h6></th>
                                    </tr>
                                    <tr>
                                        <td>{this.renderSmallCertification(this.state.user.del_cert)}</td>
                                        <td>{this.renderSmallCertification(this.state.user.gnd_cert)}</td>
                                        <td>{this.renderSmallCertification(this.state.user.twr_cert)}</td>
                                        <td>{this.renderSmallCertification(this.state.user.app_cert)}</td>
                                        <td>{this.renderSmallCertification(this.state.user.ctr_cert)}</td>
                                        <td>{this.renderSmallCertification(this.state.user.ocn_cert)}</td>
                                    </tr>
                                </table>
                                <StatisticCalendar data={this.state.userStats} height={window.innerWidth < 768 ? 1000 : 200} vertical={window.innerWidth < 768}/>
                            </Col>
                            <Col>
                                <div className="mb-4">
                                    <DataTable
                                        data={this.state.connections}
                                        title={<h5>Connections</h5>}
                                        defaultSortField="date"
                                        defaultSortAsc={false}
                                        pagination={true}
                                        paginationPerPage={5}
                                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                        sortIcon={<BsArrowDown/>}
                                        customStyles={dataTableStyle}
                                        columns={[
                                            {
                                                name: 'Date',
                                                selector: 'date',
                                                sortable: true,
                                                sortFunction: (a, b) => {return moment(a.start) > moment(b.start) ? 1 : -1},
                                                format: row => moment.utc(row.start).format('MMM. DD, YYYY'),
                                            },
                                            {
                                                name: 'Callsign',
                                                selector: 'callsign',
                                                sortable: true,
                                            },
                                            {
                                                name: 'Duration',
                                                selector: 'duration',
                                                sortable: true,
                                                sortFunction: (a, b) => {return a.duration > b.duration ? 1 : -1},
                                                format: row => asDuration(row.duration),
                                            },
                                        ]}
                                    />
                                </div>
                                {isStaff() &&
                                    <DataTable
                                        data={this.state.feedback}
                                        title={<h5>Feedback</h5>}
                                        highlightOnHover
                                        defaultSortField="date"
                                        defaultSortAsc={false}
                                        pagination={true}
                                        paginationPerPage={5}
                                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                        expandableRows
                                        expandableRowsComponent={<this.ExpandableFeedback/>}
                                        expandableRowExpanded={row => row.id === this.state.expanded.id}
                                        onRowExpandToggled={(state, row) => state && this.setState({ expanded: row })}
                                        expandOnRowClicked
                                        onChangePage={() => this.setState({ expanded: {} })}
                                        onSort={() => this.setState({ expanded: {} })}
                                        sortIcon={<BsArrowDown/>}
                                        customStyles={dataTableStyle}
                                        columns={[
                                            {
                                                name: 'Date',
                                                selector: 'date',
                                                sortable: true,
                                                sortFunction: (a, b) => {return moment(a.created) > moment(b.created) ? 1 : -1},
                                                format: row => moment.utc(row.created).format('MMM. DD, YYYY'),
                                            },
                                            {
                                                name: 'Callsign',
                                                selector: 'controller_callsign',
                                                sortable: true,
                                            },
                                            {
                                                name: 'Rating',
                                                selector: 'rating',
                                                sortable: true,
                                                format: row => <>
                                                    {[...Array(5)].map((x, i) => {
                                                        return (
                                                            i >= row.rating
                                                                ? <IoStarOutline key={i} size={20} className="mr-1"/>
                                                                : <IoStar key={i} size={20} className="mr-1"/>
                                                        )
                                                    })}
                                                </>
                                            }
                                        ]}
                                    />
                                }
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </div>
        )
    }
}
