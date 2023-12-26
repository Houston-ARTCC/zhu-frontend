import React from 'react';
import { LuPlus } from 'react-icons/lu';
import { DeletePresetButton } from '@/app/events/presets/DeletePresetModal';
import { PresetPositions } from '@/app/events/presets/PresetPositions';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { type PositionPreset, type PresetPosition } from '@/types/events';

type SortedPositions = {
    enroute: PresetPosition[];
    tracon: PresetPosition[];
    local: PresetPosition[];
};

interface PresetCardProps {
    preset: PositionPreset;
}

export const PresetCard: React.FC<PresetCardProps> = ({ preset }) => {
    const positions = preset.positions.reduce<SortedPositions>((acc, curr) => {
        if (curr.callsign.endsWith('CTR') || curr.callsign.endsWith('FSS') || curr.callsign.endsWith('TMU')) {
            acc.enroute.push(curr);
        }

        if (curr.callsign.endsWith('APP') || curr.callsign.endsWith('DEP')) {
            acc.tracon.push(curr);
        }

        if (curr.callsign.endsWith('DEL') || curr.callsign.endsWith('GND') || curr.callsign.endsWith('TWR')) {
            acc.local.push(curr);
        }

        return acc;
    }, { enroute: [], tracon: [], local: [] });

    return (
        <Card>
            <div className="flex items-start gap-3">
                <div>
                    <h4 className="text-2xl font-bold">{preset.name}</h4>
                    <h5 className="mb-5 text-lg font-medium text-slate-400">
                        {preset.positions.length} Position{preset.positions.length === 1 ? '' : 's'}
                    </h5>
                </div>
                <Button className="ml-auto text-sm" variant="tertiary">
                    <LuPlus />
                    Add Positions
                </Button>
                <DeletePresetButton preset={preset} />
            </div>

            <div className="grid grid-cols-3">
                <div>
                    <h5 className="mb-2 text-xl font-medium">Enroute</h5>
                    <PresetPositions presetId={preset.id} positions={positions.enroute} />
                </div>
                <div>
                    <h5 className="mb-2 text-xl font-medium">TRACON</h5>
                    <PresetPositions presetId={preset.id} positions={positions.tracon} />
                </div>
                <div>
                    <h5 className="mb-2 text-xl font-medium">Local</h5>
                    <PresetPositions presetId={preset.id} positions={positions.local} />
                </div>
            </div>
        </Card>
    );
};
