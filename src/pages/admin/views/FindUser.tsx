import React, { Component } from 'react'
import { Badge, Col, Form, Row } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import { BsArrowDown } from 'react-icons/all'
import { ratingInt, userStatusDisplay } from '../../../helpers/utils'
import { dataTableStyle } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import axiosInstance from '../../../helpers/axiosInstance'
import { withRouter } from 'react-router'
import Spinner from '../../../components/Spinner'

class FindUser extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            roles: [],
            search: '',
            rating: '',
            role: '',
            showNonMembers: false,
            loading: true,
        }
        this.userFilter = this.userFilter.bind(this)
        this.handleRatingChange = this.handleRatingChange.bind(this)
        this.handleRoleChange = this.handleRoleChange.bind(this)
    }

    componentDidMount() {
        this.fetchUsers()
        this.fetchRoles()
    }

    fetchUsers() {
        axiosInstance
            .get('/api/users/all/')
            .then(res => {
                this.setState({ users: res.data, loading: false })
            })
    }

    fetchRoles() {
        axiosInstance
            .get('/api/users/roles/')
            .then(res => this.setState({ roles: res.data }))
    }

    userFilter(user) {
        if (!this.state.showNonMembers && user.status === 2) return false
        if (this.state.rating && user.rating.short !== this.state.rating) return false
        if (this.state.role && user.roles.every(role => role.short !== this.state.role)) return false

        let filter = this.state.search.toLowerCase()
        let full_name = user.first_name + ' ' + user.last_name

        return (
            full_name.toLowerCase().includes(filter) ||
            user.cid.toString().includes(filter) ||
            user.initials?.toLowerCase().includes(filter)
        )
    }

    handleRatingChange(selected) {
        this.setState({ rating: selected?.label })
    }

    handleRoleChange(selected) {
        this.setState({ role: selected?.value })
    }

    renderStatus(status) {
        let color
        switch (status) {
            case 0:
                color = 'green'
                break
            case 1:
                color = 'primary'
                break
            case 2:
                color = 'red'
                break
            default:
                color = 'lightgray'
                break
        }
        return <Badge variant={color + ' rounded'}>{userStatusDisplay(status)}</Badge>
    }

    renderRole(role) {
        let color
        switch(role.short) {
            case 'HC':
            case 'VC':
            case 'MC': color = 'darkblue'; break
            default: return
        }
        return (
            <Badge variant={color + ' rounded'} className="mr-2">{role.long}</Badge>
        )
    }

    render() {
        const roleOptions : any[] = []
        this.state.roles.map(role => roleOptions.push({id: role.id, value: role.short, label: role.long}))

        return (
            <Fade bottom duration={1250} distance="50px">
                <div className="position-relative">
                    <Row>
                        <Col md={3}>
                            <Form.Control
                                placeholder="Search"
                                value={this.state.search}
                                className="mb-3"
                                onChange={event => this.setState({ search: event.target.value })}
                            />
                            <Select
                                onChange={this.handleRatingChange}
                                isClearable={true}
                                placeholder="Rating"
                                className="mb-3"
                                options={[
                                    { value: 0, label: 'OBS' },
                                    { value: 1, label: 'S1' },
                                    { value: 2, label: 'S2' },
                                    { value: 3, label: 'S3' },
                                    { value: 4, label: 'C1' },
                                    { value: 5, label: 'C3' },
                                    { value: 6, label: 'I1' },
                                    { value: 7, label: 'I3' },
                                    { value: 8, label: 'SUP' },
                                    { value: 9, label: 'ADM' },
                                ]}
                            />
                            <Select
                                isClearable={true}
                                placeholder="Role"
                                className="mb-3"
                                options={roleOptions}
                                onChange={this.handleRoleChange}
                            />
                            <Form.Switch
                                id="show-non-members"
                                label="Show non-members."
                                checked={this.state.showNonMembers}
                                onChange={() => this.setState({ showNonMembers: !this.state.showNonMembers })}
                            />
                        </Col>
                        <Col>
                            <DataTable
                                data={this.state.users.filter(this.userFilter)}
                                noHeader
                                highlightOnHover
                                pointerOnHover
                                defaultSortField="name"
                                sortIcon={<BsArrowDown/>}
                                pagination={true}
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 15, 20, 25]}
                                progressPending={this.state.loading}
                                progressComponent={<Spinner/>}
                                onRowClicked={row => this.props.history.push('/roster/' + row.cid) }
                                customStyles={dataTableStyle}
                                columns={[
                                    {
                                        name: 'Name',
                                        selector: 'name',
                                        sortable: true,
                                        sortFunction: (a, b) => { return a.first_name > b.first_name ? 1 : -1 },
                                        format: row => row.first_name + ' ' + row.last_name + (row.status !== 2 ? ' (' + row.initials + ')' : ''),
                                        width: '30%',
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
                                        sortFunction: (a, b) => { return ratingInt(a.rating.short) > ratingInt(b.rating.short) ? 1 : -1 },
                                        format: row => row.rating.short,
                                    },
                                    {
                                        name: 'Status',
                                        selector: 'status',
                                        sortable: true,
                                        format: row => this.renderStatus(row.status),
                                    },
                                    {
                                        name: 'Main Role',
                                        selector: 'main_role',
                                        format: row => row.roles?.map(role => this.renderRole(role)),
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                </div>
            </Fade>
        )
    }
}

export default withRouter(FindUser)
