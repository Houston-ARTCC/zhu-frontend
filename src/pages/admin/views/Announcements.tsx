import React, { Component } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../../helpers/axiosInstance'
import { BsArrowDown } from 'react-icons/all'
import moment from 'moment'
import { dataTableStyle } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import parse from 'html-react-parser'

class Announcements extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            announcements: [],
            showAnnouncementModal: false,
            activeAnnouncement: {},
            showCreateModal: false,
            announcementTitle: '',
            announcementBody: '',
        }
        this.handleSubmitAnnouncement = this.handleSubmitAnnouncement.bind(this)
    }

    componentDidMount() {
        this.fetchAnnouncements()
    }

    fetchAnnouncements() {
        axiosInstance
            .get('/api/announcements/')
            .then(res => this.setState({ announcements: res.data }))
    }

    handleSubmitAnnouncement(e) {
        e.preventDefault()
        axiosInstance
            .post('/api/announcements/', { title: this.state.announcementTitle, body: this.state.announcementBody })
            .then(res => {
                this.fetchAnnouncements()
                this.props.enqueueSnackbar('Announcement successfully posted!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                this.setState({showCreateModal: false})
            })
            .catch(err => {
                this.props.enqueueSnackbar(err.toString(), {
                    variant: 'error',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
            })
    }

    render() {
        return (
            <>
                <Button className="mb-3" onClick={() => this.setState({showCreateModal: true})}>Post Announcement</Button>
                <DataTable
                    data={this.state.announcements}
                    noHeader
                    pointerOnHover
                    highlightOnHover
                    defaultSortField="date"
                    sortIcon={<BsArrowDown/>}
                    customStyles={dataTableStyle}
                    onRowClicked={row => this.setState({showAnnouncementModal: true, activeAnnouncement: row})}
                    columns={[
                        {
                            name: 'Title',
                            selector: 'title',
                            sortable: true,
                        },
                        {
                            name: 'Author',
                            selector: 'author',
                            sortable: true,
                            format: row => row.author.first_name + ' ' + row.author.last_name,
                            sortFunction: (a, b) => {
                                return a.first_name > b.first_name ? 1 : -1
                            },
                        },
                        {
                            name: 'Posted',
                            selector: 'posted',
                            sortable: true,
                            format: row => moment(row.end).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                        },
                    ]}
                />
                <Modal
                    size="lg"
                    show={this.state.showAnnouncementModal}
                    onHide={() => this.setState({showAnnouncementModal: false})}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.activeAnnouncement.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.activeAnnouncement.body ? parse(this.state.activeAnnouncement.body) : ''}
                    </Modal.Body>
                </Modal>
                <Modal
                    size="lg"
                    show={this.state.showCreateModal}
                    onHide={() => this.setState({showCreateModal: false})}
                    keyboard={false}
                >
                    <Form onSubmit={this.handleSubmitAnnouncement}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Site Announcement</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={this.state.announcementTitle}
                                        onChange={event => this.setState({announcementTitle: event.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Body</Form.Label>
                                    <ReactQuill
                                        value={this.state.announcementBody}
                                        onChange={body => this.setState({announcementBody: body })}
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="lightgray" onClick={() => this.setState({showCreateModal: false})}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}

export default withSnackbar(Announcements)
