import React, { type ButtonHTMLAttributes, type HTMLProps, type ReactNode, type RefAttributes } from 'react';
import Link, { type LinkProps as InternalLinkProps } from 'next/link';
import classNames from 'classnames';
import { LuChevronDown } from 'react-icons/lu';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface DropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
    title: ReactNode;
    hideArrow?: boolean;
    menuClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ title, hideArrow = false, className, menuClassName, children, ...props }) => (
    <Menu as="div" className="relative">
        <MenuButton
            className={classNames(
                'flex items-center gap-2 rounded-md px-6 py-1',
                'transition-colors duration-150 hover:bg-white/[.10] data-active:bg-white/[.10]',
                className,
            )}
            {...props}
        >
            {title}
            {!hideArrow && <LuChevronDown />}
        </MenuButton>
        <MenuItems
            className={classNames(
                'absolute right-0 mt-3 flex w-40 flex-col rounded-md bg-white py-1 shadow z-10',
                'focus:outline-hidden dark:bg-zinc-850 dark:shadow-stone-900',
                menuClassName,
            )}
            unmount={false}
            modal={false}
        >
            {children}
        </MenuItems>
    </Menu>
);

type LinkProps = Omit<HTMLProps<HTMLAnchorElement>, keyof InternalLinkProps> & InternalLinkProps & RefAttributes<HTMLAnchorElement>;

export const DropdownItem: React.FC<LinkProps> = ({ className, children, ...props }) => (
    <MenuItem>
        <Link prefetch={false} className={classNames('whitespace-nowrap px-4 py-1 text-inherit', className)} {...props}>
            {children}
        </Link>
    </MenuItem>
);

export const DropdownButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
    <MenuItem>
        <button
            type="button"
            className={classNames(
                'flex items-center gap-2 whitespace-nowrap px-4 py-1 text-left text-inherit transition-opacity hover:opacity-75',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    </MenuItem>
);

export const DropdownSeparator: React.FC = () => <hr className="my-1" />;
