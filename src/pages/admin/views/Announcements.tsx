import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../../helpers/axiosInstance'
import { BsArrowDown, RiDeleteBin2Fill, RiDeleteBin2Line, RiDeleteBinLine, RiPencilRuler2Line } from 'react-icons/all'
import { dataTableStyle } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import parse from 'html-react-parser'
import { format } from 'date-fns-tz'

export default function Announcements() {
    const [announcements, setAnnouncements] = useState<any>([])
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
    const [activeAnnouncement, setActiveAnnouncement] = useState<any>({})
    const [announcementTitle, setAnnouncementTitle] = useState('')
    const [announcementBody, setAnnouncementBody] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchAnnouncements(), [])

    const fetchAnnouncements = () => {
        axiosInstance
            .get('/api/announcements/')
            .then(res => setAnnouncements(res.data))
    }

    const handleSubmitAnnouncement = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/api/announcements/', { title: announcementTitle, body: announcementBody })
            .then(res => {
                fetchAnnouncements()
                enqueueSnackbar('Announcement successfully posted!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowCreateModal(false)
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

    const handleDeleteAnnouncement = (e) => {
        e.preventDefault()
        axiosInstance
            .delete('/api/announcements/' + activeAnnouncement.id + '/')
            .then(res => {
                fetchAnnouncements()
                enqueueSnackbar('Announcement successfully deleted!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                setShowDeleteModal(false)
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
            <Button className="mb-3" onClick={() => setShowCreateModal(true)}>Post Announcement</Button>
            <DataTable
                data={announcements}
                noHeader
                pointerOnHover
                highlightOnHover
                defaultSortField="date"
                sortIcon={<BsArrowDown/>}
                customStyles={dataTableStyle}
                onRowClicked={row => {
                    setShowAnnouncementModal(true)
                    setActiveAnnouncement(row)
                }}
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
                        format: row => format(new Date(row.posted), 'MMM d, Y @ kk:mm zzz'),
                        sortFunction: (a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1,
                    },
                    {
                        name: 'Delete',
                        button: true,
                        cell: row => (
                            <Button
                                variant="link"
                                onClick={() => {
                                    setActiveAnnouncement(row)
                                    setShowDeleteModal(true)
                                }}
                            >
                                <RiDeleteBinLine size={20}/>
                            </Button>
                        ),
                    }
                ]}
            />
            <Modal
                size="lg"
                show={showAnnouncementModal}
                onHide={() => setShowAnnouncementModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{activeAnnouncement.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {activeAnnouncement.body ? parse(activeAnnouncement.body) : ''}
                </Modal.Body>
            </Modal>
            <Modal
                size="lg"
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                backdrop="static"
            >
                <Form onSubmit={handleSubmitAnnouncement}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Site Announcement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={announcementTitle}
                                onChange={event => setAnnouncementTitle(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Body</Form.Label>
                            <ReactQuill
                                value={announcementBody}
                                onChange={body => setAnnouncementBody(body)}
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
                        <Button variant="lightgray" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
            >
                <Form onSubmit={handleDeleteAnnouncement}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Site Announcement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you would like to delete <b>{activeAnnouncement.title}</b>? This action cannot be undone.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="lightgray" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Confirm</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
