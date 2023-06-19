import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { type BasicUser } from '@/types/users';

interface ProfilePictureProps {
    user?: BasicUser;
    alt?: string;
    size: number;
    className?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, size, alt = '', className }) => (
    <Image
        className={classNames('rounded-full bg-slate-300', className)}
        src={user ? `${process.env.NEXT_PUBLIC_API_URL}${user.profile}` : '/img/profile.png'}
        alt={user ? `${user?.first_name} ${user?.last_name}` : alt}
        height={size}
        width={size}
    />
);
