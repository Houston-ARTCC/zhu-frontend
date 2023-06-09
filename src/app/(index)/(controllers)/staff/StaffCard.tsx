import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { type BasicUser } from '@/types/users';

interface StaffCardProps {
    user: BasicUser | null;
    title: string;
    description?: string;
    email?: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({ user, title, description, email }) => (
    <Card>
        <div className="flex items-center gap-5">
            <Image
                className="rounded-full bg-slate-300"
                src={user ? `https://api.zhuartcc.org${user?.profile}` : '/img/profile.png'}
                alt={user ? `${user.first_name} ${user.last_name}` : 'Vacant'}
                height={70}
                width={70}
            />
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
