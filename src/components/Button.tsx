import React, { type ButtonHTMLAttributes, type HTMLProps } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => (
    <button
        type="button"
        className={classNames(
            'flex items-center gap-1.5 shrink-0 justify-center rounded-md py-1.5 px-4',
            'font-medium whitespace-nowrap transition-colors duration-200',
            'disabled:opacity-75 disabled:cursor-not-allowed',
            {
                'shadow-sm shadow-sky-500/25 bg-sky-500 text-white': variant === 'primary',
                'bg-sky-500/[.10] text-sky-500': variant === 'secondary',
                '!p-0 text-sky-500': variant === 'tertiary',
            },
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export const ButtonGroup: React.FC<HTMLProps<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={classNames('flex rounded-lg bg-white p-1', className)} {...props}>
        {children}
    </div>
);
