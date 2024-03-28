'use client';

import React from 'react';
import DataTable from 'react-data-table-component';
import { LuChevronDown } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { Badge } from '@/components/Badge';
import { RatingStars } from '@/components/RatingStars';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { formatSeconds } from '@/utils/time';
import { type EventScore } from '@/types/events';
import { scoreToBadgeColor } from '@/utils';

interface EventScoreTableProps {
    data: EventScore[];
}

export const EventScoreTable: React.FC<EventScoreTableProps> = ({ data }) => (
    <DataTable
        data={data}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 15, 20, 25]}
        defaultSortFieldId={2}
        defaultSortAsc={false}
        sortIcon={<LuChevronDown />}
        customStyles={dataTableStyle}
        columns={[
            {
                name: 'Score',
                selector: (row) => row.score,
                sortable: true,
                format: (row) => (
                    <Badge small color={scoreToBadgeColor(row.score)}>
                        {row.score}%
                    </Badge>
                ),
                maxWidth: '100px',
            },
            {
                name: 'Date',
                selector: (row) => row.event.start,
                sortable: true,
                sortFunction: (a, b) => a.event.start.localeCompare(b.event.start),
                format: (row) => format(new Date(row.event.start), 'MMM d, y'),
                maxWidth: '200px',
            },
            {
                name: 'Event',
                selector: (row) => row.event.name,
                sortable: true,
            },
            {
                name: 'Notes',
                selector: (row) => row.notes.total_duration,
                format: (row) => (
                    <div className="py-2">
                        <p>
                            Controlled for
                            <b> {formatSeconds(row.notes.total_duration)} </b>
                            out of
                            <b> {formatSeconds(row.notes.target_duration)}</b>
                        </p>
                        <ul>
                            {row.notes.feedback.map(({ rating }, i) => (
                                <li key={i} className="my-0.5">
                                    <div className="flex items-center gap-1.5">
                                        {rating > 2 ? '+' : '-'}{(rating - 3) * 5}% for
                                        <RatingStars className="!gap-1" rating={rating} size={15} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ),
                width: '40%',
            },
        ]}
    />
);
