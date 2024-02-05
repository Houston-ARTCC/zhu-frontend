import React, { type PropsWithChildren } from 'react';
import { fetchApi } from '@/utils/fetch';
import { type BasicUser, type Roster } from '@/types/users';
import { userToOption } from '@/utils';
import { UserSelectInput } from './UserSelectInput';

async function getControllers(): Promise<Roster<BasicUser>> {
    return fetchApi(
        '/users/simplified/',
        { cache: 'no-store' },
    );
}

const EventScoresLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const controllers = await getControllers();

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
