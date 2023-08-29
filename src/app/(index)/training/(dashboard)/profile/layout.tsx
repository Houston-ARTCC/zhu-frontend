import React, { type PropsWithChildren } from 'react';
import { fetchApi } from '@/utils/fetch';
import { type BasicUser, type Roster } from '@/types/users';
import { StudentSelectInput } from './StudentSelectInput';

const userToOption = (user: BasicUser) => ({ value: user.cid, label: `${user.first_name} ${user.last_name}` });

async function getStudents(): Promise<Roster<BasicUser>> {
    return fetchApi(
        '/users/simplified/',
        { cache: 'no-store' },
    );
}

const StudentProfileLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const students = await getStudents();

    const options = [
        {
            label: 'Home Controllers',
            options: students.home.map(userToOption),
        },
        {
            label: 'Visiting Controllers',
            options: students.visiting.map(userToOption),
        },
        {
            label: 'MAVP Controllers',
            options: students.mavp.map(userToOption),
        },
    ];

    return (
        <>
            <StudentSelectInput options={options} />
            {children}
        </>
    );
};

export default StudentProfileLayout;
