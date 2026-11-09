import React, { type PropsWithChildren } from 'react';
import { userToOption } from '@/utils';
import { getTrainingStaff } from '@/lib/users/repository';
import { MentorSelectInput } from './MentorSelectInput';

const MentorProfileLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const staff = await getTrainingStaff();

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
