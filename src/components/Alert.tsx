import React, { type HTMLProps, type PropsWithChildren } from 'react';
import { type IconType } from 'react-icons';
import classNames from 'classnames';

const colorVariants = {
    'sky-500': 'bg-sky-500/10 text-sky-500',

    'indigo-500': 'bg-indigo-500/10 text-indigo-500',

    'green-500': 'bg-green-500/10 text-green-500',

    'amber-500': 'bg-amber-500/10 text-amber-500',

    'red-500': 'bg-red-500/10 text-red-500',
};

export type AlertColor = keyof typeof colorVariants;

interface AlertProps extends Omit<HTMLProps<HTMLDivElement>, 'color'> {
    color: AlertColor;
    icon: IconType;
}

export const AlertTitle: React.FC<PropsWithChildren> = ({ children }) => (
    <h4 className="mb-0.5 text-2xl font-medium">{children}</h4>
);

export const Alert: React.FC<AlertProps> = ({ color, icon: Icon, className, children }) => (
    <div
        className={classNames(
            'rounded-md p-5 md:pl-7 md:pr-10',
            colorVariants[color],
            className,
        )}
    >
        <div className="flex gap-3">
            <div className="pt-1">
                <Icon size={25} />
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
);
