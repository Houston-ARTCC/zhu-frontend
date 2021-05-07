import Header from '../../components/Header'
import Fade from 'react-reveal/Fade'
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { RiAddFill, RiCheckFill, RiCloseFill } from 'react-icons/all'
import { useEffect, useState } from 'react'
import axiosInstance from '../../helpers/axiosInstance'

export default function PositionPresets() {
    const [presets, setPresets] = useState<any>([])
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [showAddPositionsModal, setShowAddPositionsModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [currentPreset, setCurrentPreset] = useState<any>(null)
    const [newPresetName, setNewPresetName] = useState('')
    const [newPositions, setNewPositions] = useState([{callsign: '', shifts: 2}])
    const [update, triggerUpdate] = useState(false)

    useEffect(() => fetchPresets(), [])

    const fetchPresets = () => {
        axiosInstance
            .get('/api/events/presets/')
            .then(res => setPresets(res.data))
    }

    const handleCreatePreset = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/events/presets/', {'name': newPresetName})
            .then(res => {
                fetchPresets()
                setShowCreationModal(false)
            })
    }

    const handleDeletePreset = (e) => {
        e.preventDefault()
        axiosInstance
            .delete('/api/events/presets/' + currentPreset.id + '/')
            .then(res => {
                fetchPresets()
                setShowDeleteModal(false)
            })
    }

    const handleUpdatePositions = (preset, positions) => {
        axiosInstance
            .put('/api/events/presets/' + preset.id + '/', {
                positions: positions
                    .filter(pos => pos.callsign && pos.callsign.includes('_'))
                    .filter((current, index, array) => array.findIndex(pos => pos.callsign === current.callsign) === index)
            })
            .then(res => {
                fetchPresets()
                setShowAddPositionsModal(false)
            })
    }

    const handleDeletePosition = (preset, callsign) => {
        handleUpdatePositions(preset, preset.positions.filter(pos => pos.callsign !== callsign))
    }

    const getEnroutePositions = (preset) => {
        return preset.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'CTR' || level === 'FSS'
        })
    }

    const getTRACONPositions = (preset) => {
        return preset.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'APP' || level === 'DEP'
        })
    }

    const getLocalPositions = (preset) => {
        return preset.positions?.filter(position => {
            let level = position.callsign.split('_').slice(-1).pop()
            return level === 'DEL' || level === 'GND' || level === 'TWR'
        })
    }

    const handlePositionsFormSubmit = (e) => {
        e.preventDefault()
        addEmptyPosition()
    }

    const addEmptyPosition = () => {
        const tempPositions = newPositions
        tempPositions.push({callsign: '', shifts: 2})
        setNewPositions(tempPositions)
        triggerUpdate(!update)
    }

    const updateCallsignAtIndex = (index, newCallsign) => {
        const tempPositions = newPositions
        tempPositions[index]['callsign'] = newCallsign
        setNewPositions(tempPositions)
        triggerUpdate(!update)
    }

    const updateShiftsAtIndex = (index, newShifts) => {
        const tempPositions = newPositions
        tempPositions[index]['shifts'] = newShifts
        setNewPositions(tempPositions)
        triggerUpdate(!update)
    }

    const Preset = ({ preset }) => (
        <Col md={12} xl={6}>
            <Card className="mb-4">
                <Card.Body>
                    <div className="float-right mt-1">
                        <Button
                            variant="bg-primary mr-1"
                            className="btn-sm"
                            onClick={() => {
                                setCurrentPreset(preset)
                                setShowAddPositionsModal(true)
                            }}
                        >
                            <RiAddFill viewBox="2 4 20 20"/> Add Positions
                        </Button>
                        <Button
                            variant="bg-red"
                            className="btn-sm"
                            onClick={() => {
                                setCurrentPreset(preset)
                                setShowDeleteModal(true)
                            }}
                        >
                            <RiCloseFill viewBox="2 4 20 20"/> Delete Preset
                        </Button>
                    </div>
                    <h2 className="text-black mb-1">{preset.name}</h2>
                    <h6 className="text-gray mb-4">{preset.positions?.length} Position{preset.positions?.length !== 1 ? 's' : ''}</h6>
                    <Row>
                        <Col xs={12} sm={4} className="text-left">
                            <h5 className="text-black font-w500 mb-2">Enroute Positions</h5>
                            <ul className="p-0 list-unstyled">
                                {getEnroutePositions(preset)?.length > 0
                                    ? getEnroutePositions(preset)?.map(position => (
                                        <p>
                                            <RiCloseFill className="fill-red mr-1" style={{ cursor: 'pointer'}} onClick={() => handleDeletePosition(preset, position.callsign)}/>
                                            {position.callsign} - {position.shifts}
                                        </p>
                                    ))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col xs={12} sm={4} className="text-left">
                            <h5 className="text-black font-w500 mb-2">TRACON Positions</h5>
                            <ul className="p-0 list-unstyled">
                                {getTRACONPositions(preset)?.length > 0
                                    ? getTRACONPositions(preset)?.map(position => (
                                        <p>
                                            <RiCloseFill className="fill-red mr-1" style={{ cursor: 'pointer'}} onClick={() => handleDeletePosition(preset, position.callsign)}/>
                                            {position.callsign} - {position.shifts}
                                        </p>
                                    ))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                        <Col xs={12} sm={4} className="text-left">
                            <h5 className="text-black font-w500 mb-2">Local Positions</h5>
                            <ul className="p-0 list-unstyled">
                                {getLocalPositions(preset)?.length > 0
                                    ? getLocalPositions(preset)?.map(position => (
                                        <p>
                                            <RiCloseFill className="fill-red mr-1" style={{ cursor: 'pointer'}} onClick={() => handleDeletePosition(preset, position.callsign)}/>
                                            {position.callsign} - {position.shifts}
                                        </p>
                                    ))
                                    : <p>No positions posted.</p>
                                }
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )

    return (
        <>
            <Header title="Position Presets"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Button className="mb-5" onClick={() => setShowCreationModal(true)}>
                        <RiAddFill size={20}/> New Preset
                    </Button>
                    <Row>
                        {presets.map(preset => <Preset preset={preset}/>)}
                    </Row>
                </Container>
            </Fade>
            <Modal
                backdrop="static"
                show={showCreationModal}
                onHide={() => setShowCreationModal(false)}
                onExited={() => setNewPresetName('')}
            >
                <Modal.Header>
                    <Modal.Title>Create Position Preset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreatePreset}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control required onChange={(e) => setNewPresetName(e.target.value)}/>
                        </Form.Group>
                        <Button className="mr-2" variant="lightgray" onClick={() => setShowCreationModal(false)}>
                            Cancel
                        </Button>
                        <Button className="mr-2" variant="primary" type="submit">
                            <RiCheckFill size={20}/> Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Delete Position Preset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you would like to delete the <b>{currentPreset?.name}</b> preset? This action cannot be undone!</p>
                    <Form onSubmit={handleDeletePreset}>
                        <Button className="mr-2" variant="lightgray" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button className="mr-2" variant="primary" type="submit">
                            Confirm
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={showAddPositionsModal}
                onHide={() => setShowAddPositionsModal(false)}
                onExited={() => setNewPositions([{callsign: '', shifts: 2}])}
            >
                <Modal.Header>
                    <Modal.Title>Add Positions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Adding positions to the <b>{currentPreset?.name}</b> preset.</p>
                    <Form onSubmit={handlePositionsFormSubmit}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Callsign</Form.Label>
                                <Form.Control required onChange={(e) => updateCallsignAtIndex(0, e.target.value)}/>
                            </Form.Group>
                            <Form.Group as={Col} md={3}>
                                <Form.Label>Shifts</Form.Label>
                                <Form.Control required type="number" value={newPositions[0].shifts} onChange={(e) => updateShiftsAtIndex(0, e.target.value)}/>
                            </Form.Group>
                        </Form.Row>
                        {newPositions.slice(1).map((position, index) => (
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Control autoFocus required onChange={(e) => updateCallsignAtIndex(index + 1, e.target.value)}/>
                                </Form.Group>
                                <Form.Group as={Col} md={3}>
                                    <Form.Control required type="number" value={newPositions[index + 1].shifts} onChange={(e) => updateShiftsAtIndex(index + 1, e.target.value)}/>
                                </Form.Group>
                            </Form.Row>
                        ))}
                        <button hidden type="submit"/>
                    </Form>
                    <Button className="mr-2" variant="lightgray" onClick={() => setShowAddPositionsModal(false)}>
                        Cancel
                    </Button>
                    <Button className="mr-2" variant="primary" onClick={() => handleUpdatePositions(currentPreset, [...currentPreset?.positions, ...newPositions])}>
                        Confirm
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}