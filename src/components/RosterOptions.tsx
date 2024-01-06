'use client';

import React, { type ComponentType, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TextInput } from '@/components/Forms';
import { Button, ButtonGroup } from '@/components/Button';
import type { BasicUser, Roster } from '@/types/users';

interface RosterOptionsProps<T extends BasicUser> {
    data: Roster<T>;
    component: ComponentType<{ data: T[] }>
}

export const RosterOptions = <T extends BasicUser>({ data, component: Component }: RosterOptionsProps<T>) => {
    const [searchString, setSearchString] = useState<string>('');
    const [filter, setFilter] = useState<'home' | 'visiting' | 'mavp' | 'all'>('home');

    const controllers = useMemo(() => {
        if (filter === 'home') return data.home;
        if (filter === 'visiting') return data.visiting;
        if (filter === 'mavp') return data.mavp;
        return data.home.concat(data.visiting).concat(data.mavp);
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
            <div className="mb-5 flex items-center justify-between">
                <TextInput placeholder="Search for controller..." onUpdate={setSearchString} />
                <ButtonGroup>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'home' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('home')}
                    >
                        Home
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'visiting' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('visiting')}
                    >
                        Visiting
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'mavp' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('mavp')}
                    >
                        MAVP
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'all' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </div>
            <Component data={users} />
        </>
    );
};
