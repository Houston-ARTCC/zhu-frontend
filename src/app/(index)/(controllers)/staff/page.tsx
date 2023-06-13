import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type Staff } from '@/types/api/users';
import { StaffCard } from './StaffCard';

export const metadata = { title: 'Facility Staff' };

async function getStaff(): Promise<Staff> {
    return fetchApi(
        '/users/staff/',
        { next: { revalidate: 3600 } },
    );
}

const Staff: NextPage = async () => {
    const staff = await getStaff();

    return (
        <Page {...metadata}>
            <PageContent>
                <h2 className="text-4xl font-medium">ARTCC Staff</h2>
                <h3 className="mb-5 font-medium text-slate-400">Responsible for the bulk of ARTCC operations.</h3>
                <div className="mb-16 grid grid-cols-3 gap-5">
                    <StaffCard
                        user={staff.atm.user}
                        title="Air Traffic Manager"
                        description="Responsible for the macro-management of the ARTCC. Oversees day-to-day operations and ensures the ARTCC runs smoothly."
                        email="atm@zhuartcc.org"
                    />
                    <StaffCard
                        user={staff.datm.user}
                        title="Deputy Air Traffic Manager"
                        description="Assists the Air Traffic Manager with the management of the ARTCC. Acts as the ATM when necessary."
                        email="datm@zhuartcc.org"
                    />
                    <StaffCard
                        user={staff.ta.user}
                        title="Training Administrator"
                        description="Responsible for the creation of training programs and procedures. Oversees instructors and mentors."
                        email="ta@zhuartcc.org"
                    />
                    <StaffCard
                        user={staff.fe.user}
                        title="Facility Engineer"
                        description="Responsible for the creation of sector files, radar client files, training scenarios, and other ARTCC resources."
                        email="ta@zhuartcc.org"
                    />
                    <StaffCard
                        user={staff.ec.user}
                        title="Events Coordinator"
                        description="Responsible for the planning and advertising of events with neighboring facilities, virtual airlines, VATUSA, and VATSIM."
                        email="ec@zhuartcc.org"
                    />
                    <StaffCard
                        user={staff.wm.user}
                        title="Webmaster"
                        description="Responsible for the operation and maintenance of ARTCC IT services. Oversees the web team."
                        email="wm@zhuartcc.org"
                    />
                </div>

                <h2 className="text-4xl font-medium">Assistant Staff</h2>
                <h3 className="mb-5 font-medium text-slate-400">Assist the ARTCC staff in their respetive duties.</h3>
                <div className="mb-16 grid grid-cols-3 gap-5">
                    {staff.ta.assistants.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Assistant Training Administrator" />
                    ))}
                    {staff.fe.assistants.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Assistant Facility Engineer" />
                    ))}
                    {staff.ec.assistants.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Assistant Events Coordinator" />
                    ))}
                    {staff.wm.assistants.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Assistant Webmaster" />
                    ))}
                </div>

                <h2 className="text-4xl font-medium">Training Team</h2>
                <h3 className="mb-5 font-medium text-slate-400">Responsible for mentoring and training controllers.</h3>
                <div className="mb-16 grid grid-cols-3 gap-5">
                    {staff.ins.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Instructor" />
                    ))}
                    {staff.mtr.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Mentor" />
                    ))}
                </div>

                <h2 className="text-4xl font-medium">Web Team</h2>
                <h3 className="mb-5 font-medium text-slate-400">Assist the webmaster with maintaining ARTCC IT services.</h3>
                <div className="mb-16 grid grid-cols-3 gap-5">
                    {staff.web.map((user) => (
                        <StaffCard key={user.cid} user={user} title="Web Team" />
                    ))}
                </div>
            </PageContent>
        </Page>
    );
};

export default Staff;
