import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdCircle } from 'react-icons/md';
import { Card } from '@/components/Card';
import { type User } from '@/types/users';

const RATING_COLOR = ['fill-slate-200', 'fill-amber-300', 'fill-green-400', 'fill-red-400'];

interface RosterCardProps {
    user: User;
}

export const RosterCard: React.FC<RosterCardProps> = ({ user }) => (
    <Link href={`/roster/${user.cid}`} className="text-inherit">
        <Card interactive>
            <div className="-m-5 mb-5 flex flex-col items-center gap-5 bg-gray-50 p-5">
                <Image
                    className="rounded-full bg-slate-300"
                    src={user ? `https://api.zhuartcc.org${user?.profile}` : '/img/profile.png'}
                    alt={user ? `${user.first_name} ${user.last_name}` : 'Vacant'}
                    height={70}
                    width={70}
                />
                <div>
                    <h4 className="text-xl font-medium">{user.first_name} {user.last_name} ({user.initials})</h4>
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
                    <MdCircle size={20} className={RATING_COLOR[user.del_cert]} />
                    <span className="text-sm">DEL</span>
                </div>
                <div className="flex flex-col items-center">
                    <MdCircle size={20} className={RATING_COLOR[user.gnd_cert]} />
                    <span className="text-sm">GND</span>
                </div>
                <div className="flex flex-col items-center">
                    <MdCircle size={20} className={RATING_COLOR[user.twr_cert]} />
                    <span className="text-sm">TWR</span>
                </div>
                <div className="flex flex-col items-center">
                    <MdCircle size={20} className={RATING_COLOR[user.app_cert]} />
                    <span className="text-sm">APP</span>
                </div>
                <div className="flex flex-col items-center">
                    <MdCircle size={20} className={RATING_COLOR[user.ctr_cert]} />
                    <span className="text-sm">CTR</span>
                </div>
                <div className="flex flex-col items-center">
                    <MdCircle size={20} className={RATING_COLOR[user.ocn_cert]} />
                    <span className="text-sm">OCN</span>
                </div>
            </div>
        </Card>
    </Link>
);
