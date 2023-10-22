import React from 'react';
import { LuCheck } from 'react-icons/lu';
import classNames from 'classnames';
import { durationToSeconds, formatDuration } from '@/utils/time';

interface ControllerHoursProps {
    required: string;
    completed: string;
}

export const ControllerHours: React.FC<ControllerHoursProps> = ({ required, completed }) => (
    <>
        <LuCheck
            size={25}
            className={classNames(
                'mr-3 stroke-emerald-400',
                { 'opacity-0': durationToSeconds(completed) < (durationToSeconds(required) || Infinity) },
            )}
        />
        {formatDuration(completed)}
    </>
);
