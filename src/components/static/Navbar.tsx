'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import classNames from 'classnames';
import { Dropdown, DropdownButton, DropdownItem, DropdownSeparator } from '@/components/Dropdown';
import { ThemeButton } from './ThemeButton';

export const Navbar: React.FC = () => {
    const router = useRouter();
    const { data: session, status: authStatus } = useSession();

    const [shrink, setShrink] = useState(false);

    const linkColor = useMemo(() => (shrink ? 'text-gray-900 dark:text-zinc-200' : 'text-white'), [shrink]);

    useEffect(() => {
        const callback = () => setShrink(window.scrollY > 50);

        callback();

        window.addEventListener('scroll', callback);
        return () => window.removeEventListener('scroll', callback);
    }, []);

    return (
        <nav
            className={classNames(
                'fixed inset-x-0 top-0 z-10 transition-all duration-500 ease-out',
                { 'py-12': !shrink, 'bg-white dark:bg-zinc-950 py-4': shrink },
            )}
        >
            <div className="container mx-auto flex items-center px-0 font-medium 2xl:px-20">
                <Link href="/" className="flex flex-col items-center gap-2">
                    <Image
                        src={shrink ? '/img/logo.png' : '/img/logo-light.png'}
                        alt="Houston ARTCC Logo"
                        width={160}
                        height={45}
                    />
                    <h6 className={classNames('text-xl font-bold', linkColor)}>Houston ARTCC</h6>
                </Link>
                <div className="ml-auto flex items-center gap-10">
                    <Dropdown title="Events" className={linkColor}>
                        <DropdownItem href="/events">Events</DropdownItem>
                        <DropdownItem href="/events/support">Request Support</DropdownItem>
                        <DropdownItem href="/events/scores">Event Scores</DropdownItem>
                        {authStatus === 'authenticated' && session && session.user.permissions.is_staff && (
                            <>
                                <DropdownSeparator />
                                <DropdownItem href="/events/new">New Event</DropdownItem>
                                <DropdownItem href="/events/presets">Position Presets</DropdownItem>
                            </>
                        )}
                    </Dropdown>
                    <Dropdown title="Pilots" className={linkColor}>
                        <DropdownItem href="/feedback">Leave Feedback</DropdownItem>
                        <DropdownItem href="/map">Airspace Map</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem href="https://flightaware.com/statistics/ifr-route/" target="_blank" rel="noreferrer">Routes</DropdownItem>
                    </Dropdown>
                    <Dropdown title="Controllers" className={linkColor}>
                        <DropdownItem href="/roster">Roster</DropdownItem>
                        <DropdownItem href="/staff">Staff</DropdownItem>
                        <DropdownItem href="/resources">Resources</DropdownItem>
                        <DropdownItem href="/statistics">Statistics</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem href="https://alias.houston.center/" target="_blank" rel="noreferrer">Alias Reference</DropdownItem>
                        <DropdownItem href="https://rvm.houston.center/" target="_blank" rel="noreferrer">RVM Reference</DropdownItem>
                    </Dropdown>
                    {authStatus === 'authenticated' && session ? (
                        <Dropdown title={`${session.user.first_name} ${session.user.last_name}`} className={linkColor}>
                            {session.user.permissions.is_member ? (
                                <>
                                    <DropdownItem href={`/roster/${session.user.cid}`}>My Profile</DropdownItem>
                                    <DropdownItem href="/dashboard">Dashboard</DropdownItem>
                                    <DropdownItem href="/training">Training Center</DropdownItem>
                                    <DropdownSeparator />
                                    {session.user.permissions.is_staff && (
                                        <DropdownItem href="/admin">Administration</DropdownItem>
                                    )}
                                </>
                            ) : (
                                <DropdownItem href="/visit">Apply to Visit</DropdownItem>
                            )}
                            <DropdownSeparator />
                            <DropdownButton
                                onClick={() => {
                                    signOut({ redirect: false });
                                    router.push('/');
                                }}
                            >
                                Log Out
                            </DropdownButton>
                        </Dropdown>
                    ) : (
                        <button
                            type="button"
                            onClick={() => signIn('vatsim')}
                            className={classNames(
                                'rounded-md from-sky-400 to-blue-800 px-7 py-1 shadow-sm',
                                { 'bg-white shadow-white/25': !shrink, 'bg-gradient-to-r shadow-sky-500/25': shrink },
                            )}
                        >
                            <span
                                className={classNames(
                                    'from-sky-400 to-blue-800',
                                    {
                                        'bg-gradient-to-r text-transparent bg-clip-text font-semibold': !shrink,
                                        'bg-transparent text-white': shrink,
                                    },
                                )}
                            >
                                Login with VATSIM
                            </span>
                        </button>
                    )}
                    <ThemeButton className={linkColor} />
                </div>
            </div>
        </nav>
    );
};
