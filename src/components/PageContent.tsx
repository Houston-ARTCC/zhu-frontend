import React, { type PropsWithChildren } from 'react';

export const PageContent: React.FC<PropsWithChildren> = ({ children }) => (
    <main className="container mx-auto px-0 py-16 2xl:px-20">
        {children}
    </main>
);
