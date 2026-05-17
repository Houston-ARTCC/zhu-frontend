'use client';

import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export const SessionGuard: React.FC = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            signIn('vatsim');
        }
    }, [session?.error]);

    return null;
};
