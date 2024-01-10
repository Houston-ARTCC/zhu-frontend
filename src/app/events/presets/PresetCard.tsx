'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { DeletePresetButton } from '@/app/events/presets/DeletePresetModal';
import { PresetPositions } from '@/app/events/presets/PresetPositions';
import { AddPositionsButton } from '@/app/events/AddPositionsModal';
import { type AddPositionsFormValues } from '@/app/events/addPositionsSchema';
import { Card } from '@/components/Card';
import { fetchApi } from '@/utils/fetch';
import { type PositionPreset, type PresetPosition } from '@/types/events';
import { type SchemaError } from '@/types';

type SortedPositions = {
    enroute: PresetPosition[];
    tracon: PresetPosition[];
    local: PresetPosition[];
};

interface PresetCardProps {
    preset: PositionPreset;
}

export const PresetCard: React.FC<PresetCardProps> = ({ preset }) => {
    const router = useRouter();

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

    const addPositions = useCallback(
        async (values: AddPositionsFormValues) => toast.promise(
            fetchApi<SchemaError[]>(`/events/presets/${preset.id}/`, {
                method: 'PUT',
                body: JSON.stringify({
                    positions: preset.positions.concat(values.positions),
                }),
            })
                .then(() => undefined)
                .catch(async (resp) => {
                    if (resp.headers.get('Content-Type') === 'application/json') {
                        const data = await resp.json();
                        return Promise.resolve(data);
                    }
                    return Promise.reject(resp);
                }),
            { error: 'Something went wrong, check console for more info' },
        ),
        [preset],
    );

    const deletePosition = useCallback(
        (position: PresetPosition) => {
            toast.promise(
                fetchApi(`/events/presets/${preset.id}/`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        positions: preset.positions.filter((p) => p.callsign !== position.callsign),
                    }),
                }),
                {
                    pending: 'Removing position',
                    success: 'Successfully removed',
                    error: 'Something went wrong, check console for more info',
                },
            ).then(() => router.refresh());
        },
        [preset],
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

            <div className="grid grid-cols-3">
                <div>
                    <h5 className="mb-2 text-xl font-medium">Enroute</h5>
                    <PresetPositions
                        presetId={preset.id}
                        positions={positions.enroute}
                        deletePosition={deletePosition}
                    />
                </div>
                <div>
                    <h5 className="mb-2 text-xl font-medium">TRACON</h5>
                    <PresetPositions
                        presetId={preset.id}
                        positions={positions.tracon}
                        deletePosition={deletePosition}
                    />
                </div>
                <div>
                    <h5 className="mb-2 text-xl font-medium">Local</h5>
                    <PresetPositions
                        presetId={preset.id}
                        positions={positions.local}
                        deletePosition={deletePosition}
                    />
                </div>
            </div>
        </Card>
    );
};
