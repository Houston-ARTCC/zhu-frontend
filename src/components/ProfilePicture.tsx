import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { LuUser } from 'react-icons/lu';
import { type BasicUser } from '@/types/users';

interface ProfilePictureProps {
    user?: BasicUser;
    size: number;
    className?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, size, className }) => {
    if (user?.profile) {
        return (
            <Image
                className={classNames('rounded-full bg-slate-300', className)}
                src={`${process.env.NEXT_PUBLIC_API_URL}${user.profile}`}
                alt={`${user.first_name} ${user.last_name}`}
                height={size}
                width={size}
                unoptimized
            />
        );
    }

    return (
        <div
            className={classNames(
                'flex items-center justify-center rounded-full bg-slate-300 font-medium text-slate-600',
                className,
            )}
            style={{
                width: size,
                height: size,
                fontSize: size / 2,
            }}
        >
            {user ? user.initials : <LuUser />}
        </div>
    );
};
