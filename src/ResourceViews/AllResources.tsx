import React, { Component } from 'react';
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import { BiPlus, BiTrash, BsArrowDown, FaUpload, RiCheckFill, RiPencilRuler2Line } from 'react-icons/all'
import axiosInstance from '../axiosInstance'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import fileDownload from 'js-file-download'
import Dropdown from 'react-dropdown'
import DataTable from 'react-data-table-component'
import { formDataFromObject, isStaff } from '../Helpers'
import Dropzone from 'react-dropzone'
import ScrollSpy from 'react-scrollspy'
import moment from 'moment'

export default class AllResources extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            categories: ['VRC', 'vSTARS', 'vERAM', 'vATIS', 'SOP', 'LOA', 'MAVP', 'Misc'],
            resources: {},
            showEditModal: false,
            showCreationModal: false,
            newResource: {},
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
    }

    componentDidMount() {
        this.fetchResources()
    }

    fetchResources() {
        axiosInstance
            .get('/api/resources')
            .then(res => {
                this.setState({ resources: res.data })
            })
    }

    handleDownload(url, filename) {
        axiosInstance
            .get(url, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, filename)
            })
    }

    createResource() {
        this.setState({ showCreationModal: true })
    }

    editResource(resource) {
        this.setState({
            showEditModal: true,
            newResource: {
                'id': resource.id,
                'name': resource.name,
                'category': resource.category,
                'path': resource.path,
            },
        })
    }

    deleteResource(id) {
        axiosInstance
            .delete('/api/resources/' + id + '/')
            .then(res => {
                this.setState({ showEditModal: false })
                this.fetchResources()
            })
    }

    handleNameChange(event) {
        let updatedResource = { ...this.state.newResource }
        updatedResource['name'] = event.target.value
        this.setState({ newResource: updatedResource })
    }

    handleFileChange(files) {
        let updatedResource = { ...this.state.newResource }
        updatedResource['path'] = files.pop()
        this.setState({ newResource: updatedResource })
    }

    handleCategoryChange(selected) {
        let updatedResource = { ...this.state.newResource }
        updatedResource['category'] = selected.value
        this.setState({ newResource: updatedResource })
    }

    handleSubmitCreate(e) {
        e.preventDefault()
        let formData = formDataFromObject(this.state.newResource)
        formData.append('path', this.state.newResource.path)
        axiosInstance
            .post('/api/resources/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                this.setState({ showCreationModal: false })
                this.fetchResources()
            })
    }

    handleSubmitEdit(e) {
        e.preventDefault()
        let formData = formDataFromObject(this.state.newResource)
        formData.append('path', this.state.newResource.path)
        axiosInstance
            .put('/api/resources/' + this.state.newResource.id + '/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                this.setState({ showEditModal: false })
                this.fetchResources()
            })
    }

    clearFile() {
        let updatedResource = { ...this.state.newResource }
        updatedResource['path'] = null
        this.setState({ newResource: updatedResource })
    }

    renderCategory(category) {
        let resources = this.state.resources[category.toLowerCase()]?.length
        return (
            <section className="mb-5" id={category}>
                <h3 className="text-black font-w700 mb-0">{category}</h3>
                <h5 className="text-gray font-w500 mb-3">{resources} Resource{resources !== 1 ? 's' : ''}</h5>
                <Card>
                    <Card.Body>
                        <DataTable
                            pointerOnHover={true}
                            data={this.state.resources[category.toLowerCase()]}
                            noHeader
                            highlightOnHover
                            noDataComponent="No resources for this category"
                            defaultSortField="name"
                            sortIcon={<BsArrowDown/>}
                            onRowClicked={row => this.handleDownload('http://api.zhuartcc.devel' + row.path, row.name + row.extension)}
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
                                    cell: (row) => <a onClick={() => this.editResource(row)}><RiPencilRuler2Line size={20}/></a>,
                                    omit: !isStaff(),
                                },
                            ]}
                            customStyles={{
                                table: {
                                    style: {
                                        backgroundColor: 'transparent',
                                    },
                                },
                                rows: {
                                    style: {
                                        backgroundColor: 'transparent',
                                    },
                                },
                                headRow: {
                                    style: {
                                        backgroundColor: 'transparent',
                                    },
                                },
                            }}
                        />
                    </Card.Body>
                </Card>
            </section>
        )
    }


    render() {
        const categoryOptions: any[] = []
        this.state.categories.map(category => categoryOptions.push({ value: category, label: category }))

        return (
            <div>
                <Navigation/>
                <Header title="Resources"/>
                <Container fluid>
                    <Row>
                        <Col md={3}>
                            <ScrollSpy
                                as={ListGroup}
                                style={{ top: 150 }}
                                className="p-0 sticky-top"
                                currentClassName="active"
                                items={this.state.categories}
                            >
                                {this.state.categories.map(category => {
                                    return (
                                        <ListGroup.Item as="li">
                                            <a href={'#' + category}>{category}</a>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ScrollSpy>
                        </Col>
                        <Col className="ml-5">
                            <Button className="mb-5" onClick={() => this.createResource()}>
                                <BiPlus className="fill-white" size={20} viewBox="5 1 25 25"/> New Resource
                            </Button>
                            {this.state.categories.map(category => this.renderCategory(category))}
                        </Col>
                    </Row>
                    <Modal
                        backdrop="static"
                        show={this.state.showCreationModal}
                        onHide={() => this.setState({ showCreationModal: false })}
                        onExited={() => this.clearFile()}
                    >
                        <Modal.Header>
                            <Modal.Title>Creating New Resource</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.handleSubmitCreate}>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required type="text" name="name" onChange={this.handleNameChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Dropdown options={categoryOptions} placeholder="Select a category" onChange={this.handleCategoryChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Dropzone maxFiles={2} onDrop={(acceptedFiles) => this.handleFileChange(acceptedFiles)}>
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input required {...getInputProps()} />
                                                <FaUpload className="fill-gray mb-2" size={30}/>
                                                <p className="text-gray mb-1">Drag and drop file here, or click to select file</p>
                                                <p className="text-gray">Current
                                                    File: <b>{this.state.newResource.path?.name}</b>
                                                </p>
                                            </div>
                                        )}
                                    </Dropzone>
                                </Form.Group>
                                <Button className="mr-2" variant="lightgray" onClick={() => this.setState({ showCreationModal: false })}>
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
                        show={this.state.showEditModal}
                        onHide={() => this.setState({ showEditModal: false })}
                        onExited={() => this.clearFile()}
                    >
                        <Modal.Header>
                            <Modal.Title>Editing {this.state.newResource.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.handleSubmitEdit}>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required type="text" name="name" value={this.state.newResource.name}
                                                  onChange={this.handleNameChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Dropdown options={categoryOptions} value={this.state.newResource.category} placeholder="Select a category"
                                              onChange={this.handleCategoryChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Dropzone maxFiles={2} onDrop={(acceptedFiles) => this.handleFileChange(acceptedFiles)}>
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input {...getInputProps()} />
                                                <FaUpload className="fill-gray mb-2" size={30}/>
                                                <p className="text-gray mb-1">Drag and drop file here, or click to select file</p>
                                                <p className="text-gray">Current
                                                    File: <b>{this.state.newResource.path?.name || this.state.newResource.path.split('/').pop()}</b>
                                                </p>
                                            </div>
                                        )}
                                    </Dropzone>
                                </Form.Group>
                                <Button className="mr-2" variant="lightgray" onClick={() => this.setState({ showEditModal: false })}>
                                    Cancel
                                </Button>
                                <Button className="mr-2" variant="primary" type="submit">
                                    <RiCheckFill className="fill-white" size={20} viewBox="3 2 25 25"/> Save
                                </Button>
                                <Button variant="red" onClick={() => this.deleteResource(this.state.newResource.id)}>
                                    <BiTrash className="fill-white" size={20} viewBox="3 2 25 25"/> Delete
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        )
    }
}
