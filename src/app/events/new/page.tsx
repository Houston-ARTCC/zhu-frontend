import React from 'react';
import type { NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type PositionPreset } from '@/types/events';
import { Scheduler } from './Scheduler';

async function getPresets(): Promise<PositionPreset[]> {
    return fetchApi(
        '/events/presets/',
        { cache: 'no-store' },
    );
}

const CreateEvent: NextPage = async () => {
    const presets = await getPresets();

    const presetOptions = presets.map((preset) => ({
        value: preset.id,
        label: preset.name,
    }));

    return (
        <Page title="Create Event">
            <PageContent>
                <Scheduler presets={presetOptions} />
            </PageContent>
        </Page>
    );
};

export default CreateEvent;
