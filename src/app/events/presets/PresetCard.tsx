'use client';

import React, { useCallback, useTransition } from 'react';
import { toast } from 'react-toastify';
import { DeletePresetButton } from '@/app/events/presets/DeletePresetModal';
import { PresetPositions } from '@/app/events/presets/PresetPositions';
import { AddPositionsButton } from '@/app/events/AddPositionsModal';
import { Card } from '@/components/Card';
import { type PositionPreset, type PresetPosition } from '@/types/events';
import { updatePresetPositions } from '@/lib/events/actions';
import { type AddPositionsFormValues } from '@/lib/events/schema';

interface SortedPositions {
    enroute: PresetPosition[];
    tracon: PresetPosition[];
    local: PresetPosition[];
}

interface PresetCardProps {
    preset: PositionPreset;
}

export const PresetCard: React.FC<PresetCardProps> = ({ preset }) => {
    const [, startTransition] = useTransition();

    const positions = preset.positions.reduce<SortedPositions>((acc, curr) => {
        if (curr.callsign.endsWith('CTR') || curr.callsign.endsWith('FSS') || curr.callsign.endsWith('TMU')) {
            acc.enroute.push(curr);
        }

        if (curr.callsign.endsWith('APP') || curr.callsign.endsWith('DEP')) {
            acc.tracon.push(curr);
        }

        if (curr.callsign.endsWith('DEL') || curr.callsign.endsWith('RMP') || curr.callsign.endsWith('GND') || curr.callsign.endsWith('TWR')) {
            acc.local.push(curr);
        }

        return acc;
    }, { enroute: [], tracon: [], local: [] });

    const addPositions = useCallback(
        async (values: AddPositionsFormValues) => {
            await toast.promise(
                updatePresetPositions(preset.id, preset.positions.concat(values.positions)),
                { error: 'Something went wrong, check console for more info' },
            );
        },
        [preset],
    );

    const deletePosition = useCallback(
        (position: PresetPosition) => {
            startTransition(async () => {
                await toast.promise(
                    updatePresetPositions(
                        preset.id,
                        preset.positions.filter((p) => p.callsign !== position.callsign),
                    ),
                    {
                        pending: 'Removing position',
                        success: 'Successfully removed',
                        error: 'Something went wrong, check console for more info',
                    },
                );
            });
        },
        [preset, startTransition],
    );

    return (
        <Card>
            <div className="flex items-start gap-3">
                <div className="mr-auto">
                    <h4 className="text-2xl font-bold">{preset.name}</h4>
                    <h5 className="mb-5 text-lg font-medium text-slate-400">
                        {preset.positions.length} Position{preset.positions.length === 1 ? '' : 's'}
                    </h5>
                </div>
                <AddPositionsButton addPositions={addPositions} />
                <DeletePresetButton preset={preset} />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div>
                    <h5 className="mb-2 text-xl font-medium">Enroute</h5>
                    <PresetPositions
                        positions={positions.enroute}
                        deletePosition={deletePosition}
                    />
                </div>
                <div>
                    <h5 className="mb-2 text-xl font-medium">TRACON</h5>
                    <PresetPositions
                        positions={positions.tracon}
                        deletePosition={deletePosition}
                    />
                </div>
                <div>
                    <h5 className="mb-2 text-xl font-medium">Local</h5>
                    <PresetPositions
                        positions={positions.local}
                        deletePosition={deletePosition}
                    />
                </div>
            </div>
        </Card>
    );
};
