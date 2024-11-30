'use client';

import React, { type PropsWithChildren } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import type { Profile } from 'next-auth';
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
    auth?: (token: Profile | undefined) => boolean;
    children: ({
        title: string;
        route?: string;
        url?: string;
        alerts?: number;
        auth?: (token: Profile | undefined) => boolean;
    })[];
}

interface SideNavProps {
    rootPath: string;
    sections: Section[];
}

export const SideNav: React.FC<SideNavProps> = ({ rootPath, sections }) => {
    const segment = useSelectedLayoutSegment();
    const { data: session } = useSession();

    return (
        <div className="sticky top-40 shrink-0">
            {sections
                .filter((section) => section.auth?.(session?.user) ?? true)
                .map(({ title, children }) => (
                    <>
                        <h6 className="mb-2 mt-4 font-medium text-sky-500 first:mt-0">{title}</h6>
                        {children
                            .filter((child) => child.auth?.(session?.user) ?? true)
                            .map((child) => (
                                <SideNavItem key={child.route ?? child.url} active={child.route === (segment ?? '')}>
                                    <Link
                                        className="flex items-center gap-2 text-inherit"
                                        href={child.url ?? `${rootPath}/${child.route}`}
                                        prefetch={false}
                                    >
                                        {child.title}
                                        {child.alerts ? (
                                            <Badge small color="red-400" className="max-w-fit">
                                                {child.alerts}
                                            </Badge>
                                        ) : null}
                                    </Link>
                                </SideNavItem>
                            ))}
                    </>
                ))}
        </div>
    );
};
