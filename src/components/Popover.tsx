import React, { type PropsWithChildren, type ReactNode } from 'react';
import classNames from 'classnames';

interface PopoverProps extends PropsWithChildren {
    title: ReactNode;
    contents: ReactNode;
    className?: string;
}

export const Popover: React.FC<PopoverProps> = ({ title, contents, className, children }) => (
    <div className={classNames('relative', className)}>
        <div className="peer">
            {children}
        </div>
        <div
            className={classNames(
                'absolute left-1/2 mt-3 min-w-[10rem] -translate-x-1/2 rounded-md bg-white shadow overflow-hidden z-10',
                'pointer-events-none opacity-0 transition-opacity duration-200',
                'peer-hover:opacity-100 dark:bg-zinc-800 dark:!shadow-stone-950',
            )}
        >
            <div className="bg-gray-200 px-3 py-1 font-semibold dark:bg-zinc-900">
                {title}
            </div>
            <div className="px-3 py-1">
                {contents}
            </div>
        </div>
    </div>
);
