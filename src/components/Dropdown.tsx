import React, { type ButtonHTMLAttributes, type HTMLProps, type ReactNode, type RefAttributes } from 'react';
import Link, { type LinkProps as InternalLinkProps } from 'next/link';
import classNames from 'classnames';
import { LuChevronDown } from 'react-icons/lu';

const DropdownToggle: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
    <button
        className={classNames('rounded-md px-6 py-1 transition-colors duration-150 hover:bg-white/[.10]', className)}
        type="button"
        {...props}
    >
        {children}
    </button>
);

interface DropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
    title: ReactNode;
    hideArrow?: boolean;
    menuClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ title, hideArrow = false, className, menuClassName, children, ...props }) => (
    <div className="relative">
        <DropdownToggle
            className={classNames('peer flex items-center gap-2', className)}
            type="button"
            {...props}
        >
            {title}
            {!hideArrow && <LuChevronDown />}
        </DropdownToggle>
        <div
            className={classNames(
                'absolute left-1/2 mt-3 flex w-40 -translate-x-1/2 flex-col rounded-md bg-white py-1 shadow z-10',
                'invisible active:visible peer-focus:visible dark:bg-zinc-850 dark:shadow-stone-900',
                menuClassName,
            )}
        >
            {children}
        </div>
    </div>
);

type LinkProps = Omit<HTMLProps<HTMLAnchorElement>, keyof InternalLinkProps> & InternalLinkProps & RefAttributes<HTMLAnchorElement>;

export const DropdownItem: React.FC<LinkProps> = ({ className, children, ...props }) => (
    <Link prefetch={false} className={classNames('px-4 py-1 whitespace-nowrap text-inherit', className)} {...props}>
        {children}
    </Link>
);

export const DropdownButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
    <button
        type="button"
        className={classNames(
            'px-4 py-1 flex items-center gap-2 whitespace-nowrap text-inherit text-left',
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export const DropdownSeparator: React.FC = () => <hr className="my-1" />;
