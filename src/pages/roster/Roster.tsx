import React, { Component } from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import { BsArrowDown, FaCircle } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import Switch from 'react-bootstrap/Switch'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import axiosInstance from '../../helpers/axiosInstance'
import { certLevel, certName, ratingInt } from '../../helpers/utils'

export default class Roster extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            sortedUsers: {},
            filter: '',
            tableView: window.innerWidth < 768,
        }
        this.userFilter = this.userFilter.bind(this)
    }

    componentDidMount() {
        this.fetchUsers()
    }

    fetchUsers() {
        axiosInstance
            .get('/api/users')
            .then(res => {
                this.setState({
                    users: res.data,
                    sortedUsers: this.sortUsers(res.data),
                })
            })
    }

    sortUsers(users) {
        return users.reduce((sorted, user) => {
            sorted[certLevel(user)] = [...sorted[certLevel(user)] || [], user]
            return sorted
        }, {})
    }

    userFilter(user) {
        let filter = this.state.filter.toLowerCase()
        let full_name = user.first_name + ' ' + user.last_name
        return (
            full_name.toLowerCase().includes(filter) ||
            user.cid.toString().includes(filter) ||
            user.initials.toLowerCase().includes(filter) ||
            user.rating.short.toLowerCase().includes(filter)
        )
    }

    renderCertification(certification) {
        let color;
        switch (certification) {
            case 1: color = 'yellow'; break
            case 2: color = 'green'; break
            case 3: color = 'red'; break
            default: color = 'lightgray'; break
        }
        return <FaCircle className={'fill-' + color}/>
    }

    renderUserCard(user) {
        return (
            <Col sm={12} md={6} lg={4} xl={3} className="mx-auto">
                <Link to={`/roster/${user.cid}`}>
                    <Card className="mb-4">
                        <Card.Header className="text-center py-4 px-1">
                            <img className="profile-lg mb-3" src={process.env.REACT_APP_API_URL + user.profile} alt={user.first_name + ' ' + user.last_name}/>
                            <Card.Title className="mb-0">
                                {user.first_name} {user.last_name} ({user.initials})
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <Row className="mb-3">
                                <Col>
                                    <h4>{user.cid}</h4>
                                    <h6 className="font-w400">CID</h6>
                                </Col>
                                <Col>
                                    <h4>{user.rating.short}</h4>
                                    <h6 className="font-w400">Rating</h6>
                                </Col>
                            </Row>
                            <table className="w-100">
                                <tr>
                                    <td>{this.renderCertification(user.del_cert)}</td>
                                    <td>{this.renderCertification(user.gnd_cert)}</td>
                                    <td>{this.renderCertification(user.twr_cert)}</td>
                                    <td>{this.renderCertification(user.app_cert)}</td>
                                    <td>{this.renderCertification(user.ctr_cert)}</td>
                                    <td>{this.renderCertification(user.ocn_cert)}</td>
                                </tr>
                                <tr>
                                    <th className="font-sm">DEL</th>
                                    <th className="font-sm">GND</th>
                                    <th className="font-sm">TWR</th>
                                    <th className="font-sm">APP</th>
                                    <th className="font-sm">CTR</th>
                                    <th className="font-sm">OCN</th>
                                </tr>
                            </table>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        )
    }

    renderUserTable() {
        return (
            <DataTable
                data={this.state.users.filter(this.userFilter)}
                noHeader
                highlightOnHover
                pointerOnHover
                defaultSortField="name"
                sortIcon={<BsArrowDown/>}
                onRowClicked={row => this.props.history.push('/roster/' + row.cid) }
                columns={[
                    {
                        name: 'Name',
                        selector: 'name',
                        width: '20%',
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
                        sortable: true,
                        sortFunction: (a, b) => {return ratingInt(a.rating.short) > ratingInt(b.rating.short) ? 1 : -1},
                        format: row => row.rating.short,
                    },
                    {
                        name: 'DEL',
                        selector: 'del',
                        width: '10%',
                        center: true,
                        sortable: true,
                        sortFunction: (a, b) => {return a.del_cert > b.del_cert ? -1 : 1},
                        format: row => this.renderCertification(row.del_cert),
                    },
                    {
                        name: 'GND',
                        selector: 'gnd',
                        width: '10%',
                        center: true,
                        sortable: true,
                        sortFunction: (a, b) => {return a.gnd_cert > b.gnd_cert ? -1 : 1},
                        format: row => this.renderCertification(row.gnd_cert),
                    },
                    {
                        name: 'TWR',
                        selector: 'twr',
                        width: '10%',
                        center: true,
                        sortable: true,
                        sortFunction: (a, b) => {return a.twr_cert > b.twr_cert ? -1 : 1},
                        format: row => this.renderCertification(row.twr_cert),
                    },
                    {
                        name: 'APP',
                        selector: 'app',
                        width: '10%',
                        center: true,
                        sortable: true,
                        sortFunction: (a, b) => {return a.app_cert > b.app_cert ? -1 : 1},
                        format: row => this.renderCertification(row.app_cert),
                    },
                    {
                        name: 'CTR',
                        selector: 'ctr',
                        width: '10%',
                        center: true,
                        sortable: true,
                        sortFunction: (a, b) => {return a.ctr_cert > b.ctr_cert ? -1 : 1},
                        format: row => this.renderCertification(row.ctr_cert),
                    },
                    {
                        name: 'OCN',
                        selector: 'ocn',
                        width: '10%',
                        center: true,
                        sortable: true,
                        sortFunction: (a, b) => {return a.ocn_cert > b.ocn_cert ? -1 : 1},
                        format: row => this.renderCertification(row.ocn_cert),
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
        )
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Roster"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <div className="d-flex justify-content-between">
                            <Switch className="mb-3" checked={this.state.tableView} id="toggle-table" label="Toggle Table View" onChange={() => this.setState({tableView: !this.state.tableView})}/>
                            <div>
                                <Form.Control placeholder="Search for controller..." value={this.state.filter} onChange={event => this.setState({ filter: event.target.value })}/>
                            </div>
                        </div>
                        {this.state.tableView
                            ? this.renderUserTable()
                            : Object.keys(this.state.sortedUsers).reverse().filter(level => this.state.sortedUsers[level].some(this.userFilter)).map(level =>
                                <div className="text-center mb-3">
                                    <h1 className="text-black font-w500 mb-3">{certName(parseInt(level))}</h1>
                                    <Row>
                                        {this.state.sortedUsers[level].filter(this.userFilter).map(user => this.renderUserCard(user))}
                                    </Row>
                                </div>
                            )
                        }
                    </Container>
                </Fade>
            </div>
        )
    }
}
