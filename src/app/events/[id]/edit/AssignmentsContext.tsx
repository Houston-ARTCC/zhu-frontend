'use client';

import React, { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import { type EventPosition, type EventSignup } from '@/types/events';

export interface ShiftSlot {
    callsign: string;
    index: number;
    count: number;
    cid: number | null;
}

// Shifts split the event evenly, so slot i of n covers [i/n, (i+1)/n) of it.
export const overlaps = (a: Omit<ShiftSlot, 'callsign' | 'cid'>, b: Omit<ShiftSlot, 'callsign' | 'cid'>) => (
    a.index * b.count < (b.index + 1) * a.count && b.index * a.count < (a.index + 1) * b.count
);

interface Assignments {
    signups: Map<number, EventSignup>;
    slots: Map<number, ShiftSlot>;
}

const AssignmentsContext = createContext<Assignments | null>(null);

interface AssignmentsProviderProps {
    signups: EventSignup[];
    positions: EventPosition[];
}

export const AssignmentsProvider: React.FC<PropsWithChildren<AssignmentsProviderProps>> = ({ signups, positions, children }) => {
    const value = useMemo(() => ({
        signups: new Map(signups.map((signup) => [signup.cid, signup])),
        slots: new Map(positions.flatMap((position) => position.shifts.map((shift, index): [number, ShiftSlot] => [
            shift.id,
            { callsign: position.callsign, index, count: position.shifts.length, cid: shift.user?.cid ?? null },
        ]))),
    }), [signups, positions]);

    return <AssignmentsContext.Provider value={value}>{children}</AssignmentsContext.Provider>;
};

export const useAssignments = () => useContext(AssignmentsContext)!;

export const formatScore = (score: number | null) => (score === null ? '-' : `${Math.round(score)}%`);
