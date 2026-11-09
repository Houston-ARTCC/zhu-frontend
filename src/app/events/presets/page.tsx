import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { requireStaff } from '@/lib/auth/guards';
import { getPositionPresets } from '@/lib/events/repository';
import { NewPresetButton } from './NewPresetModal';
import { PresetCard } from './PresetCard';

export const metadata = { title: 'Position Presets' };

const PositionPresets: NextPage = async () => {
    await requireStaff();
    const presets = await getPositionPresets();

    return (
        <Page {...metadata}>
            <PageContent>
                <NewPresetButton />
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {presets.map((preset) => (
                        <PresetCard key={preset.id} preset={preset} />
                    ))}
                </div>
            </PageContent>
        </Page>
    );
};

export default PositionPresets;
