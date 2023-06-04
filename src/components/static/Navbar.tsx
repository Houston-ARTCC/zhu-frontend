'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import Image from 'next/image';

export const Navbar: React.FC = () => {
    const [shrink, setShrink] = useState(false);

    const linkColor = useMemo(() => (shrink ? 'text-gray-900' : 'text-white'), [shrink]);

    useEffect(() => {
        const callback = () => setShrink(window.scrollY > 50);
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
            <div className="container mx-auto flex items-center px-20 font-semibold">
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
                    <button
                        type="button"
                        className={classNames(
                            'rounded-md from-sky-400 to-blue-800 px-7 py-1 shadow-sm',
                            { 'bg-white shadow-white/25': !shrink, 'bg-gradient-to-r shadow-sky-500/25': shrink },
                        )}
                    >
                        <span
                            className={classNames(
                                'from-sky-400 to-blue-800',
                                {
                                    'bg-gradient-to-r text-transparent bg-clip-text': !shrink,
                                    'bg-transparent text-white': shrink,
                                },
                            )}
                        >
                            Login with VATSIM
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
