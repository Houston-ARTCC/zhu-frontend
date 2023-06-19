import React from 'react';
import { type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { LuUserCog } from 'react-icons/lu';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { fetchApi } from '@/utils/fetch';
import { type User } from '@/types/users';
import { type Feedback } from '@/types/feedback';
import { type DailyStatistic, type Session } from '@/types/connections';
import { ConnectionsTable, FeedbackTable } from './ProfileTables';
import { Heatmap } from './Heatmap';
import { RoleBadge, CertBadge } from './ProfileBadges';

async function getUser(cid: string): Promise<User> {
    return fetchApi(
        `/users/${cid}/`,
        { cache: 'no-store' },
    );
}

async function getUserConnections(cid: string): Promise<Session[]> {
    return fetchApi(
        `/connections/sessions/${cid}/`,
        { cache: 'no-store' },
    );
}

async function getUserStatistics(cid: string): Promise<DailyStatistic[]> {
    return fetchApi(
        `/connections/daily/${new Date().getFullYear()}/${cid}/`,
        { cache: 'no-store' },
    );
}

async function getUserFeedback(cid: string): Promise<Feedback[]> {
    return fetchApi(
        `/users/${cid}/feedback/`,
        { cache: 'no-store' },
    );
}

interface UserProfileParams {
    params: {
        cid: string;
    };
}

const UserProfile: NextPage<UserProfileParams> = async ({ params }) => {
    const session = await getServerSession(authOptions);

    const user = await getUser(params.cid);
    const connections = await getUserConnections(params.cid);
    const statistics = await getUserStatistics(params.cid);

    const feedback = session?.user.is_staff && await getUserFeedback(params.cid);

    return (
        <Page
            title={`${user.first_name} ${user.last_name}`}
            subtitle={`${user.rating.long} — ${user.cid}`}
        >
            <PageContent>
                <div className="grid grid-cols-2 gap-10">
                    <div>
                        <div className="mb-12 flex items-start gap-5">
                            <div className="flex flex-col items-center gap-5">
                                <ProfilePicture user={user} size={150} />
                                <Button>
                                    <LuUserCog size={20} />
                                    Edit User
                                </Button>
                            </div>
                            <div className="min-w-0">
                                <div className="mb-5 flex gap-3">
                                    {user.roles.map((role) => <RoleBadge key={role.short} role={role} />)}
                                </div>
                                <p className="break-words">{user.biography ? user.biography : 'This user has not set a biography.'}</p>
                            </div>
                        </div>
                        <div className="mb-12 grid grid-cols-6">
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium">Delivery</p>
                                <CertBadge cert={user.del_cert} />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium">Ground</p>
                                <CertBadge cert={user.gnd_cert} />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium">Tower</p>
                                <CertBadge cert={user.twr_cert} />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium">Approach</p>
                                <CertBadge cert={user.app_cert} />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium">Center</p>
                                <CertBadge cert={user.ctr_cert} />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium">Oceanic</p>
                                <CertBadge cert={user.ocn_cert} />
                            </div>
                        </div>
                        <Heatmap data={statistics} />
                    </div>
                    <div>
                        <Card>
                            <h3 className="mb-5 text-2xl font-medium">Connections</h3>
                            <ConnectionsTable data={connections} />
                        </Card>
                        {feedback && (
                            <Card className="mt-10">
                                <h3 className="mb-5 text-2xl font-medium">Feedback</h3>
                                <FeedbackTable data={feedback} />
                            </Card>
                        )}
                    </div>
                </div>
            </PageContent>
        </Page>
    );
};

export default UserProfile;
