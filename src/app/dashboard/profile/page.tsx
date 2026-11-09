import React from 'react';
import { notFound } from 'next/navigation';
import type { NextPage } from 'next';
import { requireMember } from '@/lib/auth/guards';
import { getAuthenticatedUserById } from '@/lib/users/repository';
import { EditProfileForm } from './EditProfileForm';

const EditProfile: NextPage = async () => {
    const session = await requireMember();

    const user = await getAuthenticatedUserById(session.user.cid);
    if (!user) notFound();

    return <EditProfileForm user={user} />;
};

export default EditProfile;
