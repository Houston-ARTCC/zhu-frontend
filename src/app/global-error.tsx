'use client';

import { useEffect } from 'react';
import NextError from 'next/error';
import { type NextPage } from 'next';
import * as Sentry from '@sentry/nextjs';

interface ErrorProps {
    error: Error & { digest?: string };
}

export const GlobalError: NextPage<ErrorProps> = ({ error }) => {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <NextError statusCode={500} />
            </body>
        </html>
    );
};

export default GlobalError;
