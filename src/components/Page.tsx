'use client';

import React from 'react';
import { type PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

interface PageProps extends PropsWithChildren {
    title: string;
}

export const Page: React.FC<PageProps> = ({ title, children }) => {
    const pathname = usePathname();

    if (pathname === '/') return children;

    return (
        <>
            <div className="bg-[#334d6e]">
                <div className="container mx-auto px-20 pb-16 pt-72">
                    <h1 className="text-6xl font-medium text-white">{title}</h1>
                </div>
            </div>
            {children}
        </>
    );
};
