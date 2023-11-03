import {useEffect, useState} from 'react'
import DataTable from 'react-data-table-component'
import {BsArrowDown, HiCheck, RiDeleteBinLine} from 'react-icons/all'
import {Button, ButtonGroup, Form, FormGroup, Modal} from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import {durationStrAsSeconds, formatDurationStr, ratingInt} from '../../../helpers/utils'
import axiosInstance from '../../../helpers/axiosInstance'
import {dataTableStyle} from '../../../helpers/constants'

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
        selected.forEach(deleteUser)
        setShowConfirmModal(false)
        setToggledClearRows(true)
        fetchUserStatistics()
    }

    const deleteUser = (user) => {
        axiosInstance
            .delete('/api/users/' + user.cid + '/', { data: { reason } })
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
                    contextActions={<Button onClick={() => setShowConfirmModal(true)} variant="red"><RiDeleteBinLine/> Purge</Button>}
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
