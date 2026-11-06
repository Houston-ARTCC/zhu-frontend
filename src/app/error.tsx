'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/Button';
import { PageContent } from '@/components/PageContent';
import errorImg from '@/img/error.jpg';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="pb-12 pt-48">
            <PageContent>
                <div className="grid grid-cols-2 items-center gap-10">
                    <div className="text-center">
                        <h1 className="mb-5 text-5xl font-bold">Stand by...</h1>
                        <p className="mb-5 text-2xl font-medium">
                            Something went wrong loading this page.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button onClick={reset}>Try Again</Button>
                            <Link href="/">
                                <Button variant="secondary">Go Home</Button>
                            </Link>
                        </div>
                    </div>
                    <Image
                        src={errorImg}
                        alt="Error"
                        className="rounded-md shadow dark:shadow-stone-900"
                    />
                </div>
            </PageContent>
        </div>
    );
};

export default ErrorPage;
