import { useState } from 'react'
import {
    BsArrowDown,
    RiArrowRightCircleFill,
    RiCalendarLine,
    RiCheckboxCircleFill,
    RiCloseCircleFill,
    RiIndeterminateCircleFill,
    RiPlaneLine,
    RiSignalTowerLine,
    RiTimeLine,
} from 'react-icons/all'
import { levelDisplay, sessionStatusDisplay, typeDisplay } from '../helpers/utils'
import { dataTableStyle } from '../helpers/constants'
import DataTable from 'react-data-table-component'
import { Alert, Badge, Col, Row } from 'react-bootstrap'
import Spinner from './Spinner'
import parse from 'html-react-parser'
import { format } from 'date-fns-tz'

export default function SessionTable({ data, loading }) {
    const [expanded, setExpanded] = useState<any>({})

    return (
        <DataTable
            data={data}
            noHeader
            highlightOnHover
            defaultSortField="date"
            defaultSortAsc={false}
            sortIcon={<BsArrowDown/>}
            progressPending={loading}
            progressComponent={<Spinner/>}
            expandableRows
            expandableRowsComponent={<ExpandableSession/>}
            expandableRowDisabled={row => row.status !== 1}
            expandableRowExpanded={row => row.id === expanded.id}
            onRowExpandToggled={(state, row) => state && setExpanded(row)}
            expandOnRowClicked
            pagination={true}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 15, 20, 25]}
            onChangePage={() => setExpanded({})}
            onSort={() => setExpanded({})}
            customStyles={dataTableStyle}
            columns={[
                {
                    name: 'Date',
                    selector: 'date',
                    sortable: true,
                    format: row => format(new Date(row.start), 'MMM d, Y @ kk:mm zzz'),
                    sortFunction: (a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1,
                    minWidth: '20%',
                },
                {
                    name: 'Instructor',
                    selector: 'instructor',
                    sortable: true,
                    format: row => row.instructor.first_name + ' ' + row.instructor.last_name,
                    sortFunction: (a, b) => a.first_name > b.first_name ? 1 : -1,
                    minWidth: '16%',
                },
                {
                    name: 'Student',
                    selector: 'student',
                    sortable: true,
                    format: row => row.student.first_name + ' ' + row.student.last_name,
                    sortFunction: (a, b) => a.first_name > b.first_name ? 1 : -1,
                    minWidth: '16%',
                },
                {
                    name: 'Level',
                    selector: 'level',
                    sortable: true,
                    format: row => levelDisplay(row.level),
                    minWidth: '13%',
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
                    format: row => <Status status={row.status}/>,
                },
                {
                    name: 'OTS',
                    selector: 'ots',
                    sortable: true,
                    format: row => <OTSStatusIcon status={row.ots_status}/>,
                },
            ]}
        />
    )
}


const Status = ({ status }) => {
    let color
    switch (status) {
        case 0:
            color = 'primary'
            break
        case 1:
            color = 'green'
            break
        case 2:
            color = 'red'
            break
        case 3:
            color = 'yellow'
            break
        default:
            color = 'lightgray'
            break
    }
    return <Badge variant={color + ' rounded'}>{sessionStatusDisplay(status)}</Badge>
}

const OTSStatusIcon = ({ status }) => {
    switch (status) {
        case 1: return <RiCheckboxCircleFill size={25} className="fill-green mr-2"/>
        case 2: return <RiCloseCircleFill size={25} className="fill-red mr-2"/>
        case 3: return <RiArrowRightCircleFill size={25} className="fill-primary mr-2"/>
        default: return <RiIndeterminateCircleFill size={25} className="fill-lightgray"/>
    }
}

const OTSStatus = ({ status }) => {
    if (status === 0) return <></>;
    let text;
    let color;
    switch (status) {
        case 1:
            text = 'Passed OTS Examination';
            color = 'green';
            break
        case 2:
            text = 'Failed OTS Examination';
            color = 'red';
            break
        case 3:
            text = 'Recommended for OTS Examination';
            color = 'primary';
            break
    }
    return <Alert variant={color} className="font-w500"><OTSStatusIcon status={status}/> {text}</Alert>
}

const ExpandableSession = (row) => {
    return (
        <div className="px-5 py-3" style={{ backgroundColor: 'transparent' }}>
            <OTSStatus status={row.data.ots_status}/>
            {row.data.solo_granted &&
                <Alert variant="green" className="font-w500"><RiCheckboxCircleFill size={25} className="fill-green mr-2"/>Solo Certification Granted</Alert>
            }
            <Row>
                <Col md={4}>
                    <p>
                        <RiCalendarLine size={25} className="mr-2"/>
                        <span className="font-w500">{format(new Date(row.data.start), 'MMM d, Y')}</span>
                    </p>
                    <p>
                        <RiTimeLine size={25} className="mr-2"/>
                        <span className="font-w500">{format(new Date(row.data.start), 'kk:mm zzz')} →&nbsp;</span>
                        <span className="font-w500">{format(new Date(row.data.end), 'kk:mm zzz')}</span>
                    </p>
                </Col>
                <Col md={4}>
                    <p className="font-w500"><RiSignalTowerLine size={25} className="mr-2"/>{row.data.position}</p>
                    <p className="font-w500"><RiPlaneLine size={25} className="mr-2"/>{row.data.movements} Movements</p>
                </Col>
            </Row>
            {row.data.notes ? parse(row.data.notes) : 'No notes provided.'}
        </div>
    )
}
