import React from 'react';
import Link from 'next/link';
import { CertCircle } from '@/components/ProfileBadges';
import { Card } from '@/components/Card';
import { ProfilePicture } from '@/components/ProfilePicture';
import { type User } from '@/types/users';

interface RosterCardProps {
    user: User;
}

export const RosterCard: React.FC<RosterCardProps> = ({ user }) => (
    <Link prefetch={false} href={`/roster/${user.cid}`} className="text-inherit">
        <Card interactive>
            <div className="-m-5 mb-5 flex flex-col items-center gap-5 bg-gray-50 p-5">
                <ProfilePicture user={user} size={70} />
                <div>
                    <h4 className="text-center text-xl font-medium">{user.first_name} {user.last_name} ({user.initials})</h4>
                </div>
            </div>
            <div className="mb-5 grid grid-cols-2">
                <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">{user.cid}</p>
                    <p>CID</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">{user.rating.short}</p>
                    <p>Rating</p>
                </div>
            </div>
            <div className="grid grid-cols-6">
                <div className="flex flex-col items-center">
                    <CertCircle cert={user.del_cert} />
                    <span className="text-sm">DEL</span>
                </div>
                <div className="flex flex-col items-center">
                    <CertCircle cert={user.gnd_cert} />
                    <span className="text-sm">GND</span>
                </div>
                <div className="flex flex-col items-center">
                    <CertCircle cert={user.twr_cert} />
                    <span className="text-sm">TWR</span>
                </div>
                <div className="flex flex-col items-center">
                    <CertCircle cert={user.app_cert} />
                    <span className="text-sm">APP</span>
                </div>
                <div className="flex flex-col items-center">
                    <CertCircle cert={user.ctr_cert} />
                    <span className="text-sm">CTR</span>
                </div>
                <div className="flex flex-col items-center">
                    <CertCircle cert={user.ocn_cert} />
                    <span className="text-sm">OCN</span>
                </div>
            </div>
        </Card>
    </Link>
);