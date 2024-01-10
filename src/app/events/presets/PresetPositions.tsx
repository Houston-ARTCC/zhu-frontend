import React from 'react';
import { LuX } from 'react-icons/lu';
import { type PresetPosition } from '@/types/events';

interface PresetPositionsProps {
    positions: PresetPosition[];
    deletePosition: (position: PresetPosition) => void;
}

export const PresetPositions: React.FC<PresetPositionsProps> = ({ positions, deletePosition }) => (
    <div className="flex flex-col gap-2">
        {positions.map((position) => (
            <div key={position.callsign} className="flex items-center gap-1">
                <LuX className="cursor-pointer text-red-400" onClick={() => deletePosition(position)} />
                {position.callsign} &mdash; {position.shifts}
            </div>
        ))}
    </div>
);
