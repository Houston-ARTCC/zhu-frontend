'use client';

import React, { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { type EventSignup } from '@/types/events';

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
    setSlot: (shiftId: number, slot: ShiftSlot | null) => void;
}

const AssignmentsContext = createContext<Assignments | null>(null);

interface AssignmentsProviderProps {
    signups: EventSignup[];
}

export const AssignmentsProvider: React.FC<PropsWithChildren<AssignmentsProviderProps>> = ({ signups, children }) => {
    const [slots, setSlots] = useState<Map<number, ShiftSlot>>(new Map());

    const setSlot = useCallback((shiftId: number, slot: ShiftSlot | null) => {
        setSlots((prev) => {
            const next = new Map(prev);
            if (slot) {
                next.set(shiftId, slot);
            } else {
                next.delete(shiftId);
            }
            return next;
        });
    }, []);

    const signupsByCid = useMemo(() => new Map(signups.map((signup) => [signup.cid, signup])), [signups]);

    const value = useMemo(() => ({ signups: signupsByCid, slots, setSlot }), [signupsByCid, slots, setSlot]);

    return <AssignmentsContext.Provider value={value}>{children}</AssignmentsContext.Provider>;
};

export const useAssignments = () => useContext(AssignmentsContext)!;

export const formatScore = (score: number | null) => (score === null ? '-' : `${Math.round(score)}%`);
