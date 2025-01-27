'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import classNames from 'classnames';
import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from '@headlessui/react';
import { LuMenu, LuX } from 'react-icons/lu';
import { type Session } from 'next-auth';
import { Dropdown, DropdownButton, DropdownItem, DropdownSeparator } from '@/components/Dropdown';
import { ThemeButton } from './ThemeButton';

interface Section {
    title: string;
    children: ({
        title: string;
        href?: string;
        separate?: boolean;
        action?: () => void;
    })[];
}

interface BrandProps {
    light?: boolean;
}

const Brand: React.FC<BrandProps> = ({ light }) => (
    <Link href="/" className="flex flex-col items-center gap-2">
        <Image
            src={light ? '/img/logo-light.png' : '/img/logo.png'}
            alt="Houston ARTCC Logo"
            width={160}
            height={45}
        />
        <h6
            className={classNames(
                'mt-1 text-xl font-bold leading-none',
                { 'text-gray-900 dark:text-zinc-200': !light, 'text-white': light },
            )}
        >
            Houston ARTCC
        </h6>
    </Link>
);

interface SignInButtonProps {
    className?: string;
    light?: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({ className, light }) => (
    <button
        type="button"
        onClick={() => signIn('vatsim')}
        className={classNames(
            'rounded-md from-sky-400 to-blue-800 px-7 py-1 shadow-sm',
            { 'bg-white shadow-white/25': light, 'bg-gradient-to-r shadow-sky-500/25': !light },
            className,
        )}
    >
        <span
            className={classNames(
                'from-sky-400 to-blue-800',
                {
                    'bg-gradient-to-r text-transparent bg-clip-text font-semibold': light,
                    'bg-transparent text-white': !light,
                },
            )}
        >
            Login with VATSIM
        </span>
    </button>
);

interface MobileMenuButtonProps {
    className?: string;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ className }) => (
    <PopoverButton className={classNames('rounded-md p-1.5 transition-colors duration-150 hover:bg-white/[.10]', className)}>
        <span className="sr-only">Open main menu</span>
        <LuMenu size={32} aria-hidden="true" />
    </PopoverButton>
);

const generateMenu = (session: Session | null): Section[] => {
    const sections: Section[] = [
        {
            title: 'Events',
            children: [
                { title: 'Events', href: '/events' },
                { title: 'Request Support', href: '/events/support' },
                { title: 'Event Scores', href: '/events/scores' },
            ],
        },
        {
            title: 'Pilots',
            children: [
                { title: 'Leave Feedback', href: '/feedback' },
                { title: 'Airspace Map', href: '/map' },
                { title: 'Routes', href: 'https://flightaware.com/statistics/ifr-route/', separate: true },
            ],
        },
        {
            title: 'Controllers',
            children: [
                { title: 'Roster', href: '/roster' },
                { title: 'Staff', href: '/staff' },
                { title: 'Resources', href: '/resources' },
                { title: 'Statistics', href: '/statistics' },
                { title: 'Alias Reference', href: 'https://alias.houston.center/', separate: true },
                { title: 'RVM Reference', href: 'https://rvm.houston.center/' },
            ],
        },
    ];

    if (!session) {
        return sections;
    }

    const user = session!.user!;

    sections.push({
        title: `${user.first_name} ${user.last_name}`,
        children: [],
    });

    if (user.permissions.is_member) {
        sections[3].children.push(
            { title: 'My Profile', href: `/roster/${user.cid}` },
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Training Center', href: '/training' },
        );
    } else {
        sections[3].children.push({ title: 'Apply to Visit', href: '/visit' });
    }

    if (user.permissions.is_staff) {
        sections[0].children.push(
            { title: 'New Event', href: '/events/new', separate: true },
            { title: 'Position Presets', href: '/events/presets' },
        );
        sections[3].children.push({ title: 'Administration', href: '/admin', separate: true });
    }

    sections[3].children.push({ title: 'Logout', action: () => signOut() });

    return sections;
};

