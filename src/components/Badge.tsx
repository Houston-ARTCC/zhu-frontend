import { type HTMLProps } from 'react';
import React from 'react';
import classNames from 'classnames';

export const Badge: React.FC<HTMLProps<HTMLDivElement>> = ({ className, children }) => (
    <div
        className={classNames(
            'flex min-w-[8rem] shrink-0 justify-center rounded-md bg-sky-500 py-1 px-3 shadow-sm shadow-sky-500/25',
            'text-sm font-semibold text-white whitespace-nowrap',
            className,
        )}
    >
        {children}
    </div>
);
