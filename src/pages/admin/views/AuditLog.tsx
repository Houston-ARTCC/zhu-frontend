import Fade from 'react-reveal/Fade'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../helpers/axiosInstance'
import { BsArrowDown } from 'react-icons/all'
import Spinner from '../../../components/Spinner'
import { dataTableStyle } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import { format } from 'date-fns-tz'
import { Badge, Form, Table } from 'react-bootstrap'

export default function AuditLog() {
    const [entries, setEntries] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<any>({})
    const [filter, setFilter] = useState('')

    useEffect(() => fetchEntries(), [])

    const fetchEntries = () => {
        axiosInstance
            .get('/api/administration/audit/')
            .then(res => {
                setEntries(res.data)
                setLoading(false)
            })
    }

    const actionText = (actionInt) => {
        switch (actionInt) {
            case 0: return 'created'
            case 1: return 'updated'
            case 2: return 'deleted'
        }
    }

    const entryFilter = (entry) => (
        actionText(entry.action)?.includes(filter.toLowerCase()) ||
        entry.content_type.model.toLowerCase().includes(filter.toLowerCase()) ||
        entry.object_repr.toLowerCase().includes(filter.toLowerCase()) ||
        entry.object_id.toString().includes(filter.toLowerCase()) ||
        entry.actor?.cid.toString().includes(filter.toLowerCase()) ||
        (entry.actor === null && 'system'.includes(filter.toLowerCase())) ||
        (entry.actor?.first_name + ' ' + entry.actor?.last_name).toLowerCase().includes(filter.toLowerCase())
    )

    const ActionBadge = ({ action }) => {
        let text, color
        switch (action) {
            case 0:
                text = 'created'
                color = 'green'
                break
            case 1:
                text = 'updated'
                color = 'yellow'
                break
            case 2:
                text = 'deleted'
                color = 'red'
                break
        }
        return <Badge variant={'outline-' + color + ' rounded'}>{text}</Badge>
    }

    const ExpandableEntry = (row) => {
        return (
            <div className="px-5 py-3" style={{ backgroundColor: 'transparent' }}>
                <Table striped>
                    <colgroup>
                        <col width="15%"/>
                        <col width="42%"/>
                        <col width="42%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-right"><b>Field</b></th>
                            {(row.data.action === 1 && <th><b>Previous Value</b></th>)}
                            <th><b>Current Value</b></th>
                            {(row.data.action !== 1 && <th/>)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(row.data.changes).map(([key, value]: any) => (
                            <tr>
                                <td className="text-right"><b>{key}</b></td>
                                {(row.data.action === 1 && <td><code>{value[0]}</code></td>)}
                                <td colSpan={row.data.action !== 1 ? 2 : 1}><code>{value[1]}</code></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }

    return (
        <Fade bottom duration={1250} distance="50px">
            <div className="d-flex">
                <div className="mb-2">
                    <Form.Control placeholder="Search..." value={filter} onChange={e => setFilter(e.target.value)}/>
                </div>
            </div>
            <DataTable
                data={entries.filter(entryFilter)}
                noHeader
                highlightOnHover
                defaultSortField="timestamp"
                defaultSortAsc={false}
                sortIcon={<BsArrowDown/>}
                progressPending={loading}
                progressComponent={<Spinner/>}
                expandableRows
                expandableRowDisabled={row => row.action === 2}
                expandableRowsComponent={<ExpandableEntry/>}
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
                        name: 'Action',
                        selector: 'action',
                        format: row => <>{row.content_type.model.charAt(0).toUpperCase() + row.content_type.model.slice(1)} <b>{row.object_repr}</b> was <ActionBadge action={row.action}/> by {row.actor ? row.actor.first_name + ' ' + row.actor.last_name : 'system'}</>
                    },
                    {
                        name: 'Timestamp',
                        selector: 'timestamp',
                        sortable: true,
                        format: row => format(new Date(row.timestamp), "PPP 'at' HH:mm:ss zzz"),
                        sortFunction: (a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1,
                        maxWidth: '30%',
                    }
                ]}
            />
        </Fade>
    )
}
