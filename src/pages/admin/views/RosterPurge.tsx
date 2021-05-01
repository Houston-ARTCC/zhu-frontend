import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, HiCheck, RiDeleteBinLine } from 'react-icons/all'
import { Button, ButtonGroup, Form, FormGroup, Modal } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import { formatDurationStr, durationStrAsSeconds, ratingInt } from '../../../helpers/utils'
import axiosInstance from '../../../helpers/axiosInstance'
import { dataTableStyle } from '../../../helpers/constants'
import axios from 'axios'
import { format, subMonths } from 'date-fns'

export default function RosterPurge() {
    const [reason, setReason] = useState('Removed for inactivity.')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [toggledClearRows, setToggledClearRows] = useState(false)
    const [currentRoster, setCurrentRoster] = useState('home')
    const [allUserStats, setAllUserStats] = useState<any>({})
    const [userStats, setUserStats] = useState<any>([])
    const [selected, setSelected] = useState<any>([])

    useEffect(() => fetchUserStatistics(), [])

    const fetchUserStatistics = () => {
        axiosInstance
            .get('/api/connections/statistics/')
            .then(res => {
                setAllUserStats(res.data)
                setUserStats(res.data.home.filter((user) => durationStrAsSeconds(user.curr_hours) < durationStrAsSeconds(user.activity_requirement)))
            })
    }

    const switchRoster = (roster) => {
        let userStats
        if (roster === 'all') {
            userStats = allUserStats.home.concat(allUserStats.visiting).concat(allUserStats.mavp)
        } else {
            userStats = allUserStats[roster]
        }
        setCurrentRoster(roster)
        setToggledClearRows(!toggledClearRows)
        setUserStats(userStats.filter((user) => durationStrAsSeconds(user.curr_hours) < durationStrAsSeconds(user.activity_requirement)))
    }

    const purgeSelectedUsers = (e) => {
        e.preventDefault()
        selected.forEach(user => deleteUser(user))
        setShowConfirmModal(false)
        setToggledClearRows(true)
        fetchUserStatistics()
    }

    const deleteUser = (user) => {
        let baseVatusaUrl = currentRoster === 'home'
            ? 'https://api.vatusa.net/v2/facility/ZHU/roster/'
            : 'https://api.vatusa.net/v2/facility/ZHU/roster/manageVisitor/'

        axiosInstance
            .delete('/api/users/' + user.cid + '/')
            .catch(err => console.log(err.response))

        axios
            .delete(baseVatusaUrl + user.cid, { data: { reason: reason } })
            .catch(err => console.log(err.response))
    }

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <ButtonGroup>
                        <Button
                            variant={'outline-darkblue' + (currentRoster === 'home' ? ' active' : '')}
                            onClick={() => switchRoster('home')}
                        >
                            Home
                        </Button>
                        <Button
                            variant={'outline-darkblue' + (currentRoster === 'visiting' ? ' active' : '')}
                            onClick={() => switchRoster('visiting')}
                        >
                            Visiting
                        </Button>
                    </ButtonGroup>
                </div>
                <DataTable
                    data={userStats}
                    title={<h5>{currentRoster === 'home' ? 'Home Controllers' : 'Visiting Controllers'}</h5>}
                    selectableRows
                    selectableRowsHighlight
                    onSelectedRowsChange={(state) => setSelected(state.selectedRows)}
                    clearSelectedRows={toggledClearRows}
                    contextActions={<Button onClick={() => setShowConfirmModal(true)} variant="red"><RiDeleteBinLine className="fill-white"/> Purge</Button>}
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
                            name: format(subMonths(new Date(), 2), 'MMMM'),
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
                            </div>
                        },
                        {
                            name: format(subMonths(new Date(), 1), 'MMMM'),
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
                            </div>
                        },
                        {
                            name: format(new Date(), 'MMMM'),
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
                            </div>
                        },
                    ]}
                    customStyles={dataTableStyle}
                />
            </Fade>
            <Modal
                size="lg"
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                keyboard={false}
                backdrop="static"
                centered
            >
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Roster Removal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Confirming action will automatically remove the following users from the VATUSA and local Houston ARTCC roster. <b>This action cannot be undone!</b></p>
                        <div className="mb-3">
                            {selected.map(user => <p className="mb-0 text-center"><code>{user.first_name} {user.last_name}</code></p>)}
                        </div>
                        <FormGroup>
                            <Form.Label>VATUSA will be sent the following as the reason for removal:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="reason"
                                required
                                rows={2}
                                value={reason}
                                onChange={event => setReason(event.target.value)}
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowConfirmModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" onClick={purgeSelectedUsers}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
