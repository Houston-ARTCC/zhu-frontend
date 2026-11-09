import { z } from 'zod';

// Zod 4's default messages ("Invalid input: expected object, received undefined") show up in forms, so missing values say "Required".
z.config({
    customError: (issue) => {
        if (issue.code !== 'invalid_type') return undefined;
        if (issue.input === undefined || issue.input === null) return 'Required';
        if (issue.input instanceof Date && Number.isNaN(issue.input.getTime())) return 'Required';
        return undefined;
    },
});
