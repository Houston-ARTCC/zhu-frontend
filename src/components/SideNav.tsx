'use client';

import React, { type PropsWithChildren } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import { Badge } from '@/components/Badge';

interface SideNavItemProps extends PropsWithChildren {
    active?: boolean;
}

const SideNavItem: React.FC<SideNavItemProps> = ({ active = false, children }) => (
    <div
        className={classNames(
            'border-l-2 py-2 pl-5',
            {
                'border-sky-500 font-medium': active,
                'border-transparent': !active,
            },
        )}
    >
        {children}
    </div>
);

interface Section {
    title: string;
    members: ({
        title: string;
        route?: string;
        url?: string;
        alerts?: number;
    })[];
}

interface SideNavProps {
    sections: Section[];
}

export const SideNav: React.FC<SideNavProps> = ({ sections }) => {
    const segment = useSelectedLayoutSegment();

    return (
        <div className="shrink-0">
            {sections.map(({ title, members }) => (
                <>
                    <h6 className="mb-2 mt-4 font-medium text-sky-500 first:mt-0">{title}</h6>
                    {members.map((member) => (
                        <SideNavItem key={member.route ?? member.url} active={member.route === (segment ?? '')}>
                            <Link
                                className="flex items-center gap-2 text-inherit"
                                href={member.url ?? `training/${member.route}`}
                                prefetch={false}
                            >
                                {member.title}
                                {member.alerts
                                    ? <Badge small className="max-w-fit !bg-red-400 !shadow-red-400/25">{member.alerts}</Badge>
                                    : null}
                            </Link>
                        </SideNavItem>
                    ))}
                </>
            ))}
        </div>
    );
};
