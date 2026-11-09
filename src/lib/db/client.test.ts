import { sql } from 'drizzle-orm';
import { expect, test } from 'vitest';
import { db } from './client';

test('db client connects and runs a query', async () => {
    const result = await db.execute(sql`select 1 as ok`);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].ok).toBe(1);
});
