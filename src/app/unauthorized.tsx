import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type NextPage } from 'next';
import { PageContent } from '@/components/PageContent';
import errorImg from '@/img/error.jpg';

export const metadata = { title: 'Sign In Required' };

const Unauthorized: NextPage = () => (
    <div className="pb-12 pt-48">
        <PageContent>
            <div className="grid grid-cols-2 items-center gap-10">
                <div className="text-center">
                    <h1 className="mb-5 text-5xl font-bold">Say intentions?</h1>
                    <p className="mb-5 text-2xl font-medium">
                        <Link href="/api/auth/signin">Sign in</Link> to view this page.
                    </p>
                </div>
                <Image
                    src={errorImg}
                    alt="401"
                    className="rounded-md shadow dark:shadow-stone-900"
                />
            </div>
        </PageContent>
    </div>
);

export default Unauthorized;
