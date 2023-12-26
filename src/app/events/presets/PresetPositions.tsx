'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LuX } from 'react-icons/lu';
import { type PresetPosition } from '@/types/events';

interface PresetPositionsProps {
    presetId: number;
    positions: PresetPosition[];
}

export const PresetPositions: React.FC<PresetPositionsProps> = ({ presetId, positions }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-2">
            {positions.map((position) => (
                <div key={position.callsign} className="flex items-center gap-1">
                    <LuX className="cursor-pointer text-red-400" />
                    {position.callsign} &mdash; {position.shifts}
                </div>
            ))}
        </div>
    );
};
