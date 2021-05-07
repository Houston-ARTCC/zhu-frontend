import { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import { useHistory, useParams } from 'react-router'
import Error404 from '../errors/Error404'
import { roleOptions, selectStyles } from '../../helpers/constants'
import LoadingScreen from '../../components/LoadingScreen'
import { certLevel, certColor } from '../../helpers/utils'

export default function EditUser() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const history = useHistory()
    const { cid } = useParams<any>()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchUser(), []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchUser = () => {
        axiosInstance
            .get('/api/users/' + cid + '/')
            .then(res => {
                setUser(res.data)
                setLoading(false)
            })
            .catch(err => {
                if (err.response.status === 404) return <Error404/>
            })
    }

    const handleTextChange = (e) => {
        let modifiedUser = { ...user }
        modifiedUser[e.target.name] = e.target.value
        setUser(modifiedUser)
    }

    const handleSwitchChange = (event) => {
        let modifiedUser = { ...user }
        modifiedUser[event.target.name] = !modifiedUser[event.target.name]
        setUser(modifiedUser)
    }

    const handleRoleChange = (e) => {
        let userRoles : any[] = []
        e.map(role => userRoles.push({id: role.id, short: role.value, long: role.label}))
        let modifiedUser = { ...user }
        modifiedUser['roles'] = userRoles.sort((a, b) => a.id > b.id ? 1 : -1)
        setUser(modifiedUser)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axiosInstance
            .patch('/api/users/' + cid + '/', user)
            .then(res => {
                enqueueSnackbar('Changes to user details saved!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                history.push('/roster/' + cid)
            })
            .catch(err => {
                enqueueSnackbar(err.toString(), {
                    variant: 'error',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
            })
    }

    const setCert = (cert, int) => {
        let modifiedUser = { ...user }
        modifiedUser[cert] = int
        setUser(modifiedUser)
    }

    const CertOptions = ({ cert }) => (
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => setCert(cert, 0)}><Badge variant="lightgray rounded">None</Badge></Dropdown.Item>
            <Dropdown.Item onClick={() => setCert(cert, 1)}><Badge variant="yellow rounded">Minor</Badge></Dropdown.Item>
            <Dropdown.Item onClick={() => setCert(cert, 2)}><Badge variant="green rounded">Major</Badge></Dropdown.Item>
            <Dropdown.Item onClick={() => setCert(cert, 3)}><Badge variant="red rounded">Solo</Badge></Dropdown.Item>
        </Dropdown.Menu>
    )

    if (loading) return <LoadingScreen/>

    return (
        <div>
            <Header
                title={user.first_name + ' ' + user.last_name}
                subtitle="Editing User"
            />
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <div className="text-left">
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col className="mb-5 mb-md-0">
                                    <Form.Row>
                                        <Form.Group as={Col} xs={6} md={4}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control required type="text" name="first_name" value={user.first_name} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={6} md={4}>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control required type="text" name="last_name" value={user.last_name} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={6} md={2}>
                                            <Form.Label>CID</Form.Label>
                                            <Form.Control required type="text" value={user.cid} disabled/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={6} md={2}>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control required type="text" value={user.rating.short} disabled/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} xs={12} md={8}>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" name="email" value={user.email} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={6} md={2}>
                                            <Form.Label>Facility</Form.Label>
                                            <Form.Control required type="text" name="home_facility" value={user.home_facility} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={6} md={2}>
                                            <Form.Label>Initials</Form.Label>
                                            <Form.Control required type="text" name="initials" value={user.initials} onChange={handleTextChange}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Switch required className="mb-3" id="prevent_event_signup" name="prevent_event_signup" label="Prevent Event Sign Up" onChange={handleSwitchChange}/>
                                    <Form.Switch required className="mb-3" id="cic_endorsed" name="cic_endorsed" label="CIC Endorsed" onChange={handleSwitchChange}/>
                                </Col>
                                <Col>
                                    <table className="w-100 text-center mb-4" style={{ tableLayout: 'fixed' }}>
                                        <tr>
                                            <th><h6>DEL</h6></th>
                                            <th><h6>GND</h6></th>
                                            <th><h6>TWR</h6></th>
                                            <th><h6>APP</h6></th>
                                            <th><h6>CTR</h6></th>
                                            <th><h6>OCN</h6></th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle size="sm" variant={certColor(user.del_cert)}>{certLevel(user.del_cert)}</Dropdown.Toggle>
                                                    <CertOptions cert="del_cert"/>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle size="sm" variant={certColor(user.gnd_cert)}>{certLevel(user.gnd_cert)}</Dropdown.Toggle>
                                                    <CertOptions cert="gnd_cert"/>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle size="sm" variant={certColor(user.twr_cert)}>{certLevel(user.twr_cert)}</Dropdown.Toggle>
                                                    <CertOptions cert="twr_cert"/>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle size="sm" variant={certColor(user.app_cert)}>{certLevel(user.app_cert)}</Dropdown.Toggle>
                                                    <CertOptions cert="app_cert"/>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle size="sm" variant={certColor(user.ctr_cert)}>{certLevel(user.ctr_cert)}</Dropdown.Toggle>
                                                    <CertOptions cert="ctr_cert"/>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle size="sm" variant={certColor(user.ocn_cert)}>{certLevel(user.ocn_cert)}</Dropdown.Toggle>
                                                    <CertOptions cert="ocn_cert"/>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    </table>
                                    <Form.Group as={Col}>
                                        <Form.Label>Roles</Form.Label>
                                        <Select
                                            isMulti
                                            closeMenuOnSelect={false}
                                            isClearable={false}
                                            styles={selectStyles}
                                            onChange={handleRoleChange}
                                            value={user.roles.map(role => roleOptions.find(opt => opt.value === role.short))}
                                            options={roleOptions}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Link to={'/roster/' + cid} className="link-unstyled">
                                <Button className="mr-2" variant="lightgray">
                                    Return to Profile
                                </Button>
                            </Link>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Form>
                    </div>
                </Container>
            </Fade>
        </div>
    )
}
