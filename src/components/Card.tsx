import React, { type HTMLProps } from 'react';
import classNames from 'classnames';

export const Card: React.FC<HTMLProps<HTMLDivElement>> = ({ className, onClick, children }) => (
    <div
        onClick={onClick}
        className={classNames(
            'rounded-md bg-white px-5 py-4 shadow transition-all duration-500 ease-out',
            {
                'cursor-pointer hover:-translate-y-2 hover:opacity-75 hover:shadow-lg': onClick,
            },
            className,
        )}
    >
        {children}
    </div>
);
