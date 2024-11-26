import React from 'react';
import type { NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { fetchApi } from '@/utils/fetch';
import { authOptions } from '@/utils/auth';
import { type User } from '@/types/users';
import { EditProfileForm } from './EditProfileForm';

async function getUser(id: number): Promise<User> {
    return fetchApi(
        `/users/${id}/`,
        { cache: 'no-store' },
    );
}

const EditProfile: NextPage = async () => {
    const session = await getServerSession(authOptions);

    const user = await getUser(session!.user.cid);

    return <EditProfileForm user={user} />;
};

export default EditProfile;
