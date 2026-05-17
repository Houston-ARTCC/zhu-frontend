'use client';

import React, { type PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SessionGuard } from '@/components/static/SessionGuard';

export const NextAuthProvider: React.FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider
        // Slightly shorter than SIMPLE_JWT.ACCESS_TOKEN_LIFETIME in
        // https://github.com/Houston-ARTCC/zhu-core/blob/main/zhu_core/settings.py
        refetchInterval={(60 * 60) - 60}
        refetchOnWindowFocus
    >
        <SessionGuard />
        {children}
    </SessionProvider>
);
