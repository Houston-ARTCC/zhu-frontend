import { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../../helpers/axiosInstance'
import SessionTable from '../../../components/SessionTable'

export default function MentorHistory() {
    const [mentorOptions, setMentorOptions] = useState<any>([])
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => fetchMentors(), [])

    const fetchMentors = () => {
        axiosInstance
            .get('/api/users/staff/')
            .then(res => {
                setMentorOptions([
                    {
                        label: 'Instructors',
                        options: res.data.ins.map(instructor => ({
                            value: instructor.cid,
                            label: instructor.first_name + ' ' + instructor.last_name
                        })),
                    },
                    {
                        label: 'Mentors',
                        options: res.data.mtr.map(mentor => ({
                            value: mentor.cid,
                            label: mentor.first_name + ' ' + mentor.last_name
                        })),
                    }
                ])
            })
    }

    const handleMentorChange = (selected) => {
        setLoading(true)
        axiosInstance
            .get('/api/training/mentor/' + selected.value + '/')
            .then(res => {
                setSessions(res.data)
                setLoading(false)
            })
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="position-relative">
                <Select
                    options={mentorOptions}
                    onChange={handleMentorChange}
                    placeholder="Select mentor..."
                    className="mb-4"
                />
                <SessionTable data={sessions} loading={loading}/>
            </div>
        </Fade>
    )
}
