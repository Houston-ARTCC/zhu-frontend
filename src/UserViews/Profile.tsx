import React, { Component } from 'react';
import { Badge, Col, Container, Row } from 'react-bootstrap'
import axiosInstance from '../axiosInstance'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import Fade from 'react-reveal/Fade'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { BsArrowDown, FaCircle } from 'react-icons/all'
import { asDuration } from '../Helpers'
import StatisticCalendar from '../components/StatisticCalendar'

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
        let color
        switch (certification) {
            case 1: color = 'yellow'; break
            case 2: color = 'green'; break
            case 3: color = 'red'; break
            default: color = 'lightgray'; break
        }
        return <FaCircle className={'fill-' + color}/>
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header
                    title={this.state.user.first_name + ' ' + this.state.user.last_name}
                    subtitle={this.state.user.rating?.long + ' - ' + this.state.user.cid}
                    // override={
                    //     <div className="d-flex">
                    //         <img
                    //             className="profile-xl mr-4"
                    //             src={'http://api.zhuartcc.devel' + this.state.user.profile}
                    //             alt={this.state.user.first_name + ' ' + this.state.user.last_name}
                    //         />
                    //         <div>
                    //             <h1 className="text-white mb-0">{this.state.user.first_name + ' ' + this.state.user.last_name}</h1>
                    //             <h5 className="text-white font-w400 mb-3">{this.state.user.rating?.long + ' - ' + this.state.user.cid}</h5>
                    //             <div className="mb-3">
                    //                 {this.state.user.roles?.map(role => this.renderRole(role))}
                    //             </div>
                    //         </div>
                    //     </div>
                    // }
                />
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Row>
                            <Col>
                                {/*{isStaff() &&*/}
                                {/*<Link to={this.state.user.cid + '/edit'}>*/}
                                {/*    <Button variant="primary" className="mb-3"><RiPencilRuler2Line className="fill-white" viewBox="3 3 20 20"/> Edit User</Button>*/}
                                {/*</Link>*/}
                                {/*}*/}
                                <div className="d-flex">
                                    <img
                                        className="profile-xl mb-3 mr-4"
                                        src={'http://api.zhuartcc.devel' + this.state.user.profile}
                                        alt={this.state.user.first_name + ' ' + this.state.user.last_name}
                                    />
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
                                    <table className="w-100 text-center">
                                        <tr>
                                            <td>{this.renderCertification(this.state.user.del_cert)}</td>
                                            <td>{this.renderCertification(this.state.user.gnd_cert)}</td>
                                            <td>{this.renderCertification(this.state.user.twr_cert)}</td>
                                            <td>{this.renderCertification(this.state.user.app_cert)}</td>
                                            <td>{this.renderCertification(this.state.user.ctr_cert)}</td>
                                            <td>{this.renderCertification(this.state.user.ocn_cert)}</td>
                                        </tr>
                                        <tr>
                                            <th>DEL</th>
                                            <th>GND</th>
                                            <th>TWR</th>
                                            <th>APP</th>
                                            <th>CTR</th>
                                            <th>OCN</th>
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
                                        pagination: {
                                            style: {
                                                backgroundColor: 'transparent'
                                            }
                                        },
                                    }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Fade>
            </div>
        )
    }
}
