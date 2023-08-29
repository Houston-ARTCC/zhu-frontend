import React from 'react';
import classNames from 'classnames';
import { MdCircle } from 'react-icons/md';
import { Badge } from '@/components/Badge';
import { Dropdown, DropdownButton } from '@/components/Dropdown';
import { type Role } from '@/types/users';

interface CertProps {
    cert: number;
}

const CERT_CIRCLE_COLOR = ['fill-slate-300', 'fill-amber-400', 'fill-green-400', 'fill-red-400'];

export const CertCircle: React.FC<CertProps> = ({ cert }) => (
    <MdCircle size={20} className={CERT_CIRCLE_COLOR[cert]} />
);

const CERT_BADGE_COLOR = [
    '!bg-slate-300 !shadow-slate-300/25',
    '!bg-amber-400 !shadow-amber-400/25',
    '!bg-green-400 !shadow-green-400/25',
    '!bg-red-400 !shadow-red-400/25',
];

const CERT_NAME = ['None', 'Minor', 'Major', 'Solo'];

export const CertBadge: React.FC<CertProps> = ({ cert }) => (
    <Badge className={classNames('min-w-fit', CERT_BADGE_COLOR[cert])}>
        {CERT_NAME[cert]}
    </Badge>
);

interface CertDropdownProps extends CertProps {
    onUpdate: (cert: number) => void;
}

export const CertDropdown: React.FC<CertDropdownProps> = ({ cert, onUpdate }) => (
    <Dropdown
        title={CERT_NAME[cert]}
        className={classNames('text-white font-semibold !py-1 !px-3 !gap-1', CERT_BADGE_COLOR[cert])}
        menuClassName="w-28"
    >
        <DropdownButton onClick={() => onUpdate(0)}>
            <div className="flex justify-center">
                <CertBadge cert={0} />
            </div>
        </DropdownButton>
        <DropdownButton onClick={() => onUpdate(1)}>
            <div className="flex justify-center">
                <CertBadge cert={1} />
            </div>
        </DropdownButton>
        <DropdownButton onClick={() => onUpdate(2)}>
            <div className="flex justify-center">
                <CertBadge cert={2} />
            </div>
        </DropdownButton>
        <DropdownButton onClick={() => onUpdate(3)}>
            <div className="flex justify-center">
                <CertBadge cert={3} />
            </div>
        </DropdownButton>
    </Dropdown>
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
