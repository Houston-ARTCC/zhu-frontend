'use client';

import React, { type PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { LuX } from 'react-icons/lu';
import usePresence from 'use-presence';
import { Card } from '@/components/Card';
import { Button, type ButtonProps } from '@/components/Button';

export interface ModalProps extends PropsWithChildren {
    show?: boolean;
    title?: string;
    large?: boolean;
    close?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ show = false, title, large, close, children }) => {
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

    if (!isMounted) {
        return null;
    }

    return (
        <div
            className={classNames(
                'fixed inset-x-0 top-0 z-20 h-screen w-screen bg-black/40 transition-opacity duration-250 opacity-0',
                { 'opacity-0': !isVisible, 'opacity-100': isVisible },
            )}
        >
            <Card
                className={classNames(
                    'mx-auto mt-40 transition-transform duration-250 ease-out',
                    { 'max-w-lg': !large, 'max-w-4xl': large, '-translate-y-10': !isVisible, 'translate-y-0': isVisible },
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <FocusTrap>
                    <section>
                        {title && (
                            <div className="-m-5 mb-5 flex items-center rounded-t-md bg-slate-100 px-5 py-4">
                                <h4 className="text-2xl font-medium">{title}</h4>
                                {close && (
                                    <button className="ml-auto" type="button" onClick={close}>
                                        <LuX size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                        {children}
                    </section>
                </FocusTrap>
            </Card>
        </div>
    );
};

interface ModalButtonProps extends ButtonProps {
    modal: React.FC<ModalProps>;
}

export const ModalButton: React.FC<ModalButtonProps> = ({ modal: ModalComponent, children, ...props }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} {...props}>
                {children}
            </Button>
            {ReactDOM.createPortal(
                <ModalComponent show={open} close={() => setOpen(false)} />,
                document.body,
            )}
        </>
    );
};
