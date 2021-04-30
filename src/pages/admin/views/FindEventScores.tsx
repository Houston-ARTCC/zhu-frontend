import { useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import Select from 'react-select'
import axiosInstance from '../../../helpers/axiosInstance'
import EventScoreTable from '../../../components/EventScoreTable'

export default function FindEventScores() {
    const [userOptions, setUserOptions] = useState<any>([])
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => fetchUsers(), [])

    const fetchUsers = () => {
        axiosInstance
            .get('/api/users/simplified/')
            .then(res => {
                setUserOptions([
                    {
                        label: 'Home Controllers',
                        options: res.data.home?.map(controller => ({
                            value: controller.cid,
                            label: controller.first_name + ' ' + controller.last_name,
                            score: controller.event_score,
                        })),
                    },
                    {
                        label: 'Visiting Controllers',
                        options: res.data.home?.map(controller => ({
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

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="position-relative">
                <Select
                    options={userOptions}
                    onChange={selected => setCurrentUser(selected.value)}
                    placeholder="Select user..."
                    className="mb-4"
                />
                <EventScoreTable cid={currentUser}/>
            </div>
        </Fade>
    )
}
