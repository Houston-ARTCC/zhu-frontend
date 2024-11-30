'use client';

import React, { type ComponentType, useMemo, useState } from 'react';
import { TextInput } from '@/components/Forms';
import { Button, ButtonGroup } from '@/components/Button';
import type { BasicUser, Roster } from '@/types/users';

type RosterOptionsProps<T extends BasicUser, P extends Record<string, unknown>> = P & {
    data: Roster<T>;
    component: ComponentType<Omit<P, 'data' | 'component'> & { data: T[] }>;
}

export const RosterOptions = <T extends BasicUser, P extends Record<string, unknown>>({
    data,
    component: Component,
    ...props
}: RosterOptionsProps<T, P>) => {
    const [searchString, setSearchString] = useState<string>('');
    const [filter, setFilter] = useState<'home' | 'visiting' | 'all'>('home');

    const controllers = useMemo(() => {
        if (filter === 'home') return data.home;
        if (filter === 'visiting') return data.visiting;
        return data.home.concat(data.visiting);
    }, [data, filter]);

    const users = useMemo(() => (
        controllers
            .filter((row) => (
                `${row.first_name} ${row.last_name} (${row.initials})`.toLowerCase().includes(searchString.toLowerCase())
                || row.cid.toString().includes(searchString)
            ))
    ), [controllers, searchString]);

    return (
        <>
            <div className="mb-5 flex flex-col items-center justify-between gap-5 md:flex-row">
                <TextInput placeholder="Search for controller..." onUpdate={setSearchString} />
                <ButtonGroup>
                    <Button
                        color={filter === 'home' ? 'sky-500' : 'white'}
                        className="py-0.5 transition-colors duration-150"
                        variant="secondary"
                        onClick={() => setFilter('home')}
                    >
                        Home
                    </Button>
                    <Button
                        color={filter === 'visiting' ? 'sky-500' : 'white'}
                        className="py-0.5 transition-colors duration-150"
                        variant="secondary"
                        onClick={() => setFilter('visiting')}
                    >
                        Visiting
                    </Button>
                    <Button
                        color={filter === 'all' ? 'sky-500' : 'white'}
                        className="py-0.5 transition-colors duration-150"
                        variant="secondary"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </div>
            <Component data={users} {...props} />
        </>
    );
};
