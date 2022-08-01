import Fade from 'react-reveal/Fade'
import { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../../helpers/axiosInstance'
import { BsArrowDown } from 'react-icons/all'
import BounceLoader from '../../../components/BounceLoader'
import { dataTableStyle } from '../../../helpers/constants'
import DataTable from 'react-data-table-component'
import { format } from 'date-fns-tz'
import { Badge, Table } from 'react-bootstrap'

export default function AuditLog() {
    const [results, setResults] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [pageSize, setPageSize] = useState(15)

    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<any>({})

    const controller = useMemo(() => new AbortController(), []);

    useEffect(() => fetchEntries(1), []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchEntries = (page: number, newPageSize?: number) => {
        if (newPageSize) setPageSize(newPageSize)
        controller.abort()
        axiosInstance
            .get(`/api/administration/audit/?page=${page}&page_size=${newPageSize ?? pageSize}`)
            .then(res => {
                setResults(res.data.results)
                setTotalRows(res.data.count)
                setLoading(false)
            })
    }

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
                            <th/>
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
            {/*<div className="d-flex">*/}
            {/*    <div className="mb-2">*/}
            {/*        <Form.Control placeholder="Search..." value={filter} onChange={e => setFilter(e.target.value)}/>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <DataTable
                data={results}
                noHeader
                highlightOnHover
                defaultSortField="timestamp"
                defaultSortAsc={false}
                sortIcon={<BsArrowDown/>}
                progressPending={loading}
                progressComponent={<BounceLoader/>}
                expandableRows
                expandableRowDisabled={(row: any) => row.action === 2}
                expandableRowsComponent={<ExpandableEntry/>}
                expandableRowExpanded={(row: any) => row.id === expanded.id}
                onRowExpandToggled={(state, row) => state && setExpanded(row)}
                expandOnRowClicked
                pagination
                paginationServer
                paginationPerPage={15}
                paginationRowsPerPageOptions={[15, 25, 50, 100]}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={(pageSize, page) => {
                    fetchEntries(page, pageSize)
                }}
                onChangePage={(page: number) => {
                    fetchEntries(page)
                    setExpanded({})
                }}
                onSort={() => setExpanded({})}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Action',
                        selector: 'action',
                        format: row => <>{row.content_type} <b>{row.object_id} - {row.object_repr}</b> was <ActionBadge action={row.action}/> by {row.actor ? row.actor.first_name + ' ' + row.actor.last_name : 'system'}</>
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
