import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type PositionPreset } from '@/types/events';
import { NewPresetButton } from './NewPresetModal';
import { PresetCard } from './PresetCard';

export const metadata = { title: 'Position Presets' };

async function getPositionPresets(): Promise<PositionPreset[]> {
    return fetchApi(
        '/events/presets/',
        { cache: 'no-store' },
    );
}

const PositionPresets: NextPage = async () => {
    const presets = await getPositionPresets();

    return (
        <Page {...metadata}>
            <PageContent>
                <NewPresetButton />
                <div className="grid grid-cols-2 gap-5">
                    {presets.map((preset) => (
                        <PresetCard key={preset.id} preset={preset} />
                    ))}
                </div>
            </PageContent>
        </Page>
    );
};

export default PositionPresets;
