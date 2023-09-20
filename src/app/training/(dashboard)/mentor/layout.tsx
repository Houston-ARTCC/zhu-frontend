import React, { type PropsWithChildren } from 'react';
import { fetchApi } from '@/utils/fetch';
import { type Staff } from '@/types/users';
import { userToOption } from '../../selectOptions';
import { MentorSelectInput } from './MentorSelectInput';

async function getStaff(): Promise<Staff> {
    return fetchApi(
        '/users/staff/',
        { cache: 'no-store' },
    );
}

const MentorProfileLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const staff = await getStaff();

    const options = [
        {
            label: 'Instructors',
            options: staff.ins.map(userToOption),
        },
        {
            label: 'Mentors',
            options: staff.mtr.map(userToOption),
        },
    ];

    return (
        <>
            <MentorSelectInput options={options} />
            {children}
        </>
    );
};

export default MentorProfileLayout;
