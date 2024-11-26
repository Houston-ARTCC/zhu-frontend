import React from 'react';
import Image from 'next/image';
import { type NextPage } from 'next';
import { PageContent } from '@/components/PageContent';
import errorImg from '@/img/error.jpg';

export const metadata = { title: 'Not Found' };

export const NotFound: NextPage = () => (
    <div className="pb-12 pt-48">
        <PageContent>
            <div className="grid grid-cols-2 items-center gap-10">
                <div className="text-center">
                    <h1 className="mb-5 text-5xl font-bold">Say again?</h1>
                    <p className="mb-5 text-2xl font-medium">
                        We couldn't find the page you were looking for.
                    </p>
                </div>
                <Image
                    src={errorImg}
                    alt="404"
                    className="rounded-md shadow dark:shadow-stone-900"
                />
            </div>
        </PageContent>
    </div>
);

export default NotFound;
