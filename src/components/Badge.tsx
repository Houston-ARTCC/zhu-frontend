import React, { type HTMLProps } from 'react';
import classNames from 'classnames';

interface BadgeProps extends HTMLProps<HTMLDivElement> {
    small?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ small = false, className, children }) => (
    <div
        className={classNames(
            'flex shrink-0 justify-center items-center bg-sky-500 shadow-sky-500/25',
            'font-semibold text-white whitespace-nowrap',
            {
                'min-w-[8rem] rounded-md text-sm py-1 px-3 shadow-sm': !small,
                'rounded-full text-xs py-0.5 px-2': small,
            },
            className,
        )}
    >
        {children}
    </div>
);
