import React from 'react';
import type { NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { requireStaff } from '@/lib/auth/guards';
import { getPositionPresets } from '@/lib/events/repository';
import { Scheduler } from './Scheduler';

const CreateEvent: NextPage = async () => {
    await requireStaff();

    const presets = await getPositionPresets();
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
