import React from 'react';
import { type NextPage } from 'next';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { fetchApi } from '@/utils/fetch';
import { type Metar } from '@/types/tmu';
import { MapboxMap } from './MapboxMap';

export const metadata = { title: 'Airspace Map' };

async function getMetars(): Promise<Metar[]> {
    return fetchApi(
        '/tmu/metar/',
        { next: { revalidate: 300 } },
    );
}

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
