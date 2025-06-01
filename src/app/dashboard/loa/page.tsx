import React from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';
import { LuCircleCheck, LuCircleDashed, LuCircleHelp } from 'react-icons/lu';
import { format } from 'date-fns';
import { Card } from '@/components/Card';
import { Alert, AlertTitle } from '@/components/Alert';
import { fetchApi } from '@/utils/fetch';
import type { LeaveOfAbsence } from '@/types/loa';
import { Scheduler } from './Scheduler';
import { LoaTable } from './LoaTable';

async function getCurrentLoas(): Promise<LeaveOfAbsence[]> {
    return fetchApi(
        '/loa/',
        { cache: 'no-store' },
    );
}

const RequestLoa: NextPage = async () => {
    const loas = await getCurrentLoas();

    const currentDate = new Date();
    const currentLoa = loas
        .filter((loa) => loa.approved)
        .find((loa) => new Date(loa.start) < currentDate && new Date(loa.end) > currentDate);

    return (
        <div className="flex flex-col gap-10">
            <Card>
                {currentLoa ? (
                    <>
                        <p className="mb-2 flex items-center gap-2 text-lg font-medium">
                            <LuCircleCheck size={20} className="text-green-500" />
                            <span>
                                You are currently on a leave of absence until <b>{format(new Date(currentLoa.end), 'MMMM d, y')}</b>.
                            </span>
                        </p>
                        <p className="mb-3">
                            You are not expected to fulfill currency requirements during your leave, however,
                            you may still be expected to fulfill them by the end of the quarter.
                            You can check your quarterly status <Link href="/dashboard/status">here</Link>.
                        </p>
                        <p className="mb-3">
                            If you would like to return from your leave early, you may do so at any time by
                            simply cancelling your active leave of absence.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="mb-2 flex items-center gap-2 text-lg font-medium">
                            <LuCircleDashed size={20} className="text-slate-400" />
                            You are currently not on a leave of absence.
                        </p>
                        <p className="mb-3">
                            You are expected to fulfill currency requirements by the end of the quarter.
                            You can check your quarterly status <Link href="/dashboard/status">here</Link>.
                        </p>
                    </>
                )}
                <p>
                    If you have any questions, do not hesitate to reach out to
                    {' '}
                    <a href="mailto:management@houston.center">management@houston.center</a>.
                </p>
                {loas.length > 0 && (
                    <>
                        <hr className="my-5" />
                        <LoaTable data={loas} />
                    </>
                )}
            </Card>
            <Alert color="indigo-500" icon={LuCircleHelp}>
                <AlertTitle>How do I use this?</AlertTitle>
                <p className="mb-3">
                    If you expect to be unable to meet roster currency requirements for any reason
                    for a duration of <b>at least 30 days</b>, then you may submit a leave of absence
                    to prevent you from being erroneously removed from the roster.
                </p>
                <p>
                    To select the dates, drag your mouse across multiple boxes on the calendar below.
                    Alternatively, you may click anywhere on the calendar and use the date pickers in the pop-up.
                </p>
            </Alert>
            <Scheduler />
        </div>
    );
};

export default RequestLoa;
