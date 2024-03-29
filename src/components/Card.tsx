import React, { type HTMLProps } from 'react';
import classNames from 'classnames';

interface CardProps extends HTMLProps<HTMLDivElement> {
    interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, interactive, children, ...props }) => (
    <div
        className={classNames(
            'rounded-md bg-white px-5 py-4 shadow transition-all duration-500 ease-out overflow-clip',
            'dark:bg-zinc-850 dark:shadow-stone-900',
            { 'cursor-pointer hover:-translate-y-1 hover:opacity-90 hover:shadow-lg': interactive },
            className,
        )}
        {...props}
    >
        {children}
    </div>
);
