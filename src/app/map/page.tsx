import React from 'react';
import { type NextPage } from 'next';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { getMetars } from '@/lib/weather/metars';
import { MapboxMap } from './MapboxMap';

export const metadata = { title: 'Airspace Map' };
export const revalidate = 300;

const AirspaceMap: NextPage = async () => {
    const metars = await getMetars();

    return (
        <Page {...metadata}>
            <PageContent>
                <MapboxMap metars={metars} />
            </PageContent>
        </Page>
    );
};

export default AirspaceMap;
