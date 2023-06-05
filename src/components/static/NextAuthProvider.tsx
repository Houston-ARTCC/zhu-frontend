'use client';

import React, { type PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';

export const NextAuthProvider: React.FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider>{children}</SessionProvider>
);
