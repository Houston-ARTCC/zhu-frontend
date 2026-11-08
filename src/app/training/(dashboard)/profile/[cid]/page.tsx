import React from 'react';
import Link from 'next/link';
import { type NextPage } from 'next';
import { LuPlus } from 'react-icons/lu';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { SessionsTable } from '../../SessionsTable';

async function getTrainingSessions(cid: string): Promise<TrainingSession[]> {
    return fetchApi(
        `/training/sessions/${cid}/`,
        { cache: 'no-store' },
    );
}

interface StudentProfileParams {
    params: Promise<{
        cid: string;
    }>;
}

const StudentProfile: NextPage<StudentProfileParams> = async (props) => {
    const params = await props.params;
    const trainingSessions = await getTrainingSessions(params.cid);

    return (
        <>
            <div className="my-5 flex justify-end">
                <Link href={`/training/session/log/${params.cid}`}>
                    <Button>
                        <LuPlus />
                        Log Session
                    </Button>
                </Link>
            </div>
            <SessionsTable data={trainingSessions} />
        </>
    );
};

export default StudentProfile;
