import React, { type ButtonHTMLAttributes, type HTMLProps } from 'react';
import classNames from 'classnames';

const colorVariants = {
    'white': {
        primary: '',
        secondary: 'bg-white text-gray-500 dark:bg-zinc-800 dark:text-zinc-400',
        tertiary: '',
    },

    'gray-300': {
        primary: 'bg-gray-300 shadow-gray-300/25 dark:bg-zinc-700 dark:shadow-zinc-700/25',
        secondary: 'bg-gray-300/10 text-gray-300',
        tertiary: 'text-gray-300',
    },

    'red-400': {
        primary: 'bg-red-400 shadow-red-400/25',
        secondary: 'bg-red-400/10 text-red-400',
        tertiary: 'text-red-400',
    },

    'green-500': {
        primary: 'bg-green-500 shadow-green-500/25',
        secondary: 'bg-green-500/10 text-green-500',
        tertiary: 'text-green-500',
    },

    'sky-500': {
        primary: 'bg-sky-500 shadow-sky-500/25',
        secondary: 'bg-sky-500/10 text-sky-500',
        tertiary: 'text-sky-500',
    },

    'indigo-400': {
        primary: 'bg-indigo-400 shadow-indigo-400/25',
        secondary: 'bg-indigo-400/10 text-indigo-400',
        tertiary: 'text-indigo-400',
    },
};

export type ButtonColor = keyof typeof colorVariants;

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    variant?: 'primary' | 'secondary' | 'tertiary';
    color?: ButtonColor;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    color = 'sky-500',
    className,
    children,
    ...props
}) => (
    <button
        type="button"
        className={classNames(
            'flex items-center gap-1.5 shrink-0 justify-center rounded-md py-1.5 px-4',
            'font-medium whitespace-nowrap transition-colors duration-200',
            'disabled:opacity-75 disabled:cursor-not-allowed',
            {
                [colorVariants[color].primary]: variant === 'primary',
                'shadow-sm text-white': variant === 'primary',

                [colorVariants[color].secondary]: variant === 'secondary',

                [colorVariants[color].tertiary]: variant === 'tertiary',
                'p-0!': variant === 'tertiary',
            },
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export const ButtonGroup: React.FC<HTMLProps<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={classNames('p-1 flex rounded-lg bg-white dark:bg-zinc-800', className)} {...props}>
        {children}
    </div>
);
