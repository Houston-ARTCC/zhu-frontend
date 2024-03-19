'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const ClientPortal: React.FC<PropsWithChildren> = ({ children }) => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevents portals from attempting to be created during SSR
    if (!mounted) {
        return null;
    }

    return createPortal(children, document.body);
};
