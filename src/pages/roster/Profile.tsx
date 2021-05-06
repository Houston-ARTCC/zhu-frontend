import { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { BsArrowDown, FaCircle, IoStar, IoStarOutline, RiCalendarEventLine, RiPencilRuler2Line, RiPlaneLine } from 'react-icons/all'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import Header from '../../components/Header'
import StatisticCalendar from '../../components/StatisticCalendar'
import axiosInstance from '../../helpers/axiosInstance'
import { formatDurationStr } from '../../helpers/utils'
import { isStaff } from '../../helpers/auth'
import { dataTableStyle } from '../../helpers/constants'
import { format } from 'date-fns'
import { useParams } from 'react-router'
import LoadingScreen from '../../components/LoadingScreen'

export default function Profile() {
    const [user, setUser] = useState<any>(null)
    const [connections, setConnections] = useState<any>([])
    const [userStats, setUserStats] = useState([])
    const [feedback, setFeedback] = useState<any>([])
    const [expanded, setExpanded] = useState<any>({})
    const [loading, setLoading] = useState(true)

    const { cid } = useParams<any>()

    useEffect(() => {
        fetchUser()
        fetchUserConnections()
        fetchUserDailyStatistics()
        if (isStaff()) fetchUserFeedback()
    }, [cid])

    const fetchUser = () => {
        axiosInstance
            .get('/api/users/' + cid + '/')
            .then(res => {
                setUser(res.data)
                setLoading(false)
            })
    }

    const fetchUserConnections = () => {
        axiosInstance
            .get('/api/connections/sessions/' + cid + '/')
            .then(res => setConnections(res.data))
    }

    const fetchUserDailyStatistics = () => {
        axiosInstance
            .get('/api/connections/daily/' + new Date().getFullYear() + '/' + cid + '/')
            .then(res => setUserStats(res.data))
    }

    const fetchUserFeedback = () => {
        axiosInstance
            .get('/api/users/' + cid + '/feedback/')
            .then(res => setFeedback(res.data))
    }

    const Role = ({ role }) => {
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

    const Certification = ({ cert }) => {
        let color, name
        switch (cert) {
            case 1:
                color = 'yellow'
                name = 'Minor'
                break
            case 2:
                color = 'green'
                name = 'Major'
                break
            case 3:
                color = 'red'
                name = 'Solo'
                break
            default:
                color = 'lightgray'
                name = 'None'
                break
        }
        return <Badge variant={color + ' rounded'}>{name}</Badge>
    }

    const SmallCertification = ({ cert }) => {
        let color;
        switch (cert) {
            case 1: color = 'yellow'; break
            case 2: color = 'green'; break
            case 3: color = 'red'; break
            default: color = 'lightgray'; break
        }
        return <FaCircle className={'fill-' + color}/>
    }

    const ExpandableFeedback = ({ row }) => (
        <div className="px-5 py-3">
            {row.data.pilot_callsign && <p className="font-w500"><RiPlaneLine size={25} className="mr-2"/>{row.data.pilot_callsign}</p>}
            {row.data.event && <p className="font-w500"><RiCalendarEventLine size={25} className="mr-2"/>{row.data.event.name}</p>}
            {row.data.comments}
        </div>
    )

    if (loading) return <LoadingScreen/>

    return (
        <div>
            <Header
                title={user.first_name + ' ' + user.last_name}
                subtitle={user.rating?.long + ' - ' + user.cid}
            />
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="d-flex flex-column flex-md-row">
                                <div className="d-flex flex-column align-items-center mr-0 mr-md-4">
                                    <img
                                        className="profile-xl mb-4"
                                        src={process.env.REACT_APP_API_URL + user.profile}
                                        alt={user.first_name + ' ' + user.last_name}
                                    />
                                    {isStaff() &&
                                        <Link to={user.cid + '/edit'}>
                                            <Button variant="primary" className="mb-5"><RiPencilRuler2Line className="fill-white" viewBox="3 3 20 20"/> Edit User</Button>
                                        </Link>
                                    }
                                </div>
                                <div className="text-center text-md-left">
                                    <div className="mb-2">
                                        {user.roles.map(role => <Role role={role}/>)}
                                    </div>
                                    <p className="mb-5">{user.biography ? user.biography : 'This user has not set a biography.'}</p>
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
                                    <td><Certification cert={user.del_cert}/></td>
                                    <td><Certification cert={user.gnd_cert}/></td>
                                    <td><Certification cert={user.twr_cert}/></td>
                                    <td><Certification cert={user.app_cert}/></td>
                                    <td><Certification cert={user.ctr_cert}/></td>
                                    <td><Certification cert={user.ocn_cert}/></td>
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
                                    <td><SmallCertification cert={user.del_cert}/></td>
                                    <td><SmallCertification cert={user.gnd_cert}/></td>
                                    <td><SmallCertification cert={user.twr_cert}/></td>
                                    <td><SmallCertification cert={user.app_cert}/></td>
                                    <td><SmallCertification cert={user.ctr_cert}/></td>
                                    <td><SmallCertification cert={user.ocn_cert}/></td>
                                </tr>
                            </table>
                            <StatisticCalendar data={userStats} height={window.innerWidth < 768 ? 1000 : 200} vertical={window.innerWidth < 768}/>
                        </Col>
                        <Col>
                            <div className="mb-4">
                                <DataTable
                                    data={connections}
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
                                            sortFunction: (a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1,
                                            format: row => format(new Date(row.start), 'MMM d, Y'),
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
                                            sortFunction: (a, b) => a.duration > b.duration ? 1 : -1,
                                            format: row => formatDurationStr(row.duration),
                                        },
                                    ]}
                                />
                            </div>
                            {isStaff() &&
                                <DataTable
                                    data={feedback}
                                    title={<h5>Feedback</h5>}
                                    highlightOnHover
                                    defaultSortField="date"
                                    defaultSortAsc={false}
                                    pagination={true}
                                    paginationPerPage={5}
                                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                    expandableRows
                                    expandableRowsComponent={row => <ExpandableFeedback row={row}/>}
                                    expandableRowExpanded={row => row.id === expanded.id}
                                    onRowExpandToggled={(state, row) => state && setExpanded(row)}
                                    expandOnRowClicked
                                    onChangePage={() => setExpanded({})}
                                    onSort={() => setExpanded({})}
                                    sortIcon={<BsArrowDown/>}
                                    customStyles={dataTableStyle}
                                    columns={[
                                        {
                                            name: 'Date',
                                            selector: 'date',
                                            sortable: true,
                                            sortFunction: (a, b) => new Date(a.created) > new Date(b.created) ? 1 : -1,
                                            format: row => format(new Date(row.created), 'MMM d, Y'),
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
