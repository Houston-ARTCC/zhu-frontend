import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Badge } from '@/components/Badge';
import type { Role } from '@/types/users';

export interface EndorsementBadgeProps extends PropsWithChildren {
    tier: 0 | 1 | 2;
    name: string;
    status: boolean | string;
}

export const EndorsementBadge: React.FC<EndorsementBadgeProps> = ({ tier, name, status, children }) => (
    <Badge
        small
        className={classNames(
            'w-24 rounded-full transition-colors duration-150 relative h-6',
            {
                '!bg-gray-300 !shadow-gray-300/25': status === false,
                '!bg-emerald-400 !shadow-emerald-400/25': status === true && tier === 0,
                '!bg-emerald-600 !shadow-emerald-600/25': status === true && tier === 1,
                '!bg-emerald-700 !shadow-emerald-700/25': status === true && tier === 2,
                '!bg-cyan-400 !shadow-cyan-400/25': status !== false && status !== true,
            },
        )}
    >
        {status !== false && status !== true ? status : name}
        {children}
    </Badge>
);

interface RoleBadgeProps {
    role: Role;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
    let color;
    switch (role.short) {
        case 'INS':
        case 'MTR': color = '!bg-amber-400 !shadow-amber-400/25'; break;
        case 'WEB': color = '!bg-indigo-500 !shadow-indigo-500/25'; break;
        case 'HC':
        case 'VC':
        case 'MC': color = '!bg-darkblue !shadow-darkblue/25'; break;
        default: color = '!bg-red-400 !shadow-red-400/25';
    }

    return (
        <Badge className={color}>{role.long}</Badge>
    );
};
