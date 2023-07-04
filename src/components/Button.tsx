import { type ButtonHTMLAttributes, type HTMLProps } from 'react';
import React from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => (
    <button
        type="button"
        className={classNames(
            'flex items-center gap-2 shrink-0 justify-center rounded-md border-2 py-1.5 px-4',
            'font-medium whitespace-nowrap',
            {
                'shadow-sm shadow-sky-500/25 bg-sky-500 text-white': variant === 'primary',
                'border-sky-500': variant === 'secondary',
                'bg-transparent text-sky-500': variant === 'secondary' || variant === 'tertiary',
                'border-transparent': variant === 'primary' || variant === 'tertiary',
            },
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export const ButtonGroup: React.FC<HTMLProps<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div
        className={classNames(
            'flex [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button]:rounded-none',
            '[&>button:last-child]:border-r-2 [&>button]:border-r-0',
            className,
        )}
        {...props}
    >
        {children}
    </div>
);
