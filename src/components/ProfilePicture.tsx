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

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, size, alt = '', className }) => {
    if (!user) {
        return (
            <Image
                className={classNames('rounded-full bg-slate-300', className)}
                src="/img/profile.png"
                alt={alt}
                height={size}
                width={size}
            />
        );
    }

    if (!user.profile) {
        return (
            <div
                className={classNames(
                    'flex items-center justify-center rounded-full bg-slate-300',
                    className,
                )}
                style={{
                    width: size,
                    height: size,
                    fontSize: size / 2,
                }}
            >
                <span className="font-medium text-slate-600">{user.initials}</span>
            </div>
        );
    }

    return (
        <Image
            className={classNames('rounded-full bg-slate-300', className)}
            src={`${process.env.NEXT_PUBLIC_API_URL}${user.profile}`}
            alt={`${user.first_name} ${user.last_name}`}
            height={size}
            width={size}
        />
    );
};
