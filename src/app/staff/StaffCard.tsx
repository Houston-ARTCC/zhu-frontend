import React from 'react';
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
    <Card>
        <div className="flex items-center gap-5">
            <ProfilePicture user={user} size={70} alt="Vacant" />
            <div>
                <p className="text-2xl font-medium">
                    {user ? `${user.first_name} ${user.last_name}` : 'Vacant'}
                </p>
                <p className="text-slate-400">{title}</p>
            </div>
        </div>
        {description && (
            <p className="mt-5">{description}</p>
        )}
    </Card>
);
