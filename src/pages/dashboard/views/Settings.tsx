import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import Fade from 'react-reveal/Fade'
import { getTheme, setTheme } from '../../../helpers/themeManager'
import { Button, Form, Modal } from 'react-bootstrap'
import ProfilePicture from '@dsalvagni/react-profile-picture'
import '@dsalvagni/react-profile-picture/build/ProfilePicture.css'
import axiosInstance from '../../../helpers/axiosInstance'
import { useSnackbar } from 'notistack'
import { getCID, isMember } from '../../../helpers/auth'

export default function Settings() {
    const [user, setUser] = useState<any>(null)
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [currentTheme, setCurrentTheme] = useState(getTheme())
    const [bio, setBio] = useState('')

    const avatarRef = useRef<any>(null)
    const { enqueueSnackbar } = useSnackbar()

    const themes = [
        { value: 'default', label: 'Browser Default' },
        { value: 'light', label: 'Light Theme' },
        { value: 'dark', label: 'Dark Theme' },
    ]

    useEffect(() => fetchUser(), [])

    const fetchUser = () => {
        axiosInstance
            .get('/api/users/' + getCID() + '/')
            .then(res => {
                setUser(res.data)
            })
    }

    const updateAvatar = (img) => {
        axiosInstance
            .put('/api/users/' + getCID() + '/', {avatar: img })
            .then(res => {
                setShowAvatarModal(false)
                fetchUser()
                enqueueSnackbar('Successfully updated avatar', {
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

    const handleUpdateBiography = (e) => {
        e.preventDefault()
        axiosInstance
            .put('/api/users/' + getCID() + '/', { biography: bio })
            .then(res => {
                setShowAvatarModal(false)
                fetchUser()
                enqueueSnackbar('Successfully updated biography', {
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

    return (
        <>
            <Fade bottom duration={1250} distance="50px">
                <>
                    {isMember() &&
                        <div className="mb-5">
                            <h3 className="text-black mb-4">Profile</h3>
                            <div className="d-flex flex-column flex-md-row">
                                <div className="d-flex flex-column align-items-center mr-0 mr-md-4">
                                    <img
                                        onClick={() => setShowAvatarModal(true)}
                                        className="profile-xl mb-3 select-avatar"
                                        src={process.env.REACT_APP_API_URL + user?.profile + (!user?.profile.includes('default') ? '?' + new Date().getMonth() : '')}
                                        alt={user?.cid}
                                    />
                                    <div className="mb-4 mb-md-0">
                                        <Button variant="bg-red" className="btn-sm" onClick={() => updateAvatar('')}>Reset Avatar</Button>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="font-w700 text-center text-md-left">{user?.first_name} {user?.last_name}</h3>
                                    <Form onSubmit={handleUpdateBiography}>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="biography"
                                            className="mb-2"
                                            defaultValue={user?.biography}
                                            value={bio}
                                            placeholder="No biography set."
                                            onChange={e => setBio(e.target.value)}
                                        />
                                        <Button variant="bg-primary" className="btn-sm" type="submit">Save Bio</Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    }
                </>
                <div className="mb-5">
                    <h3 className="text-black mb-0">Emails</h3>
                    <p className="text-gray mb-3"><em>Not yet implemented</em></p>
                    <div style={{ pointerEvents: 'none', opacity: '50%' }}>
                        <Form.Switch className="mb-2" id="email-2" name="email-2" label="Receive event notifications." checked={true}/>
                        <Form.Switch className="mb-2" id="email-3" name="email-3" label="Receive broadcast emails." checked={true}/>
                    </div>
                </div>
                <div>
                    <h3 className="text-black mb-0">Theme</h3>
                    <p className="text-gray mb-3"><em>Saved locally, not synced across devices</em></p>
                    <Select
                        value={{ value: currentTheme, label: themes.find(theme => theme.value === currentTheme)?.label }}
                        onChange={option => { setTheme(option.value); setCurrentTheme(option.value); }}
                        options={themes}
                    />
                </div>
            </Fade>
            <Modal
                show={showAvatarModal}
                onHide={() => setShowAvatarModal(false)}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Upload New Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProfilePicture
                        ref={avatarRef}
                        cropSize={300}
                        frameFormat="circle"
                        useHelper={true}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="lightgray" onClick={() => setShowAvatarModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => updateAvatar(avatarRef.current?.getImageAsDataUrl(1).split(',')[1])}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
