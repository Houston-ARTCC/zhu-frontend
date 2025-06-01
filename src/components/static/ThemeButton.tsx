'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { LuMoonStar, LuOrbit, LuSun } from 'react-icons/lu';
import { useTheme } from 'next-themes';
import { Dropdown, DropdownButton } from '../Dropdown';

interface ThemeButtonProps {
    className?: string;
}

export const ThemeButton: React.FC<ThemeButtonProps> = ({ className }) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevents themes from attempting to be accessed during SSR
    if (!mounted) {
        return null;
    }

    return (

        <Dropdown
            className={classNames('p-1.5!', className)}
            menuClassName="w-32!"
            hideArrow
            title={(
                <>
                    {theme === 'light' && <LuSun size={20} />}
                    {theme === 'dark' && <LuMoonStar size={20} />}
                    {theme === 'system' && <LuOrbit size={20} />}
                </>
            )}
        >
            <DropdownButton
                className={theme === 'light' ? 'text-sky-500' : undefined}
                onClick={(e) => {
                    setTheme('light');
                    e.currentTarget.blur();
                }}
            >
                <LuSun size={20} /> Light
            </DropdownButton>
            <DropdownButton
                className={theme === 'dark' ? 'text-sky-500' : undefined}
                onClick={(e) => {
                    setTheme('dark');
                    e.currentTarget.blur();
                }}
            >
                <LuMoonStar size={20} /> Dark
            </DropdownButton>
            <DropdownButton
                className={theme === 'system' ? 'text-sky-500' : undefined}
                onClick={(e) => {
                    setTheme('system');
                    e.currentTarget.blur();
                }}
            >
                <LuOrbit size={20} /> System
            </DropdownButton>
        </Dropdown>
    );
};
