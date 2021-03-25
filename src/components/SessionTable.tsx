import React, { Component } from 'react'
import {
    BsArrowDown,
    RiArrowRightCircleFill,
    RiCalendarLine,
    RiCheckboxCircleFill,
    RiCloseCircleFill,
    RiIndeterminateCircleFill, RiPlaneLine, RiSignalTowerLine, RiTimeLine,
} from 'react-icons/all'
import moment from 'moment'
import { levelDisplay, sessionStatusDisplay, typeDisplay } from '../helpers/utils'
import { dataTableStyle } from '../helpers/constants'
import DataTable from 'react-data-table-component'
import { Alert, Badge, Col, Row } from 'react-bootstrap'
import Spinner from './Spinner'
import Moment from 'react-moment'
import parse from 'html-react-parser'

export default class SessionTable extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            expanded: {},
        }
    }

    renderStatus(status) {
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

    renderOTSStatusIcon(status) {
        switch (status) {
            case 1: return <RiCheckboxCircleFill size={25} className="fill-green mr-2"/>
            case 2: return <RiCloseCircleFill size={25} className="fill-red mr-2"/>
            case 3: return <RiArrowRightCircleFill size={25} className="fill-primary mr-2"/>
            default: return <RiIndeterminateCircleFill size={25} className="fill-lightgray"/>
        }
    }

    renderOTSStatus(status) {
        if (status === 0) return undefined;
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
        return <Alert variant={color} className="font-w500">{this.renderOTSStatusIcon(status)}{text}</Alert>
    }

    render() {
        const ExpandableSession = (row) => {
            return (
                <div className="px-5 py-3" style={{ backgroundColor: '#F9F9F9' }}>
                    {this.renderOTSStatus(row.data.ots_status)}
                    {row.data.solo_granted &&
                    <Alert variant="green" className="font-w500"><RiCheckboxCircleFill size={25} className="fill-green mr-2"/>Solo Certification Granted</Alert>
                    }
                    <Row>
                        <Col md={4}>
                            <p><RiCalendarLine size={25} className="mr-2"/><Moment local className="font-w500" format="MMMM D, YYYY">{row.data.start}</Moment></p>
                            <p>
                                <RiTimeLine size={25} className="mr-2"/>
                                <Moment local tz={moment.tz.guess()} format="HH:mm z →&nbsp;" className="font-w500">{row.data.start}</Moment>
                                <Moment local tz={moment.tz.guess()} format="HH:mm z" className="font-w500">{row.data.end}</Moment>
                            </p>
                        </Col>
                        <Col md={4}>
                            <p className="font-w500"><RiSignalTowerLine size={25} className="mr-2"/>{row.data.position}</p>
                            <p className="font-w500"><RiPlaneLine size={25} className="mr-2"/>{row.data.movements} Movements</p>
                        </Col>
                    </Row>
                    {row.data.notes ? parse(row.data.notes) : 'No notes provided.'}
                    <hr/>
                </div>
            )
        }

        return (
            <DataTable
                data={this.props.data}
                noHeader
                highlightOnHover
                pointerOnHover
                defaultSortField="date"
                defaultSortAsc={false}
                sortIcon={<BsArrowDown/>}
                progressPending={this.props.loading}
                progressComponent={<Spinner/>}
                expandableRows
                expandableRowsComponent={<ExpandableSession/>}
                expandableRowDisabled={row => row.status !== 1}
                expandableRowExpanded={row => row.id === this.state.expanded.id}
                onRowExpandToggled={(state, row) => state && this.setState({ expanded: row })}
                expandOnRowClicked
                pagination={true}
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 15, 20, 25]}
                onChangePage={() => this.setState({ expanded: {} })}
                onSort={() => this.setState({ expanded: {} })}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Date',
                        selector: 'date',
                        sortable: true,
                        format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                        sortFunction: (a, b) => {
                            return moment(a.start) > moment(b.start) ? 1 : -1
                        },
                        minWidth: '20%',
                    },
                    {
                        name: 'Instructor',
                        selector: 'instructor',
                        sortable: true,
                        format: row => row.instructor.first_name + ' ' + row.instructor.last_name,
                        sortFunction: (a, b) => {
                            return a.first_name > b.first_name ? 1 : -1
                        },
                        minWidth: '16%',
                    },
                    {
                        name: 'Student',
                        selector: 'student',
                        sortable: true,
                        format: row => row.student.first_name + ' ' + row.student.last_name,
                        sortFunction: (a, b) => {
                            return a.first_name > b.first_name ? 1 : -1
                        },
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
                        format: row => this.renderStatus(row.status),
                    },
                    {
                        name: 'OTS',
                        selector: 'ots',
                        sortable: true,
                        format: row => this.renderOTSStatusIcon(row.ots_status),
                    },
                ]}
            />
        )
    }
}