'use client';

import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { TuiCalendar } from '@/components/Calendar';

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
