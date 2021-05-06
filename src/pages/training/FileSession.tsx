import axiosInstance from '../../helpers/axiosInstance'
import { useHistory, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Fade from 'react-reveal/Fade'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import Select from 'react-select'
import { RiErrorWarningLine } from 'react-icons/all'
import { trainingLevelOptions, trainingOTSStatusOptions, trainingTypeOptions } from '../../helpers/constants'
import { useSnackbar } from 'notistack'

export default function FileSession() {
    const [session, setSession] = useState<any>(null)
    const [mentorOptions, setMentorOptions] = useState<any>([])

    const history = useHistory()
    const { id } = useParams<any>()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        fetchSession()
        fetchMentors()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchSession = () => {
        axiosInstance
            .get('/api/training/session/' + id + '/')
            .then(res => setSession(res.data))
    }

    const fetchMentors = () => {
        axiosInstance
            .get('/api/users/staff/')
            .then(res => {
                setMentorOptions([
                    {
                        label: 'Instructors',
                        options: res.data.ins.map(instructor => ({
                            value: instructor.cid,
                            label: instructor.first_name + ' ' + instructor.last_name
                        })),
                    },
                    {
                        label: 'Mentors',
                        options: res.data.mtr.map(mentor => ({
                            value: mentor.cid,
                            label: mentor.first_name + ' ' + mentor.last_name
                        })),
                    }
                ])
            })
    }

    const handleInstructorChange = (option) => {
        let modifiedSession = { ...session }
        modifiedSession['instructor'] = option.value
        setSession(modifiedSession)
    }

    const handleTypeChange = (option) => {
        let modifiedSession = { ...session }
        modifiedSession['type'] = option.value
        setSession(modifiedSession)
    }

    const handleLevelChange = (option) => {
        let modifiedSession = { ...session }
        modifiedSession['level'] = option.value
        setSession(modifiedSession)
    }

    const handleOTSStatusChange = (option) => {
        let modifiedSession = { ...session }
        modifiedSession['ots_status'] = option.value
        setSession(modifiedSession)
    }

    const handleProgressChange = (option) => {
        let modifiedSession = { ...session }
        modifiedSession['progress'] = option.value
        setSession(modifiedSession)
    }

    const handleTextChange = (e) => {
        let modifiedSession = { ...session }
        modifiedSession[e.target.name] = e.target.value
        setSession(modifiedSession)
    }

    const handleDateChange = (e) => {
        let modifiedSession = { ...session }
        modifiedSession[e.target.name] = e.target.value + 'Z'
        setSession(modifiedSession)
    }

    const handleSwitchChange = (e) => {
        let modifiedSession = { ...session }
        modifiedSession[e.target.name] = !modifiedSession[e.target.name]
        setSession(modifiedSession)
    }

    const handleNotesChange = (value) => {
        let modifiedSession = { ...session }
        modifiedSession['notes'] = value
        setSession(modifiedSession)
    }

    const handleFileSession = (e) => {
        e.preventDefault()
        let newSession = session
        delete newSession.student
        newSession['instructor'] = newSession.instructor.cid
        axiosInstance
            .post('/api/training/session/' + id + '/', newSession)
            .then(res => {
                enqueueSnackbar('Successfully filed training session', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                history.push('/training/scheduled')
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

    return (
        <>
            <Header
                title="Filing Training Session"
                subtitle={'For ' + session?.student.first_name + ' ' + session?.student.last_name}
            />
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Alert variant="purple" className="position-unset d-flex mb-5">
                        <div><RiErrorWarningLine className="fill-purple mr-3" size={25}/></div>
                        <div>
                            <h5>Read before submitting!</h5>
                            <p>Submitting this form will automatically submit this training session to the VATUSA Centralized Training Record System, thus there is no need to create this session on the VATUSA website! That being said, do not submit this form if the student failed to appear for the session or if the session was cancelled.</p>
                            <p className="m-0">If this session is an OTS examination, submit the OTS form separately as a supplement to this note at <Alert.Link href={'https://www.vatusa.net/mgt/controller/' + session?.student.cid + '/promote'} target="_blank">https://www.vatusa.net/mgt/controller/{session?.student.cid}/promote</Alert.Link>.</p>
                        </div>
                    </Alert>
                    <Form onSubmit={handleFileSession}>
                        <Row className="mb-4">
                            <Col>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Student</Form.Label>
                                        <Form.Control disabled value={session?.student.first_name + ' ' + session?.student.last_name}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Instructor</Form.Label>
                                        <Select
                                            onChange={handleInstructorChange}
                                            options={mentorOptions}
                                            value={{
                                                value: session?.instructor.cid,
                                                label: session?.instructor.first_name + ' ' + session?.instructor.last_name
                                            }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="start" value={session?.start.slice(0, -1)} onChange={handleDateChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>End (Zulu)</Form.Label>
                                        <Form.Control required type="datetime-local" name="end" value={session?.end.slice(0, -1)} onChange={handleDateChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Type</Form.Label>
                                        <Select
                                            onChange={handleTypeChange}
                                            options={trainingTypeOptions}
                                            value={trainingTypeOptions.find(opt => opt.value === session?.type)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Level</Form.Label>
                                        <Select
                                            onChange={handleLevelChange}
                                            options={trainingLevelOptions}
                                            value={trainingLevelOptions.find(opt => opt.value === session?.level)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>OTS Status</Form.Label>
                                        <Select
                                            onChange={handleOTSStatusChange}
                                            options={trainingOTSStatusOptions}
                                            value={trainingOTSStatusOptions.find(opt => opt.value === session?.ots_status)}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Progress</Form.Label>
                                        <Select
                                            onChange={handleProgressChange}
                                            options={[
                                                { value: 1, label: 'No Progress' },
                                                { value: 2, label: 'Little Progress' },
                                                { value: 3, label: 'Average Progress' },
                                                { value: 4, label: 'Great Progress' },
                                                { value: 5,label: 'Exceptional Progress' },
                                            ]}
                                            defaultValue={{ value: 3, label: 'Average Progress' }}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Movements</Form.Label>
                                        <Form.Control type="number" name="movements" value={session?.movements} onChange={handleTextChange}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Position</Form.Label>
                                        <Form.Control name="position" value={session?.position} onChange={handleTextChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Switch id="solo_granted" name="solo_granted" label="Solo endorsement was granted at the conclusion of this session." checked={session?.solo_granted} onChange={handleSwitchChange}/>
                            </Col>
                            <Form.Group as={Col}>
                                <Form.Label>Training Notes</Form.Label>
                                <ReactQuill
                                    value={session?.notes}
                                    onChange={handleNotesChange}
                                    style={{ height: 265 }}
                                    modules={{
                                        toolbar: [
                                            [{'header': [1, 2, 3, 4, 5, 6, false] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                            ['link', 'image', 'code-block'],
                                            ['clean']
                                        ],
                                    }}
                                />
                            </Form.Group>
                        </Row>
                        <Button variant="gray" className="mr-2" onClick={() => history.push('/training/scheduled')}>Cancel</Button>
                        <Button type="submit">File Session</Button>
                    </Form>
                </Container>
            </Fade>
        </>
    )
}
