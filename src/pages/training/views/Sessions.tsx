import { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'
import { getCID } from '../../../helpers/auth'
import SessionTable from '../../../components/SessionTable'

export default function Sessions() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => fetchSessions(), [])

    const fetchSessions = () => {
        axiosInstance
            .get('/api/training/sessions/' + getCID() + '/')
            .then(res => {
                setSessions(res.data)
                setLoading(false)
            })
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <SessionTable data={sessions} loading={loading}/>
        </Fade>
    )
}
