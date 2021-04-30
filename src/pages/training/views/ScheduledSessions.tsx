import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { BsArrowDown, RiMoreFill } from 'react-icons/all'
import moment from 'moment'
import { Badge, Dropdown } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'
import { dataTableStyle } from '../../../helpers/constants'
import { levelDisplay, typeDisplay } from '../../../helpers/utils'

export default function ScheduledSessions() {
    const [sessions, setSessions] = useState([])

    useEffect(() => fetchSessions(), [])

    const fetchSessions = () => {
        axiosInstance
            .get('/api/training/')
            .then(res => setSessions(res.data))
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <DataTable
                data={sessions}
                noHeader
                highlightOnHover
                defaultSortField="date"
                sortIcon={<BsArrowDown/>}
                columns={[
                    {
                        name: '',
                        button: true,
                        center: true,
                        allowOverflow: true,
                        cell: (row) => (
                            <Dropdown>
                                <Dropdown.Toggle variant="link" id="dropdown-basic">
                                    <RiMoreFill size={20}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => console.log(row)}>File</Dropdown.Item>
                                    <Dropdown.Item onClick={() => console.log(row)}>Cancel</Dropdown.Item>
                                    <Dropdown.Item onClick={() => console.log(row)}>No-Show</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ),
                        width: '65px',
                    },
                    {
                        name: 'Date',
                        selector: 'date',
                        sortable: true,
                        format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                        sortFunction: (a: any, b: any) => {
                            return moment(a.start) > moment(b.start) ? 1 : -1
                        },
                        minWidth: '22%',
                    },
                    {
                        name: 'Student',
                        selector: 'student',
                        sortable: true,
                        format: row => row.student.first_name + ' ' + row.student.last_name,
                        sortFunction: (a, b) => {
                            return a.first_name > b.first_name ? 1 : -1
                        },
                    },
                    {
                        name: 'Instructor',
                        selector: 'instructor',
                        sortable: true,
                        format: row => row.instructor.first_name + ' ' + row.instructor.last_name,
                        sortFunction: (a, b) => {
                            return a.first_name > b.first_name ? 1 : -1
                        },
                    },
                    {
                        name: 'Level',
                        selector: 'level',
                        sortable: true,
                        format: row => levelDisplay(row.level),
                    },
                    {
                        name: 'Type',
                        selector: 'type',
                        sortable: true,
                        format: row => typeDisplay(row.type),
                    },
                    {
                        name: 'Status',
                        selector: 'status',
                        sortable: true,
                        format: row => <Badge variant="primary rounded">Scheduled</Badge>,
                    },
                ]}
                customStyles={dataTableStyle}
            />
        </Fade>
    )
}
