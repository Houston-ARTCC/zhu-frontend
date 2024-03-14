'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { type TuiCalendarProps } from '@/components/Calendar';

// This is so stupid... All because TUI calendar is written in a non-SSR friendly way
const TuiCalendar = dynamic<TuiCalendarProps>(import('@/components/Calendar') as any, { ssr: false });

const Calendar: NextPage = () => (
    <Page title="Calendar">
        <PageContent>
            <TuiCalendar
                height="1000px"
                view="month"
                isReadOnly
            />
        </PageContent>
    </Page>
);

export default Calendar;