export const Navbar: React.FC = () => {
    const { data: session } = useSession();

    const sections = useMemo(() => generateMenu(session), [session]);

    const [shrink, setShrink] = useState(false);

    const linkColor = useMemo(() => (shrink ? 'text-gray-900 dark:text-zinc-200' : 'text-white'), [shrink]);

    useEffect(() => {
        const callback = () => setShrink(window.scrollY > 50);

        callback();

        window.addEventListener('scroll', callback);
        return () => window.removeEventListener('scroll', callback);
    }, []);

    return (
        <Popover
            as="nav"
            className={classNames(
                'fixed inset-x-0 top-0 z-10 py-6 transition-all duration-500 ease-out',
                { 'lg:py-12': !shrink, 'bg-white dark:bg-zinc-950': shrink },
            )}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-5 font-medium xl:gap-10">
                    <Brand light={!shrink} />
                    <div className="ml-auto hidden items-center gap-5 lg:flex xl:gap-10">
                        {sections.map(({ title, children }) => (
                            <Dropdown key={title} title={title} className={linkColor}>
                                {children.map((child) => (
                                    <Fragment key={child.href}>
                                        {child.separate && <DropdownSeparator />}
                                        {child.href && (
                                            <DropdownItem className="block" href={child.href}>
                                                {child.title}
                                            </DropdownItem>
                                        )}
                                        {child.action && (
                                            <DropdownButton onClick={child.action}>
                                                {child.title}
                                            </DropdownButton>
                                        )}
                                    </Fragment>
                                ))}
                            </Dropdown>
                        ))}

                        {!session && <SignInButton light={!shrink} />}

                        <ThemeButton className={linkColor} />
                    </div>
                    <MobileMenuButton className={classNames('ml-auto lg:hidden', linkColor)} />
                </div>
            </div>
            <div className="lg:hidden">
                <PopoverBackdrop
                    transition
                    className="fixed inset-0 z-20 bg-black/40 transition-opacity data-[closed]:opacity-0"
                />

                <PopoverPanel
                    transition
                    className="absolute inset-x-0 top-0 z-30 mx-auto flex max-h-screen w-full flex-col p-2
                               transition-opacity data-[closed]:opacity-0 sm:max-w-screen-sm md:max-w-screen-md"
                >
                    {({ close }) => (
                        <div className="overflow-y-scroll rounded-md bg-white py-4 shadow dark:bg-zinc-850 dark:shadow-stone-900">
                            <div className="flex items-center px-4">
                                <Brand />
                                <div className="ml-auto" />
                                <ThemeButton />
                                <PopoverButton className="rounded-md p-1.5 transition-colors duration-150 hover:bg-white/[.10]">
                                    <span className="sr-only">Close menu</span>
                                    <LuX size={32} aria-hidden="true" />
                                </PopoverButton>
                            </div>

                            {sections.map(({ title, children }) => (
                                <Fragment key={title}>
                                    <h6 className="mt-4 px-4 py-2 text-xl font-medium text-gray-400">{title}</h6>
                                    {children.map((child) => (
                                        <Fragment key={child.href}>
                                            {child.separate && <hr className="mx-4 my-1" />}
                                            {child.href && (
                                                <Link
                                                    className="block whitespace-nowrap px-4 py-1 text-inherit"
                                                    href={child.href}
                                                    prefetch={false}
                                                    onClick={() => close()}
                                                >
                                                    {child.title}
                                                </Link>
                                            )}
                                            {child.action && (
                                                <button
                                                    type="button"
                                                    className="block w-full whitespace-nowrap px-4 py-1 text-left text-inherit
                                                               transition-opacity hover:opacity-75"
                                                    onClick={() => {
                                                        child.action!();
                                                        close();
                                                    }}
                                                >
                                                    {child.title}
                                                </button>
                                            )}
                                        </Fragment>
                                    ))}
                                </Fragment>
                            ))}

                            {!session && <SignInButton className="mx-4 mt-6" />}
                        </div>
                    )}
                </PopoverPanel>
            </div>
        </Popover>
    );
};
