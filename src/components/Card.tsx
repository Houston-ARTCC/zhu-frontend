import React, { type HTMLProps } from 'react';
import classNames from 'classnames';

interface CardProps extends HTMLProps<HTMLDivElement> {
    interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, interactive, children, ...props }) => (
    <div
        className={classNames(
            'rounded-md bg-white p-5 shadow transition-all duration-500 ease-out',
            { 'cursor-pointer hover:-translate-y-2 hover:opacity-90 hover:shadow-lg': interactive },
            className,
        )}
        {...props}
    >
        {children}
    </div>
);
