import { BiPlus, BiTrash, BsArrowDown, FaUpload, RiCheckFill, RiPencilRuler2Line } from 'react-icons/all'
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import fileDownload from 'js-file-download'
import { useSnackbar } from 'notistack'
import ScrollSpy from 'react-scrollspy'
import Dropzone from 'react-dropzone'
import Select from 'react-select'
import moment from 'moment'
import Header from '../components/Header'
import { isStaff } from '../helpers/auth'
import axiosInstance from '../helpers/axiosInstance'
import { formDataFromObject } from '../helpers/utils'
import { dataTableStyle } from '../helpers/constants'
import Spinner from '../components/Spinner'
import { useEffect, useState } from 'react'

export default function Resources() {
    const [resources, setResources] = useState<any>({})
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [newResource, setNewResource] = useState<any>({})
    const [loading, setLoading] = useState(true)

    const { enqueueSnackbar } = useSnackbar()

    const categories = ['VRC', 'vSTARS', 'vERAM', 'vATIS', 'SOP', 'LOA', 'MAVP', 'Misc']

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
        <section className="mb-5" id={category}>
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
                                sortFunction: (a, b) => {
                                    return moment(a.updated) > moment(b.updated) ? 1 : -1
                                },
                                format: row => moment.utc(row.updated).format('MMM. DD, YYYY'),
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
        </section>
    )

    const categoryOptions: any[] = []
    categories.map(category => categoryOptions.push({ value: category, label: category }))

    return (
        <>
            <Header title="Resources"/>
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <ScrollSpy
                            as={ListGroup}
                            style={{ top: 150, zIndex: 0 }}
                            className="p-0 mb-4 sticky-top"
                            currentClassName="active"
                            items={categories}
                            offset={-150}
                        >
                            {categories.map(category => {
                                return (
                                    <ListGroup.Item as="li">
                                        <a href={'#' + category}>{category}</a>
                                    </ListGroup.Item>
                                )
                            })}
                        </ScrollSpy>
                    </Col>
                    <Col className="ml-0 ml-md-5">
                        {isStaff() &&
                            <Button className="mb-5" onClick={() => setShowCreationModal(true)}>
                                <BiPlus className="fill-white" size={20} viewBox="5 1 25 25"/> New Resource
                            </Button>
                        }
                        {categories.map(category => <Category category={category} resources={resources[category.toLowerCase()]}/>)}
                    </Col>
                </Row>
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
                                <RiCheckFill className="fill-white" size={20} viewBox="3 2 25 25"/> Save
                            </Button>
                            <Button variant="red" onClick={() => deleteResource(newResource.id)}>
                                <BiTrash className="fill-white" size={20} viewBox="3 2 25 25"/> Delete
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    )
}
