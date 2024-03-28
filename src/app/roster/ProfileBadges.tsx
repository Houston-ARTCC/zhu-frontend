import React, { type PropsWithChildren } from 'react';
import { Badge, type BadgeColor } from '@/components/Badge';
import type { Role } from '@/types/users';

type EndorsementStatus = boolean | string;
type EndorsementTier = 0 | 1 | 2;

function statusTierToColor(status: EndorsementStatus, tier: EndorsementTier): BadgeColor {
    if (status !== false && status !== true) {
        return 'cyan-400';
    }

    if (status === true) {
        switch (tier) {
            case 0: return 'emerald-400';
            case 1: return 'emerald-600';
            case 2: return 'emerald-700';
        }
    }

    return 'gray-300';
}

export interface EndorsementBadgeProps extends PropsWithChildren {
    tier: EndorsementTier;
    name: string;
    status: EndorsementStatus;
}

export const EndorsementBadge: React.FC<EndorsementBadgeProps> = ({ tier, name, status, children }) => (
    <Badge
        small
        color={statusTierToColor(status, tier)}
        className="relative h-6 w-24 rounded-full transition-colors duration-150"
    >
        {status !== false && status !== true && status}{' '}{name}
        {children}
    </Badge>
);

function roleToColor(role: Role): BadgeColor {
    switch (role.short) {
        case 'HC':
        case 'VC':
        case 'MC': return 'sky-900';
        case 'INS':
        case 'MTR': return 'amber-400';
        case 'WEB': return 'indigo-500';
        default: return 'red-400';
    }
}

interface RoleBadgeProps {
    role: Role;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => (
    <Badge color={roleToColor(role)}>
        {role.long}
    </Badge>
);
