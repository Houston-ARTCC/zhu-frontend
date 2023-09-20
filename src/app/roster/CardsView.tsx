'use client';

import React from 'react';
import { type User } from '@/types/users';
import { RosterCard } from './RosterCard';

const SECTIONS = {
    oceanic: 'Oceanic',
    center: 'Center',
    approach: 'Approach',
    tower: 'Tower',
    ground: 'Ground',
    delivery: 'Delivery',
    observer: 'Observer',
};

interface CardsViewProps {
    data: User[];
}

export const CardsView: React.FC<CardsViewProps> = ({ data }) => {
    const levels: { [key in keyof typeof SECTIONS]: User[] } = {
        oceanic: [],
        center: [],
        approach: [],
        tower: [],
        ground: [],
        delivery: [],
        observer: [],
    };

    data.forEach((user) => {
        if (user.ocn_cert) levels.oceanic.push(user);
        else if (user.ctr_cert) levels.center.push(user);
        else if (user.app_cert) levels.approach.push(user);
        else if (user.twr_cert) levels.tower.push(user);
        else if (user.gnd_cert) levels.ground.push(user);
        else if (user.del_cert) levels.delivery.push(user);
        else levels.observer.push(user);
    });

    return (
        <>
            {Object.entries(SECTIONS).map(([key, header]) => (
                levels[key as keyof typeof SECTIONS].length ? (
                    <>
                        <h2 className="mb-8 text-center text-4xl font-medium">{header}</h2>
                        <div className="mb-16 grid grid-cols-4 gap-5">
                            {levels[key as keyof typeof SECTIONS]
                                .sort((a: User, b: User) => (
                                    a.first_name.localeCompare(b.first_name)
                                    || a.last_name.localeCompare(b.last_name)
                                ))
                                .map((user) => <RosterCard key={user.cid} user={user} />)}
                        </div>
                    </>
                ) : null
            ))}
        </>
    );
};
