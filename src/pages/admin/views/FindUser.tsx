import { useEffect, useState } from 'react'
import { Badge, Col, Form, Row } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import { BsArrowDown } from 'react-icons/all'
import { ratingInt, userStatusDisplay } from '../../../helpers/utils'
import { dataTableStyle, roleOptions } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import axiosInstance from '../../../helpers/axiosInstance'
import Spinner from '../../../components/Spinner'
import { useHistory } from 'react-router'

export default function FindUser() {
    const [users, setUsers] = useState<any>([])
    const [search, setSearch] = useState('')
    const [rating, setRating] = useState('')
    const [role, setRole] = useState('')
    const [showNonMembers, setShowNonMembers] = useState(false)
    const [loading, setLoading] = useState(true)

    const history = useHistory()

    useEffect(() => fetchUsers(), [])

    const fetchUsers = () => {
        axiosInstance
            .get('/api/users/all/')
            .then(res => {
                setUsers(res.data)
                setLoading(false)
            })
    }

    const userFilter = (user) => {
        if (!showNonMembers && user.status === 2) return false
        if (rating && user.rating.short !== rating) return false
        if (role && user.roles.every(userRole => userRole.short !== role)) return false

        let filter = search.toLowerCase()
        let full_name = user.first_name + ' ' + user.last_name

        return (
            full_name.toLowerCase().includes(filter) ||
            user.cid.toString().includes(filter) ||
            user.initials?.toLowerCase().includes(filter)
        )
    }

    const handleRatingChange = (selected) => setRating(selected?.label)

    const handleRoleChange = (selected) => setRole(selected?.value)

    const Status = ({ status }) => {
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

    const Role = ({ role }) => {
        if (role.short === 'HC' || role.short === 'VC' || role.short === 'MC')
            return <Badge variant="darkblue rounded" className="mr-2">{role.long}</Badge>
        return <></>
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="position-relative">
                <Row>
                    <Col md={3}>
                        <Form.Control
                            placeholder="Search"
                            value={search}
                            className="mb-3"
                            onChange={event => setSearch(event.target.value)}
                        />
                        <Select
                            onChange={handleRatingChange}
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
                            onChange={handleRoleChange}
                        />
                        <Form.Switch
                            id="show-non-members"
                            label="Show non-members."
                            checked={showNonMembers}
                            onChange={() => setShowNonMembers(!showNonMembers)}
                        />
                    </Col>
                    <Col>
                        <DataTable
                            data={users.filter(userFilter)}
                            noHeader
                            highlightOnHover
                            pointerOnHover
                            defaultSortField="name"
                            sortIcon={<BsArrowDown/>}
                            pagination={true}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 15, 20, 25]}
                            progressPending={loading}
                            progressComponent={<Spinner/>}
                            onRowClicked={row => history.push('/roster/' + row.cid) }
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
                                    format: row => <Status status={row.status}/>,
                                    width: '15%',
                                },
                                {
                                    name: 'Main Role',
                                    selector: 'main_role',
                                    format: row => row.roles?.map(role => <Role role={role}/>),
                                    width: '25%',
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </div>
        </Fade>
    )
}
