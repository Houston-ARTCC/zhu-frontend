import { type ButtonHTMLAttributes } from 'react';
import React from 'react';
import classNames from 'classnames';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => (
    <button
        type="button"
        className={classNames(
            'flex items-center gap-2 shrink-0 justify-center rounded-md bg-sky-500 py-1.5 px-4 shadow-sm shadow-sky-500/25',
            'font-medium text-white whitespace-nowrap',
            className,
        )}
        {...props}
    >
        {children}
    </button>
);
