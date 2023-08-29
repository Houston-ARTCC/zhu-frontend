import React, { type PropsWithChildren } from 'react';

interface PageProps extends PropsWithChildren {
    title: string;
    subtitle?: string;
}

export const Page: React.FC<PageProps> = ({ title, subtitle, children }) => (
    <>
        <div className="flex h-[420px] flex-col justify-end bg-darkblue">
            <div className="container mx-auto px-20 pb-16 pt-72">
                <h1 className="mb-5 text-6xl font-medium text-white">{title}</h1>
                <h2 className="text-3xl font-light text-white">{subtitle}</h2>
            </div>
        </div>
        {children}
    </>
);
