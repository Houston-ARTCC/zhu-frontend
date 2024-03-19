'use client';

import React, { type PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';

export const NextAuthProvider: React.FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider
        // Slightly shorter than SIMPLE_JWT.ACCESS_TOKEN_LIFETIME in
        // https://github.com/Houston-ARTCC/zhu-core/blob/main/zhu_core/settings.py
        refetchInterval={(60 * 60 * 24) - 60}
        refetchOnWindowFocus
    >
        {children}
    </SessionProvider>
);
