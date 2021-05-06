import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import Header from '../../components/Header'
import axiosInstance from '../../helpers/axiosInstance'
import { useParams } from 'react-router'
import Error404 from '../errors/Error404'
import { roleOptions, selectStyles } from '../../helpers/constants'
import LoadingScreen from '../../components/LoadingScreen'

export default function EditUser() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

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
                                <Col>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control required type="text" name="first_name" value={user.first_name} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control required type="text" name="last_name" value={user.last_name} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={2}>
                                            <Form.Label>CID</Form.Label>
                                            <Form.Control required type="text" value={user.cid} disabled/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={2}>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control required type="text" value={user.rating.short} disabled/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" name="email" value={user.email} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={2}>
                                            <Form.Label>Facility</Form.Label>
                                            <Form.Control required type="text" name="home_facility" value={user.home_facility} onChange={handleTextChange}/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={2}>
                                            <Form.Label>Initials</Form.Label>
                                            <Form.Control required type="text" name="initials" value={user.initials} onChange={handleTextChange}/>
                                        </Form.Group>
                                    </Form.Row>
                                </Col>
                                <Col>
                                    <Form.Row>
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
                                    </Form.Row>
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
