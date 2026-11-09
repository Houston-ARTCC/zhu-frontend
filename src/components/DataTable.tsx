'use client';

import React, { useSyncExternalStore } from 'react';
import ReactDataTable, { type TableProps } from 'react-data-table-component';
import { useTheme } from 'next-themes';

const subscribe = () => () => undefined;

// Browser-only: cells format dates in the viewer's timezone, so server-rendered tables never match
// and React throws the whole page away.
export const DataTable = <T,>(props: TableProps<T>) => {
    const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
    const { resolvedTheme } = useTheme();

    if (!hydrated) return null;

    return <ReactDataTable headerSeparator={false} colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'} {...props} />;
};
