import { drizzle } from 'drizzle-orm/node-postgres';
import * as relations from './relations';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
}

function createDb(url: string) {
    return drizzle({
        schema: { ...schema, ...relations },
        connection: url,
        casing: 'snake_case',
    });
}

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof createDb> };

export const db = globalForDb.db ?? createDb(databaseUrl);

if (process.env.NODE_ENV !== 'production') {
    globalForDb.db = db;
}
