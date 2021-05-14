import { BiTrash, BsArrowDown, FaUpload, RiAddFill, RiCheckFill, RiPencilRuler2Line } from 'react-icons/all'
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import fileDownload from 'js-file-download'
import { useSnackbar } from 'notistack'
import ScrollSpy from 'react-scrollspy'
import Dropzone from 'react-dropzone'
import Select from 'react-select'
import Header from '../components/Header'
import { isStaff } from '../helpers/auth'
import axiosInstance from '../helpers/axiosInstance'
import { formDataFromObject } from '../helpers/utils'
import { dataTableStyle } from '../helpers/constants'
import Spinner from '../components/Spinner'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns-tz'
import Fade from 'react-reveal/Fade'

export default function Resources() {
    const [resources, setResources] = useState<any>({})
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [newResource, setNewResource] = useState<any>({})
    const [loading, setLoading] = useState(true)

    const categories = ['VRC', 'vSTARS', 'vERAM', 'vATIS', 'SOP', 'LOA', 'MAVP', 'Misc']

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchResources(), [])

    const fetchResources = () => {
        axiosInstance
            .get('/api/resources/')
            .then(res => {
                setResources(res.data)
                setLoading(false)
            })
    }

    const handleDownload = (url, filename) => {
        axiosInstance
            .get(url, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, filename)
            })
    }

    const editResource = (resource) => {
        setShowEditModal(true)
        setNewResource({
            'id': resource.id,
            'name': resource.name,
            'category': resource.category,
            'path': resource.path,
        })
    }

    const deleteResource = (id) => {
        axiosInstance
            .delete('/api/resources/' + id + '/')
            .then(res => {
                setShowEditModal(false)
                fetchResources()
            })
    }

    const handleNameChange = (event) => {
        let updatedResource = { ...newResource }
        updatedResource['name'] = event.target.value
        setNewResource(updatedResource)
    }

    const handleFileChange = (files) => {
        let updatedResource = { ...newResource }
        updatedResource['path'] = files.pop()
        setNewResource(updatedResource)
    }

    const handleCategoryChange = (selected) => {
        let updatedResource = { ...newResource }
        updatedResource['category'] = selected.value
        setNewResource(updatedResource)
    }

    const handleSubmitCreate = (e) => {
        e.preventDefault()
        let formData = formDataFromObject(newResource)
        formData.append('path', newResource.path)
        axiosInstance
            .post('/api/resources/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                setShowCreationModal(false)
                fetchResources()
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

    const handleSubmitEdit = (e) => {
        e.preventDefault()
        let formData = formDataFromObject(newResource)
        formData.append('path', newResource.path)
        axiosInstance
            .put('/api/resources/' + newResource.id + '/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                setShowEditModal(false)
                fetchResources()
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

    const clearFile = () => {
        let updatedResource = { ...newResource }
        updatedResource['path'] = null
        setNewResource(updatedResource)
    }

    const Category = ({ category, resources }) => (
        <>
            <h2 className="text-black mb-1">{category}</h2>
            <h6 className="text-gray mb-4">{resources?.length} Resource{resources?.length !== 1 ? 's' : ''}</h6>
            <Card>
                <Card.Body>
                    <DataTable
                        pointerOnHover={true}
                        data={resources}
                        noHeader
                        highlightOnHover
                        noDataComponent="No resources for this category"
                        defaultSortField="name"
                        sortIcon={<BsArrowDown/>}
                        progressPending={loading}
                        progressComponent={<Spinner/>}
                        onRowClicked={row => handleDownload(process.env.REACT_APP_API_URL + row.path, row.name + row.extension)}
                        columns={[
                            {
                                name: 'Name',
                                selector: 'name',
                                sortable: true,
                            },
                            {
                                name: 'Extension',
                                selector: 'extension',
                                sortable: true,
                            },
                            {
                                name: 'Size',
                                selector: 'size',
                                sortable: true,
                            },
                            {
                                name: 'Updated',
                                selector: 'updated',
                                sortable: true,
                                sortFunction: (a, b) => new Date(a.updated) > new Date(b.updated) ? 1 : -1,
                                format: row => format(new Date(row.updated), 'MMM d, Y'),
                            },
                            {
                                name: 'Edit',
                                button: true,
                                cell: (row) => <Button variant="link" onClick={() => editResource(row)}><RiPencilRuler2Line size={20}/></Button>,
                                omit: !isStaff(),
                            },
                        ]}
                        customStyles={dataTableStyle}
                    />
                </Card.Body>
            </Card>
        </>
    )

    const categoryOptions = categories.map(category => ({ value: category, label: category }))

    return (
        <>
            <Header title="Resources"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <ScrollSpy
                                as={ListGroup}
                                style={{ top: 150, zIndex: 0 }}
                                className="p-0 mb-4 sticky-top"
                                currentClassName="active"
                                items={['VRC', 'vSTARS', 'vERAM', 'vATIS', 'SOP', 'LOA', 'MAVP', 'Misc']}
                                offset={-150}
                            >
                                <ListGroup.Item as="li"><a href="#VRC">VRC</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#vSTARS">vSTARS</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#vERAM">vERAM</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#vATIS">vATIS</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#SOP">SOP</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#LOA">LOA</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#MAVP">MAVP</a></ListGroup.Item>
                                <ListGroup.Item as="li"><a href="#Misc">Misc</a></ListGroup.Item>
                            </ScrollSpy>
                        </Col>
                        <Col className="ml-0 ml-md-5">
                            {isStaff() &&
                                <Button className="mb-5" onClick={() => setShowCreationModal(true)}>
                                    <RiAddFill size={20}/> New Resource
                                </Button>
                            }
                            <section className="mb-5" id="VRC"><Category category="VRC" resources={resources['vrc']}/></section>
                            <section className="mb-5" id="vSTARS"><Category category="vSTARS" resources={resources['vstars']}/></section>
                            <section className="mb-5" id="vERAM"><Category category="vERAM" resources={resources['veram']}/></section>
                            <section className="mb-5" id="vATIS"><Category category="vATIS" resources={resources['vatis']}/></section>
                            <section className="mb-5" id="SOP"><Category category="SOP" resources={resources['sop']}/></section>
                            <section className="mb-5" id="LOA"><Category category="LOA" resources={resources['loa']}/></section>
                            <section className="mb-5" id="MAVP"><Category category="MAVP" resources={resources['mavp']}/></section>
                            <section className="mb-5" id="Misc"><Category category="Misc" resources={resources['misc']}/></section>
                        </Col>
                    </Row>
                </Container>
            </Fade>
            <Modal
                backdrop="static"
                show={showCreationModal}
                onHide={() => setShowCreationModal(false)}
                onExited={clearFile}
            >
                <Modal.Header>
                    <Modal.Title>Creating New Resource</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitCreate}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" name="name" onChange={handleNameChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Select
                                options={categoryOptions}
                                onChange={handleCategoryChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Dropzone maxFiles={2} onDrop={(acceptedFiles) => handleFileChange(acceptedFiles)}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()} />
                                        <FaUpload className="fill-gray mb-2" size={30}/>
                                        <p className="text-gray mb-1">Drag and drop file here, or click to select file</p>
                                        <p className="text-gray">Current
                                            File: <b>{newResource.path?.name}</b>
                                        </p>
                                    </div>
                                )}
                            </Dropzone>
                        </Form.Group>
                        <Button className="mr-2" variant="lightgray" onClick={() => setShowCreationModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onExited={clearFile}
            >
                <Modal.Header>
                    <Modal.Title>Editing {newResource.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" name="name" value={newResource.name} onChange={handleNameChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Select
                                options={categoryOptions}
                                value={{ value: newResource.category, label: newResource.category }}
                                onChange={handleCategoryChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Dropzone maxFiles={2} onDrop={(acceptedFiles) => handleFileChange(acceptedFiles)}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()} />
                                        <FaUpload className="fill-gray mb-2" size={30}/>
                                        <p className="text-gray mb-1">Drag and drop file here, or click to select file</p>
                                        <p className="text-gray">Current
                                            File: <b>{newResource.path?.name || newResource.path.split('/').pop()}</b>
                                        </p>
                                    </div>
                                )}
                            </Dropzone>
                        </Form.Group>
                        <Button className="mr-2" variant="lightgray" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button className="mr-2" variant="primary" type="submit">
                            <RiCheckFill size={20}/> Save
                        </Button>
                        <Button variant="red" onClick={() => deleteResource(newResource.id)}>
                            <BiTrash size={20}/> Delete
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
