'use client';

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { LuGrip, LuTable } from 'react-icons/lu';
import { TextInput } from '@/components/Forms';
import { Button, ButtonGroup } from '@/components/Button';
import { type Roster } from '@/types/users';
import { CardsView } from './CardsView';
import { TableView } from './TableView';

interface RosterOptionsProps {
    data: Roster;
}

export const RosterOptions: React.FC<RosterOptionsProps> = ({ data }) => {
    const [searchString, setSearchString] = useState<string>('');
    const [filter, setFilter] = useState<'home' | 'visiting' | 'mavp' | 'all'>('home');
    const [tableView, setTableView] = useState<boolean>(false);

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
            <div className="mb-5 grid grid-cols-3">
                <div className="flex items-center justify-start">
                    <TextInput placeholder="Search for controller..." onUpdate={setSearchString} />
                </div>
                <div className="flex justify-center">
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
                <div className="flex justify-end">
                    <ButtonGroup>
                        <Button
                            className={classNames(
                                'py-0.5 transition-colors duration-150',
                                { '!bg-white !text-gray-500': tableView },
                            )}
                            variant="secondary"
                            onClick={() => setTableView(false)}
                        >
                            <LuGrip />
                            Cards
                        </Button>
                        <Button
                            className={classNames(
                                'py-0.5 transition-colors duration-150',
                                { '!bg-white !text-gray-500': !tableView },
                            )}
                            variant="secondary"
                            onClick={() => setTableView(true)}
                        >
                            <LuTable />
                            Table
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
            {tableView
                ? <TableView data={users} />
                : <CardsView data={users} />}
        </>
    );
};
