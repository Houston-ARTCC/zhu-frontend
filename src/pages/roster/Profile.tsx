import React, { Component } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { BsArrowDown, RiPencilRuler2Line } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import moment from 'moment'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
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
        }
    }

    componentDidMount() {
        this.fetchUser()
        this.fetchUserConnections()
        this.fetchUserDailyStatistics()
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
            .get('/api/users/' + this.props.match.params.cid)
            .then(res => this.setState({ user: res.data }))
    }

    fetchUserConnections() {
        axiosInstance
            .get('/api/connections/sessions/' + this.props.match.params.cid)
            .then(res => this.setState({ connections: res.data }))
    }

    fetchUserDailyStatistics() {
        axiosInstance
            .get('/api/connections/daily/' + moment().year() + '/' + this.props.match.params.cid)
            .then(res => this.setState({ userStats: res.data }))
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
            <Badge variant={color} className="mr-2">{role.long}</Badge>
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

    render() {
        return (
            <div>
                <Navigation/>
                <Header
                    title={this.state.user.first_name + ' ' + this.state.user.last_name}
                    subtitle={this.state.user.rating?.long + ' - ' + this.state.user.cid}
                />
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row>
                            <Col>
                                <div className="d-flex">
                                    <div className="d-flex flex-column align-items-center mr-4">
                                        <img
                                            className="profile-xl mb-4"
                                            src={process.env.REACT_APP_API_URL + this.state.user.profile}
                                            alt={this.state.user.first_name + ' ' + this.state.user.last_name}
                                        />
                                        {isStaff() &&
                                            <Link to={this.state.user.cid + '/edit'}>
                                                <Button variant="primary" className="mb-3"><RiPencilRuler2Line className="fill-white" viewBox="3 3 20 20"/> Edit User</Button>
                                            </Link>
                                        }
                                    </div>
                                    <div>
                                        <div className="mb-2">
                                            {this.state.user.roles?.map(role => this.renderRole(role))}
                                        </div>
                                        <p className="pr-4">{this.state.user.biography ? this.state.user.biography : 'This user has not set a biography.'}</p>
                                    </div>
                                </div>
                                <div style={{height: 200}}>
                                    <StatisticCalendar data={this.state.userStats}/>
                                </div>
                            </Col>
                            <Col>
                                <div className="mb-4">
                                    <table className="w-100 text-center" style={{ tableLayout: 'fixed' }}>
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
                                </div>
                                <DataTable
                                    data={this.state.connections}
                                    noHeader
                                    highlightOnHover
                                    defaultSortField="date"
                                    defaultSortAsc={false}
                                    pagination={true}
                                    paginationPerPage={5}
                                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                    sortIcon={<BsArrowDown/>}
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
                                    customStyles={dataTableStyle}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </div>
        )
    }
}
