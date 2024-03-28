import React, { type HTMLProps } from 'react';
import classNames from 'classnames';

const colorVariants = {
    'gray-300': 'bg-gray-300 shadow-gray-300/25 dark:bg-zinc-700 dark:shadow-zinc-700/25',

    'red-400': 'bg-red-400 shadow-red-400/25',

    'amber-400': 'bg-amber-400 shadow-amber-400/25',

    'green-500': 'bg-green-500 shadow-green-500/25',

    'emerald-400': 'bg-emerald-400 shadow-emerald-400/25',
    'emerald-600': 'bg-emerald-600 shadow-emerald-600/25',
    'emerald-700': 'bg-emerald-800 shadow-emerald-700/25',

    'cyan-400': 'bg-cyan-400 shadow-cyan-400/25 dark:bg-cyan-500 dark:shadow-cyan-500/25',

    'sky-500': 'bg-sky-500 shadow-sky-500/25',
    'sky-900': 'bg-sky-900 shadow-sky-900/25',

    'indigo-500': 'bg-indigo-400 shadow-indigo-500/25',
};

export type BadgeColor = keyof typeof colorVariants;

interface BadgeProps extends Omit<HTMLProps<HTMLDivElement>, 'color'> {
    small?: boolean;
    color?: BadgeColor;
}

export const Badge: React.FC<BadgeProps> = ({
    small = false,
    color = 'sky-500',
    className,
    children,
}) => (
    <div
        className={classNames(
            'flex shrink-0 justify-center items-center font-semibold text-white whitespace-nowrap',
            {
                'min-w-[8rem] rounded-md text-sm py-1 px-3 shadow-sm': !small,
                'rounded-full text-xs py-0.5 px-2': small,
            },
            colorVariants[color],
            className,
        )}
    >
        {children}
    </div>
);
