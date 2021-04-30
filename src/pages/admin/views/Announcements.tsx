import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useSnackbar } from 'notistack'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../../helpers/axiosInstance'
import { BsArrowDown } from 'react-icons/all'
import moment from 'moment'
import { dataTableStyle } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import parse from 'html-react-parser'

export default function Announcements() {
    const [announcements, setAnnouncements] = useState<any>([])
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
    const [activeAnnouncement, setActiveAnnouncement] = useState<any>({})
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [announcementTitle, setAnnouncementTitle] = useState('')
    const [announcementBody, setAnnouncementBody] = useState('')

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => fetchAnnouncements(), [])

    const fetchAnnouncements = () => {
        axiosInstance
            .get('/api/announcements/')
            .then(res => setAnnouncements(res.data))
    }

    const handleSubmitAnnouncement= (e) => {
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
                        format: row => moment(row.end).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                        sortFunction: (a, b) => {
                            return moment(a.start) > moment(b.start) ? 1 : -1
                        },
                    },
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
                keyboard={false}
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
        </>
    )
}
