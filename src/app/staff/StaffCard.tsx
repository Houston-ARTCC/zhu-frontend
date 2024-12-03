import React from 'react';
import { LuMail } from 'react-icons/lu';
import { Card } from '@/components/Card';
import { ProfilePicture } from '@/components/ProfilePicture';
import { type BasicUser } from '@/types/users';

interface StaffCardProps {
    user?: BasicUser;
    title: string;
    description?: string;
    email?: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({ user, title, description, email }) => (
    <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-5">
            <ProfilePicture user={user} size={70} />
            <div>
                <p className="text-2xl font-medium">
                    {user ? `${user.first_name} ${user.last_name}` : 'Vacant'}
                </p>
                <p className="text-slate-400">{title}</p>
            </div>
        </div>
        {email && (
            <a className="flex items-center gap-2 font-medium text-inherit" href={`mailto:${email}`}>
                <LuMail size={18} /> {email}
            </a>
        )}
        {description && (
            <p>{description}</p>
        )}
    </Card>
);
