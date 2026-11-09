import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
    out: './drizzle',
    schema: './src/lib/db/schema.ts',
    dialect: 'postgresql',
    casing: 'snake_case',
    dbCredentials: {
        url: databaseUrl,
    },
});
