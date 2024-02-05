import React, { type PropsWithChildren } from 'react';
import { fetchApi } from '@/utils/fetch';
import { type BasicUser, type Roster } from '@/types/users';
import { userToOption } from '@/utils';
import { StudentSelectInput } from './StudentSelectInput';

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
    ];

    return (
        <>
            <StudentSelectInput options={options} />
            {children}
        </>
    );
};

export default StudentProfileLayout;
