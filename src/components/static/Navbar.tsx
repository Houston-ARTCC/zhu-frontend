'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import classNames from 'classnames';

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
                <div className="ml-auto flex items-center gap-28">
                    <Link href="/" className={linkColor}>Calendar</Link>
                    <Link href="/" className={linkColor}>Events</Link>
                    <Link href="/" className={linkColor}>Pilots</Link>
                    <Link href="/" className={linkColor}>Controllers</Link>
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
                        <Link href="/" className={linkColor}>
                            {session?.user.first_name} {session?.user.last_name}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
