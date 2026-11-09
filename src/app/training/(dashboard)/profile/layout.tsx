import React, { type PropsWithChildren } from 'react';
import { userToOption } from '@/utils';
import { getSimplifiedUsers } from '@/lib/users/repository';
import { StudentSelectInput } from './StudentSelectInput';

const StudentProfileLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const students = await getSimplifiedUsers();

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
