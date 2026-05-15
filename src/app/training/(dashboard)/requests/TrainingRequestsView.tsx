'use client';

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { LuCalendarDays, LuList } from 'react-icons/lu';
import { Calendar, type Event } from '@/components/Calendar';
import { calendarEventFromRequest } from '@/utils/calendar';
import { type UserTrainingRequests } from '@/types/training';
import { TrainingRequestsTable } from './TrainingRequestsTable';

interface TrainingRequestsViewProps {
    data: UserTrainingRequests[];
}

type ViewMode = 'list' | 'calendar';

interface TabButtonProps {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ active, icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={classNames(
            'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
            active
                ? 'border-sky-500 text-sky-500'
                : 'border-transparent text-slate-400 hover:text-slate-200',
        )}
    >
        {icon}
        {label}
    </button>
);

export const TrainingRequestsView: React.FC<TrainingRequestsViewProps> = ({ data }) => {
    const [view, setView] = useState<ViewMode>('list');

    const events = useMemo<Event[]>(
        () => data.flatMap(({ user, requests }) => requests.map((request) => ({
            ...calendarEventFromRequest(request),
            title: `${user.first_name} ${user.last_name}`,
        }))),
        [data],
    );

    return (
        <>
            <div className="mb-5 flex border-b border-slate-700">
                <TabButton active={view === 'list'} icon={<LuList size={18} />} label="List" onClick={() => setView('list')} />
                <TabButton active={view === 'calendar'} icon={<LuCalendarDays size={18} />} label="Calendar" onClick={() => setView('calendar')} />
            </div>

            {view === 'list' && <TrainingRequestsTable data={data} />}
            {view === 'calendar' && (
                <Calendar
                    className="min-h-[600px]"
                    view="week"
                    eventsOnly
                    events={events}
                />
            )}
        </>
    );
};
