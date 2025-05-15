import { SESSION_LEVEL_STRING, SESSION_TYPE_STRING } from '@/types/training';

export const sessionTypes = Object.entries(SESSION_TYPE_STRING).map(([value, label]) => ({ value: Number(value), label }));

export const sessionLevels = Object.entries(SESSION_LEVEL_STRING).map(([value, label]) => ({ value: Number(value), label }));

export const otsStatuses = [
    { value: 0, label: 'N/A' },
    { value: 1, label: 'Passed' },
    { value: 2, label: 'Failed' },
    { value: 3, label: 'Recommended' },
];

export const progress = [
    { value: 1, label: 'No Progress' },
    { value: 2, label: 'Little Progress' },
    { value: 3, label: 'Average Progress' },
    { value: 4, label: 'Great Progress' },
    { value: 5, label: 'Exceptional Progress' },
];
