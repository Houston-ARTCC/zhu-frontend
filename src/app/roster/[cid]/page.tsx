import React from 'react';
import { notFound } from 'next/navigation';
import { type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { EndorsementBadge, RoleBadge } from '@/app/roster/ProfileBadges';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Card } from '@/components/Card';
import { authOptions } from '@/utils/auth';
import { fetchApi } from '@/utils/fetch';
import { type AuthenticatedUser, type User } from '@/types/users';
import { type BasicFeedback } from '@/types/feedback';
import { type DailyStatistic, type Session } from '@/types/connections';
import { ConnectionsTable, FeedbackTable } from './ProfileTables';
import { Heatmap } from './Heatmap';
import { EditUserButton } from './EditUserModal';

async function getUser(cid: string): Promise<User | AuthenticatedUser> {
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

async function getUserFeedback(cid: string): Promise<BasicFeedback[]> {
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

    const user = await getUser(params.cid).catch(notFound);
    const connections = await getUserConnections(params.cid);
    const statistics = await getUserStatistics(params.cid);

    const feedback = (session?.user.permissions.is_staff || session?.user.cid.toString() === params.cid)
        && await getUserFeedback(params.cid);

    return (
        <Page
            title="Controller Roster"
            subtitle={`${user.first_name} ${user.last_name}`}
        >
            <PageContent>
                <div className="grid grid-cols-2 gap-10">
                    <div>
                        <div className="mb-12 flex items-start gap-5">
                            <div className="flex flex-col items-center gap-5">
                                <ProfilePicture user={user} size={150} />
                                {session?.user.permissions.is_staff && (
                                    <EditUserButton user={user as AuthenticatedUser} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="mb-5 flex flex-wrap gap-3">
                                    {user.roles.map((role) => <RoleBadge key={role.short} role={role} />)}
                                </div>
                                <p className="mb-5 break-words">
                                    {user.biography || 'This user has not set a biography.'}
                                </p>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3">
                                    <b>CID:</b>
                                    <p>{user.cid}</p>
                                    <b>Rating:</b>
                                    <p>{user.rating.long}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-12">
                            <h3 className="mb-5 text-2xl font-medium">Endorsements</h3>
                            <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3">
                                <p className="text-right font-medium">Delivery + Ground</p>
                                <div className="flex gap-2">
                                    <EndorsementBadge tier={0} name="GND" status={user.endorsements.gnd} />
                                    <EndorsementBadge tier={1} name="HOU GND T1" status={user.endorsements.hou_gnd} />
                                    <EndorsementBadge tier={1} name="IAH GND T1" status={user.endorsements.iah_gnd} />
                                </div>
                                <p className="text-right font-medium">Local</p>
                                <div className="flex gap-2">
                                    <EndorsementBadge tier={0} name="TWR" status={user.endorsements.twr} />
                                    <EndorsementBadge tier={1} name="HOU TWR T1" status={user.endorsements.hou_twr} />
                                    <EndorsementBadge tier={1} name="IAH TWR T1" status={user.endorsements.iah_twr} />
                                </div>
                                <p className="text-right font-medium">Approach</p>
                                <div className="flex gap-2">
                                    <EndorsementBadge tier={0} name="APP" status={user.endorsements.app} />
                                    <EndorsementBadge tier={1} name="I90 T1" status={user.endorsements.i90} />
                                </div>
                                <p className="text-right font-medium">Center</p>
                                <div className="flex gap-2">
                                    <EndorsementBadge tier={2} name="ZHU" status={user.endorsements.zhu} />
                                </div>
                            </div>
                        </div>
                        <h3 className="mb-5 text-2xl font-medium">Controlling Heatmap</h3>
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
