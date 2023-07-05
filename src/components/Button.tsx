import { type ButtonHTMLAttributes, type HTMLProps } from 'react';
import React from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => (
    <button
        type="button"
        className={classNames(
            'flex items-center gap-2 shrink-0 justify-center rounded-md py-1.5 px-4',
            'font-medium whitespace-nowrap',
            {
                'shadow-sm shadow-sky-500/25 bg-sky-500 text-white': variant === 'primary',
                'bg-sky-500/[.10] text-sky-500': variant === 'secondary',
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
        className={classNames('flex rounded-lg bg-white p-1', className)}
        {...props}
    >
        {children}
    </div>
);
