import React, { type ButtonHTMLAttributes, type HTMLProps, type RefAttributes, useState } from 'react';
import Link, { type LinkProps as InternalLinkProps } from 'next/link';
import classNames from 'classnames';
import { LuChevronDown } from 'react-icons/lu';

export const DropdownButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
    <button
        className={classNames('rounded-md px-6 py-1 transition-colors duration-150 hover:bg-white/[.10]', className)}
        type="button"
        {...props}
    >
        {children}
    </button>
);

interface DropdownProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ title, className, children, ...props }) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="relative">
            <DropdownButton
                className={classNames('peer flex items-center gap-2', className)}
                onClick={() => setShow(!show)}
                type="button"
                {...props}
            >
                {title}
                <LuChevronDown />
            </DropdownButton>
            <div
                className={classNames(
                    'absolute left-1/2 mt-3 flex w-40 -translate-x-1/2 flex-col rounded-md bg-white py-1 shadow',
                    'invisible active:visible peer-focus:visible',
                )}
            >
                {children}
            </div>
        </div>
    );
};

type LinkProps = Omit<HTMLProps<HTMLAnchorElement>, keyof InternalLinkProps> & InternalLinkProps & RefAttributes<HTMLAnchorElement>;

export const DropdownItem: React.FC<LinkProps> = ({ className, children, ...props }) => (
    <Link className={classNames('px-4 py-1 whitespace-nowrap text-gray-900', className)} {...props}>
        {children}
    </Link>
);
