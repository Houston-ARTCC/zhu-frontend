import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, HiCheck, RiDeleteBinLine } from 'react-icons/all'
import { Button, ButtonGroup, Form, FormGroup, Modal } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Moment from 'react-moment'
import { asDuration, asSeconds, ratingInt } from '../../../helpers/utils'
import axiosInstance from '../../../helpers/axiosInstance'
import { dataTableStyle } from '../../../helpers/constants'
import axios from 'axios'
import { withSnackbar } from 'notistack'

class RosterPurge extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            reason: 'Removed for inactivity.',
            showConfirmModal: false,
            toggledClearRows: false,
            currentRoster: 'home',
            allUserStats: {},
            userStats: [],
            selected: [],
        }
        this.purgeSelectedUsers = this.purgeSelectedUsers.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }

    componentDidMount() {
        this.fetchUserStatistics()
    }

    fetchUserStatistics() {
        axiosInstance
            .get('/api/connections/statistics/')
            .then(res => {
                this.setState({
                    allUserStats: res.data,
                    userStats: res.data.home.filter((user) => asSeconds(user.curr_hours) < asSeconds(user.activity_requirement)),
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
            toggledClearRows: !this.state.toggledClearRows,
            userStats: userStats.filter((user) => asSeconds(user.curr_hours) < asSeconds(user.activity_requirement)),
        })
    }

    purgeSelectedUsers(e) {
        e.preventDefault()
        this.state.selected.forEach(user => this.deleteUser(user))
        this.setState({ showConfirmModal: false, toggledClearRows: true })
        this.fetchUserStatistics()
    }

    deleteUser(user) {
        let baseVatusaUrl = this.state.currentRoster === 'home'
            ? 'https://api.vatusa.net/v2/facility/ZHU/roster/'
            : 'https://api.vatusa.net/v2/facility/ZHU/roster/manageVisitor/'

        axiosInstance
            .delete('/api/users/' + user.cid + '/')
            .catch(err => console.log(err.response))

        axios
            .delete(baseVatusaUrl + user.cid, { data: { reason: this.state.reason } })
            .catch(err => console.log(err.response))
    }

    render() {
        return (
            <>
                <Fade bottom duration={1250} distance="50px">
                    <div className="d-flex justify-content-between align-items-center mb-5">
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
                        </ButtonGroup>
                    </div>
                    <DataTable
                        data={this.state.userStats}
                        title={<h5>{this.state.currentRoster === 'home' ? 'Home Controllers' : 'Visiting Controllers'}</h5>}
                        selectableRows
                        selectableRowsHighlight
                        onSelectedRowsChange={(state) => this.setState({ selected: state.selectedRows })}
                        clearSelectedRows={this.state.toggledClearRows}
                        contextActions={<Button onClick={() => this.setState({ showConfirmModal: true })} variant="red"><RiDeleteBinLine className="fill-white"/> Purge</Button>}
                        defaultSortField="name"
                        sortIcon={<BsArrowDown/>}
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
                </Fade>
                <Modal
                    size="lg"
                    show={this.state.showConfirmModal}
                    onHide={() => this.setState({ showConfirmModal: false })}
                    keyboard={false}
                    backdrop="static"
                    centered
                >
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Roster Removal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Confirming this action will automatically remove the following users from the VATUSA and local Houston ARTCC roster. <b>This action cannot be undone!</b></p>
                            <div className="mb-3">
                                {this.state.selected.map(user => <p className="mb-0 text-center"><code>{user.first_name} {user.last_name}</code></p>)}
                            </div>
                            <FormGroup>
                                <Form.Label>VATUSA will be sent the following as the reason for removal:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="reason"
                                    required
                                    rows={2}
                                    value={this.state.reason}
                                    onChange={event => this.setState({ reason: event.target.value })}
                                />
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="lightgray" onClick={() => this.setState({ showConfirmModal: false })}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" onClick={this.purgeSelectedUsers}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}

export default withSnackbar(RosterPurge)
