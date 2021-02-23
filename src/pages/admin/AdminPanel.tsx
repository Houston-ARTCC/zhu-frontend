import React, { Component } from 'react'
import { Button, Container, Form, Modal } from 'react-bootstrap'
import { withSnackbar } from 'notistack'
import Fade from 'react-reveal/Fade'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import axiosInstance from '../../helpers/axiosInstance'

class AdminPanel extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            showAnnouncementModal: false,
            announcementTitle: '',
            announcementBody: '',
        }
        this.handleSubmitAnnouncement = this.handleSubmitAnnouncement.bind(this)
    }

    handleSubmitAnnouncement(e) {
        e.preventDefault()
        axiosInstance
            .post('/api/announcements/', { title: this.state.announcementTitle, body: this.state.announcementBody })
            .then(res => {
                this.props.enqueueSnackbar('Announcement successfully posted!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                })
                this.setState({showAnnouncementModal: false})
            })
            .catch(err => {
                console.log(err.response)
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
            <div>
                <Navigation/>
                <Header title="Site Administration"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <Button onClick={() => this.setState({showAnnouncementModal: true})}>Post Announcement</Button>
                        <Modal
                            size="lg"
                            show={this.state.showAnnouncementModal}
                            onHide={() => this.setState({showAnnouncementModal: false})}
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
                                    <Button variant="lightgray" onClick={() => this.setState({showAnnouncementModal: false})}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit">Submit</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </Container>
                </Fade>
            </div>
        )
    }
}

export default withSnackbar(AdminPanel)
