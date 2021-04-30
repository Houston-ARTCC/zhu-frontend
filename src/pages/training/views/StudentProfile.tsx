import { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../../helpers/axiosInstance'
import SessionTable from '../../../components/SessionTable'

export default function StudentProfile() {
    const [studentOptions, setStudentOptions] = useState<any>([])
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => fetchStudents(), [])

    const fetchStudents = () => {
        axiosInstance
            .get('/api/users/simplified/')
            .then(res => {
                setStudentOptions([
                    {
                        label: 'Home Controllers',
                        options: res.data.home?.map(controller => ({
                            value: controller.cid,
                            label: controller.first_name + ' ' + controller.last_name,
                            score: controller.event_score,
                        }))
                    },
                    {
                        label: 'Visiting Controllers',
                        options: res.data.visiting?.map(controller => ({
                            value: controller.cid,
                            label: controller.first_name + ' ' + controller.last_name,
                            score: controller.event_score,
                        })),
                    },
                    {
                        label: 'MAVP Controllers',
                        options: res.data.mavp?.map(controller => ({
                            value: controller.cid,
                            label: controller.first_name + ' ' + controller.last_name,
                            score: controller.event_score,
                        })),
                    },
                ])
            })
    }

    const handleStudentChange = (selected) => {
        setLoading(true)
        axiosInstance
            .get('/api/training/sessions/' + selected.value + '/')
            .then(res => {
                setSessions(res.data)
                setLoading(false)
            })
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="position-relative">
                <Select
                    options={studentOptions}
                    onChange={handleStudentChange}
                    placeholder="Select student..."
                    className="mb-4"
                />
                <SessionTable data={sessions} loading={loading}/>
            </div>
        </Fade>
    )
}
