import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type Roster, type User } from '@/types/users';
import { RosterCard } from './RosterCard';

export const metadata = { title: 'Controller Roster' };

async function getRoster(): Promise<Roster> {
    return fetchApi(
        '/users/',
        { next: { revalidate: 3600 } },
    );
}

const RosterPage: NextPage = async () => {
    const roster = await getRoster();

    const sortName = (a: User, b: User) => (
        a.first_name.localeCompare(b.first_name)
        || a.last_name.localeCompare(b.last_name)
    );

    const generateCard = (user: User) => <RosterCard key={user.cid} user={user} />;

    const levels = {
        oceanic: [] as User[],
        center: [] as User[],
        approach: [] as User[],
        tower: [] as User[],
        ground: [] as User[],
        delivery: [] as User[],
        observer: [] as User[],
    };

    roster.home.forEach((user) => {
        if (user.ocn_cert) levels.oceanic.push(user);
        else if (user.ctr_cert) levels.center.push(user);
        else if (user.app_cert) levels.approach.push(user);
        else if (user.twr_cert) levels.tower.push(user);
        else if (user.gnd_cert) levels.ground.push(user);
        else if (user.del_cert) levels.delivery.push(user);
        else levels.observer.push(user);
    });

    return (
        <Page {...metadata}>
            <PageContent>
                <h2 className="mb-8 text-center text-4xl font-medium">Oceanic</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.oceanic.sort(sortName).map(generateCard)}
                </div>
                <h2 className="mb-8 text-center text-4xl font-medium">Center</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.center.sort(sortName).map(generateCard)}
                </div>
                <h2 className="mb-8 text-center text-4xl font-medium">Approach</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.approach.sort(sortName).map(generateCard)}
                </div>
                <h2 className="mb-8 text-center text-4xl font-medium">Tower</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.tower.sort(sortName).map(generateCard)}
                </div>
                <h2 className="mb-8 text-center text-4xl font-medium">Ground</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.ground.sort(sortName).map(generateCard)}
                </div>
                <h2 className="mb-8 text-center text-4xl font-medium">Delivery</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.delivery.sort(sortName).map(generateCard)}
                </div>
                <h2 className="mb-8 text-center text-4xl font-medium">Observer</h2>
                <div className="mb-16 grid grid-cols-4 gap-5">
                    {levels.observer.sort(sortName).map(generateCard)}
                </div>
            </PageContent>
        </Page>
    );
};

export default RosterPage;
