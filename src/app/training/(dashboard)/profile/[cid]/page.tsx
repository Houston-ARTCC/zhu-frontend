import React from 'react';
import Link from 'next/link';
import { type NextPage } from 'next';
import { LuPlus } from 'react-icons/lu';
import { Button } from '@/components/Button';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getSessionsByStudent } from '@/lib/training/repository';
import { SessionsTable } from '../../SessionsTable';

interface StudentProfileParams {
    params: Promise<{
        cid: string;
    }>;
}

const StudentProfile: NextPage<StudentProfileParams> = async (props) => {
    await requireTrainingStaff();
    const params = await props.params;
    const trainingSessions = await getSessionsByStudent(Number(params.cid));

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
