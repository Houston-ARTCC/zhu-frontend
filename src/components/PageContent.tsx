import React, { type PropsWithChildren } from 'react';

export const PageContent: React.FC<PropsWithChildren> = ({ children }) => (
    <main className="container mx-auto px-6 py-8 sm:py-16">
        {children}
    </main>
);
