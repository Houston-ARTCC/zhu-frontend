'use client';

import React, { useSyncExternalStore } from 'react';
import ReactDataTable, { type TableProps } from 'react-data-table-component';

const subscribe = () => () => undefined;

// Browser-only: pagination is sized from window.innerWidth and cells format dates in the viewer's timezone,
// so server-rendered tables never match and React throws the whole page away.
export const DataTable = <T,>(props: TableProps<T>) => {
    const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

    if (!hydrated) return null;

    return <ReactDataTable {...props} />;
};
