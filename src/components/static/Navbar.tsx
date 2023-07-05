'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import classNames from 'classnames';
import { Dropdown, DropdownButton, DropdownItem } from '@/components/Dropdown';

export const Navbar: React.FC = () => {
    const { data: session, status: authStatus } = useSession();

    const [shrink, setShrink] = useState(false);

    const linkColor = useMemo(() => (shrink ? 'text-gray-900' : 'text-white'), [shrink]);

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
                { 'py-16': !shrink, 'bg-white py-6': shrink },
            )}
        >
            <div className="container mx-auto flex items-center px-20 font-medium">
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
                    <Link href="/calendar" className={linkColor}>
                        <DropdownButton>Calendar</DropdownButton>
                    </Link>
                    <Dropdown title="Events" className={linkColor}>
                        <DropdownItem href="/events">Events</DropdownItem>
                        <DropdownItem href="/events/support">Request Support</DropdownItem>
                        <DropdownItem href="/events/scores">Event Scores</DropdownItem>
                        <hr />
                        <DropdownItem href="/events/new">New Event</DropdownItem>
                        <DropdownItem href="/events/presets">Position Presets</DropdownItem>
                    </Dropdown>
                    <Dropdown title="Pilots" className={linkColor}>
                        <DropdownItem href="/feedback">Leave Feedback</DropdownItem>
                        <DropdownItem href="/map">ARTCC Map</DropdownItem>
                        <hr />
                        <DropdownItem href="https://flightaware.com/statistics/ifr-route/" target="_blank" rel="noreferrer">Routes</DropdownItem>
                    </Dropdown>
                    <Dropdown title="Calendar" className={linkColor}>
                        <DropdownItem href="/roster">Roster</DropdownItem>
                        <DropdownItem href="/staff">Staff</DropdownItem>
                        <DropdownItem href="/resources">Resources</DropdownItem>
                        <DropdownItem href="/statistics">Statistics</DropdownItem>
                        <hr />
                        <DropdownItem href="https://vzhuids.net/" target="_blank" rel="noreferrer">IDS</DropdownItem>
                    </Dropdown>
                    {authStatus === 'unauthenticated' ? (
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
                    ) : (
                        <Dropdown title={`${session?.user.first_name} ${session?.user.last_name}`} className={linkColor}>
                            <DropdownItem href={`/roster/${session?.user.cid}`}>My Profile</DropdownItem>
                            <DropdownItem href="/training">Training Center</DropdownItem>
                            <hr />
                            <DropdownItem href="/admin">Administration</DropdownItem>
                            <DropdownItem href="/dashboard">Dashboard</DropdownItem>
                            <hr />
                            <button type="button" onClick={() => signOut()}>Log Out</button>
                        </Dropdown>
                    )}
                </div>
            </div>
        </nav>
    );
};
