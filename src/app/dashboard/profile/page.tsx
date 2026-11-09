import React from 'react';
import type { NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type User } from '@/types/users';
import { auth } from '@/auth';
import { EditProfileForm } from './EditProfileForm';

async function getUser(id: number): Promise<User> {
    return fetchApi(
        `/users/${id}/`,
        { cache: 'no-store' },
    );
}

const EditProfile: NextPage = async () => {
    const session = await auth();

    const user = await getUser(session!.user.cid);

    return <EditProfileForm user={user} />;
};

export default EditProfile;
