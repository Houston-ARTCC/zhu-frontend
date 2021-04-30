import { BsArrowDown, IoStar, IoStarOutline } from 'react-icons/all'
import { dataTableStyle } from '../helpers/constants'
import EventScoreBadge from './EventScoreBadge'
import moment from 'moment'
import { formatSeconds } from '../helpers/utils'
import { Badge } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { useEffect, useState } from 'react'
import axiosInstance from '../helpers/axiosInstance'
import Spinner from './Spinner'

export default function EventScoreTable({ cid }) {
    const [loading, setLoading] = useState(false)
    const [scores, setScores] = useState([])

    useEffect(() => {
        if (cid !== undefined) {
            setLoading(true)
            axiosInstance
                .get('/api/users/' + cid + '/scores/')
                .then(res => {
                    setScores(res.data)
                    setLoading(false)
                })
        }
    }, [cid])

    return (
        <DataTable
            data={scores['scores']?.filter(score => score.event != null)}
            noHeader={!cid}
            defaultSortField="date"
            defaultSortAsc={false}
            progressPending={loading}
            progressComponent={<Spinner/>}
            sortIcon={<BsArrowDown/>}
            customStyles={dataTableStyle}
            title={
                <>
                    <h3 className="mb-3">Overall Score: <EventScoreBadge score={scores['event_score']} large={true}/></h3>
                    <h6 className="mb-0">Note:</h6>
                    <p>A score of 100% is averaged into all home controllers' overall scores.<br/>Likewise, a score of 85% is averaged into all visiting and MAVP controllers' scores.</p>
                </>
            }
            columns={[
                {
                    name: 'Score',
                    selector: 'score',
                    sortable: true,
                    format: row => <EventScoreBadge score={row.score}/>,
                    maxWidth: '8%',
                },
                {
                    name: 'Event',
                    selector: 'event',
                    sortable: true,
                    format: row => row.event.name,
                },
                {
                    name: 'Date',
                    selector: 'date',
                    sortable: true,
                    sortFunction: (a, b) => {return moment(a.event?.start) > moment(b.event?.start) ? 1 : -1},
                    format: row => moment(row.event?.start).format('MMMM d, Y'),
                },
                {
                    name: 'Details',
                    selector: 'details',
                    format: row => (
                        <ul className="list-unstyled my-2">
                            <li className={row.feedback.length > 0 ? 'mb-2' : ''}>Controlled for <b>{formatSeconds(row.actual_duration)}</b> out of <b>{formatSeconds(row.target_duration)}</b></li>
                            {row.feedback.map(feedback => (
                                <>
                                    <li>
                                        {[...Array(5)].map((x, i) => {
                                            return (
                                                i >= feedback.rating
                                                    ? <IoStarOutline key={i} size={20} className="mr-1"/>
                                                    : <IoStar key={i} size={20} className="mr-1"/>
                                            )
                                        })}
                                        <Badge variant={(feedback.rating < 3 ? 'red' : feedback.rating > 3 ? 'green' : 'yellow') + ' rounded'}>Adjustment: {(feedback.rating - 3) * 5}%</Badge>
                                    </li>
                                </>
                            ))}
                        </ul>
                    ),
                },
            ]}
        />
    )
}