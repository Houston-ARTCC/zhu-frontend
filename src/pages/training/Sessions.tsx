import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
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
import moment from 'moment'
import { levelDisplay, statusDisplay, typeDisplay } from '../../helpers/utils'
import { Alert, Badge, Col, Row } from 'react-bootstrap'
import axiosInstance from '../../helpers/axiosInstance'
import parse from 'html-react-parser'
import Moment from 'react-moment'


export default class Sessions extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            expanded: {},
        }
    }

    componentDidMount() {
        this.fetchSessions()
    }

    fetchSessions() {
        axiosInstance
            .get('/api/training')
            .then(res => this.setState({ sessions: res.data }))
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
        return <Badge variant={color + ' rounded'}>{statusDisplay(status)}</Badge>
    }

    renderOTSStatusIcon(status) {
        switch (status) {
            case 1: return <RiCheckboxCircleFill size={25} className="fill-green mr-2"/>
            case 2: return <RiCloseCircleFill size={25} className="fill-red mr-2"/>
            case 3: return <RiArrowRightCircleFill size={25} className="fill-primary mr-2"/>
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
        const ExpandableComponent = (row) => {
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
            <section id="sessions">
                <DataTable
                    data={this.state.sessions}
                    noHeader
                    highlightOnHover
                    pointerOnHover
                    defaultSortField="name"
                    sortIcon={<BsArrowDown/>}
                    expandableRows
                    expandableRowsComponent={<ExpandableComponent/>}
                    expandableRowDisabled={row => row.status !== 1}
                    expandableRowExpanded={row => row.id === this.state.expanded.id}
                    onRowExpandToggled={(state, row) => state && this.setState({ expanded: row })}
                    expandOnRowClicked
                    pagination={true}
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    onChangePage={() => this.setState({ expanded: {} })}
                    onSort={() => this.setState({ expanded: {} })}
                    columns={[
                        {
                            name: 'Date',
                            selector: 'date',
                            sortable: true,
                            format: row => moment(row.start).tz(moment.tz.guess()).format('MMM. DD, YYYY @ HH:mm z'),
                            sortFunction: (a, b) => {
                                return moment(a.start) > moment(b.start) ? 1 : -1
                            },
                            minWidth: '25%',
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
                            name: 'Instructor',
                            selector: 'instructor',
                            sortable: true,
                            format: row => row.instructor.first_name + ' ' + row.instructor.last_name,
                            sortFunction: (a, b) => {
                                return a.first_name > b.first_name ? 1 : -1
                            },
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
                            format: row => this.renderOTSStatusIcon(row.ots_status) ||
                                <RiIndeterminateCircleFill size={25} className="fill-lightgray"/>,
                            maxWidth: '5%',
                        },
                    ]}
                    customStyles={{
                        table: {
                            style: {
                                backgroundColor: 'transparent',
                            },
                        },
                        rows: {
                            style: {
                                backgroundColor: 'transparent',
                            },
                        },
                        headRow: {
                            style: {
                                backgroundColor: 'transparent',
                            },
                        },
                    }}
                />
            </section>
        )
    }
}
