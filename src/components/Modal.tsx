'use client';

import React, { type PropsWithChildren, type ReactElement, type ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { LuX } from 'react-icons/lu';
import usePresence from 'use-presence';
import { Card } from '@/components/Card';
import { Button, type ButtonProps } from '@/components/Button';
import { ClientPortal } from './ClientPortal';

export interface ModalProps extends PropsWithChildren {
    show?: boolean;
    title?: string;
    footer?: ReactNode;
    large?: boolean;
    close?: () => void;
    onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ show = false, title, footer, large, close, onClose, children }) => {
    const { isMounted, isVisible } = usePresence(show, { transitionDuration: 250 });

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close?.();
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [close]);

    useEffect(() => {
        if (!isMounted) {
            onClose?.();
        }
    }, [isMounted, onClose]);

    if (!isMounted) {
        return null;
    }

    return (
        <div
            className={classNames(
                'fixed inset-x-0 top-0 z-20 h-screen w-screen bg-black/40 transition-opacity duration-250 opacity-0 overflow-y-scroll',
                { 'opacity-0': !isVisible, 'opacity-100': isVisible },
            )}
        >
            <Card
                className={classNames(
                    '!p-0 mx-auto mt-[10vh] transition-transform duration-250 ease-out mb-20',
                    { 'max-w-lg': !large, 'max-w-3xl': large, '-translate-y-10': !isVisible, 'translate-y-0': isVisible },
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <FocusTrap>
                    <section>
                        {title && (
                            <div className="flex items-center rounded-t-md bg-slate-100 px-5 py-4">
                                <h4 className="text-2xl font-medium">{title}</h4>
                                {close && (
                                    <button
                                        className="ml-auto"
                                        type="button"
                                        onClick={close}
                                        aria-label="Close Modal"
                                    >
                                        <LuX size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="p-5">
                            {children}
                        </div>
                        {footer && (
                            <div className="flex items-center rounded-b-md bg-slate-50 px-5 py-4">
                                {footer}
                            </div>
                        )}
                    </section>
                </FocusTrap>
            </Card>
        </div>
    );
};

interface ModalButtonProps extends ButtonProps {
    modal: ReactElement<ModalProps>;
}

export const ModalButton: React.FC<ModalButtonProps> = ({ modal, children, ...props }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} {...props}>
                {children}
            </Button>
            <ClientPortal>
                {React.cloneElement(modal, { show: open, close: () => setOpen(false) })}
            </ClientPortal>
        </>
    );
};
