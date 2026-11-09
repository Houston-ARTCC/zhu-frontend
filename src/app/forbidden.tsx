import React from 'react';
import Image from 'next/image';
import { type NextPage } from 'next';
import { PageContent } from '@/components/PageContent';
import errorImg from '@/img/error.jpg';

export const metadata = { title: 'Forbidden' };

const Forbidden: NextPage = () => (
    <div className="pb-12 pt-48">
        <PageContent>
            <div className="grid grid-cols-2 items-center gap-10">
                <div className="text-center">
                    <h1 className="mb-5 text-5xl font-bold">Unable.</h1>
                    <p className="mb-5 text-2xl font-medium">
                        You don't have access to this page.
                    </p>
                </div>
                <Image
                    src={errorImg}
                    alt="403"
                    className="rounded-md shadow dark:shadow-stone-900"
                />
            </div>
        </PageContent>
    </div>
);

export default Forbidden;
