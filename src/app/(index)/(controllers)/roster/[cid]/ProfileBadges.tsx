import React from 'react';
import classNames from 'classnames';
import { Badge } from '@/components/Badge';
import { type Role } from '@/types/users';

const CERT_COLOR = [
    '!bg-slate-300 !shadow-slate-300/25',
    '!bg-amber-400 !shadow-amber-400/25',
    '!bg-green-400 !shadow-green-400/25',
    '!bg-red-400 !shadow-red-400/25',
];

const CERT_NAME = ['None', 'Minor', 'Major', 'Solo'];

interface CertBadgeProps {
    cert: number;
}

export const CertBadge: React.FC<CertBadgeProps> = ({ cert }) => (
    <Badge className={classNames('min-w-fit', CERT_COLOR[cert])}>
        {CERT_NAME[cert]}
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
        case 'MC': color = '!bg-[#334d6e] !shadow-[#334d6e]/25'; break;
        default: color = '!bg-red-400 !shadow-red-400/25';
    }

    return (
        <Badge className={color}>{role.long}</Badge>
    );
};
