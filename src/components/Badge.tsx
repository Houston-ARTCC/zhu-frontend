import { type HTMLProps } from 'react';
import React from 'react';
import classNames from 'classnames';

export const Badge: React.FC<HTMLProps<HTMLDivElement>> = ({ className, children }) => (
    <div
        className={classNames(
            'flex w-32 shrink-0 justify-center rounded-md bg-sky-500 py-1 text-sm font-semibold text-white shadow-sm shadow-sky-500/25',
            className,
        )}
    >
        {children}
    </div>
);
