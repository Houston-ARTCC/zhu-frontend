import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { BsArrowDown, FaCircle } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import Switch from 'react-bootstrap/Switch'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import { maxCertLevel, certName, ratingInt } from '../../helpers/utils'
import { dataTableStyle } from '../../helpers/constants'
import { useHistory } from 'react-router'
import LoadingScreen from '../../components/LoadingScreen'

export default function Roster() {
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [currentRoster, setCurrentRoster] = useState('home')
    const [allUsers, setAllUsers] = useState<any>({})
    const [users, setUsers] = useState<any>([])
    const [sortedUsers, setSortedUsers] = useState({})
    const [tableView, setTableView] = useState(window.innerWidth < 768)

    const history = useHistory()

    useEffect(() => fetchUsers(), [])
    useEffect(() => {
        setSortedUsers(
            users.reduce((sorted, user) => {
                sorted[maxCertLevel(user)] = [...sorted[maxCertLevel(user)] || [], user]
                return sorted
            }, {})
        )
    }, [users])

    const fetchUsers = () => {
        axiosInstance
            .get('/api/users/')
            .then(res => {
                setAllUsers(res.data)
                setUsers(res.data.home)
                setLoading(false)
            })
    }

    const switchRoster = (roster) => {
        let users
        if (roster === 'all') {
            users = allUsers.home.concat(allUsers.visiting).concat(allUsers.mavp)
        } else {
            users = allUsers[roster]
        }
        setCurrentRoster(roster)
        setUsers(users)
    }

    const userFilter = (user) => {
        let full_name = user.first_name + ' ' + user.last_name
        return (
            full_name.toLowerCase().includes(filter.toLowerCase()) ||
            user.cid.toString().includes(filter.toLowerCase()) ||
            user.initials.toLowerCase().includes(filter.toLowerCase()) ||
            user.rating.short.toLowerCase().includes(filter.toLowerCase())
        )
    }

    const Certification = ({ cert }) => {
        let color;
        switch (cert) {
            case 1: color = 'yellow'; break
            case 2: color = 'green'; break
            case 3: color = 'red'; break
            default: color = 'lightgray'; break
        }
        return <FaCircle className={'fill-' + color}/>
    }

    const UserCard = ({ user }) => (
        <Col sm={12} md={6} lg={4} xl={3} className="mx-auto">
            <Link to={`/roster/${user.cid}`}>
                <Card className="mb-4">
                    <Card.Header className="text-center py-4 px-1">
                        <img className="profile-lg mb-2" src={process.env.REACT_APP_API_URL + user.profile} alt={user.first_name + ' ' + user.last_name}/>
                        <Card.Title className="mb-0 text-black">
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
                                <td><Certification cert={user.del_cert}/></td>
                                <td><Certification cert={user.gnd_cert}/></td>
                                <td><Certification cert={user.twr_cert}/></td>
                                <td><Certification cert={user.app_cert}/></td>
                                <td><Certification cert={user.ctr_cert}/></td>
                                <td><Certification cert={user.ocn_cert}/></td>
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

    if (loading) return <LoadingScreen/>

    return (
        <div>
            <Header title="Roster"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                        <div className="mb-4">
                            <Form.Control placeholder="Search for controller..." value={filter} onChange={event => setFilter(event.target.value)}/>
                        </div>
                        <ButtonGroup className="mb-4">
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
                            <Button
                                variant={'outline-darkblue' + (currentRoster === 'mavp' ? ' active' : '')}
                                onClick={() => switchRoster('mavp')}
                            >
                                MAVP
                            </Button>
                            <Button
                                variant={'outline-darkblue' + (currentRoster === 'all' ? ' active' : '')}
                                onClick={() => switchRoster('all')}
                            >
                                All
                            </Button>
                        </ButtonGroup>
                        <Switch className="mb-4" checked={tableView} id="toggle-table" label="Toggle Table View" onChange={() => setTableView(!tableView)}/>
                    </div>
                    {tableView
                        ? <DataTable
                            data={users.filter(userFilter)}
                            noHeader
                            highlightOnHover
                            pointerOnHover
                            defaultSortField="name"
                            sortIcon={<BsArrowDown/>}
                            onRowClicked={row => history.push('/roster/' + row.cid) }
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
                                    format: row => <Certification cert={row.del_cert}/>,
                                },
                                {
                                    name: 'GND',
                                    selector: 'gnd',
                                    width: '10%',
                                    center: true,
                                    sortable: true,
                                    sortFunction: (a, b) => {return a.gnd_cert > b.gnd_cert ? -1 : 1},
                                    format: row => <Certification cert={row.gnd_cert}/>,
                                },
                                {
                                    name: 'TWR',
                                    selector: 'twr',
                                    width: '10%',
                                    center: true,
                                    sortable: true,
                                    sortFunction: (a, b) => {return a.twr_cert > b.twr_cert ? -1 : 1},
                                    format: row => <Certification cert={row.twr_cert}/>,
                                },
                                {
                                    name: 'APP',
                                    selector: 'app',
                                    width: '10%',
                                    center: true,
                                    sortable: true,
                                    sortFunction: (a, b) => {return a.app_cert > b.app_cert ? -1 : 1},
                                    format: row => <Certification cert={row.app_cert}/>,
                                },
                                {
                                    name: 'CTR',
                                    selector: 'ctr',
                                    width: '10%',
                                    center: true,
                                    sortable: true,
                                    sortFunction: (a, b) => {return a.ctr_cert > b.ctr_cert ? -1 : 1},
                                    format: row => <Certification cert={row.ctr_cert}/>,
                                },
                                {
                                    name: 'OCN',
                                    selector: 'ocn',
                                    width: '10%',
                                    center: true,
                                    sortable: true,
                                    sortFunction: (a, b) => {return a.ocn_cert > b.ocn_cert ? -1 : 1},
                                    format: row => <Certification cert={row.ocn_cert}/>,
                                },
                            ]}
                            customStyles={dataTableStyle}
                        />
                        : Object.keys(sortedUsers).reverse().filter(level => sortedUsers[level].some(userFilter)).map(level =>
                            <div className="text-center mb-5">
                                <h1 className="text-black font-w500 mb-4">{certName(parseInt(level))}</h1>
                                <Row>
                                    {sortedUsers[level].filter(userFilter).map(user => <UserCard user={user}/>)}
                                </Row>
                            </div>
                        )
                    }
                </Container>
            </Fade>
        </div>
    )
}
