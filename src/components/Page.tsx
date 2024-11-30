import React, { type PropsWithChildren } from 'react';

interface PageProps extends PropsWithChildren {
    title: string;
    subtitle?: string;
}

export const Page: React.FC<PageProps> = ({ title, subtitle, children }) => (
    <>
        <div className="flex h-[300px] flex-col justify-end bg-sky-900 sm:h-[360px] md:h-[420px] dark:bg-sky-950">
            <div className="container mx-auto px-6 pb-8 sm:pb-12 md:pb-16">
                <h1 className="mb-5 text-4xl font-medium text-white sm:text-5xl md:text-6xl">{title}</h1>
                <h2 className="text-xl font-light text-white sm:text-2xl md:text-3xl">{subtitle}</h2>
            </div>
        </div>
        {children}
    </>
);
