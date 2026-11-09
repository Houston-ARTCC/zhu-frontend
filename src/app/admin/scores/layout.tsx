import React, { type PropsWithChildren } from 'react';
import { getSimplifiedUsers } from '@/lib/users/repository';
import { userToOption } from '@/utils';
import { UserSelectInput } from './UserSelectInput';

const EventScoresLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const controllers = await getSimplifiedUsers();

    const options = [
        {
            label: 'Home Controllers',
            options: controllers.home.map(userToOption),
        },
        {
            label: 'Visiting Controllers',
            options: controllers.visiting.map(userToOption),
        },
    ];

    return (
        <>
            <UserSelectInput options={options} />
            {children}
        </>
    );
};

export default EventScoresLayout;
