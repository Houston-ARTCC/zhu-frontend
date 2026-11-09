import 'server-only';
import { and, ne } from 'drizzle-orm';
import { type PgDatabase } from 'drizzle-orm/pg-core';
import { db as defaultDb } from '@/lib/db';
import { usersUser } from '@/lib/db/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = PgDatabase<any, any, any>;

const NON_MEMBER = 2;

export function base26decode(str: string): number {
    let n = 0;
    for (let pos = 0; pos < str.length; pos++) {
        n += (str.charCodeAt(pos) - 65) * 26 ** (str.length - pos - 1);
    }
    return n;
}

export function base26encode(int: number): string {
    let n = int;
    let str = '';
    while (n > 25) {
        const r = n % 26;
        n = Math.floor(n / 26);
        str = String.fromCharCode(r + 65) + str;
    }
    str = String.fromCharCode(n + 65) + str;
    return str;
}

// Cycles through letter pairs until an unused one is found.
export async function getInitials(
    cid: number,
    firstName: string,
    lastName: string,
    dbOrTx: Database = defaultDb,
): Promise<string> {
    let initials = (firstName[0] + lastName[0]).toUpperCase();

    const takenRows = await dbOrTx
        .select({ initials: usersUser.initials })
        .from(usersUser)
        .where(and(ne(usersUser.status, NON_MEMBER), ne(usersUser.cid, cid)));
    const taken = new Set(
        takenRows.map((row) => row.initials).filter((v): v is string => v !== null),
    );

    while (taken.has(initials)) {
        const next = base26decode(initials) + 1;
        initials = base26encode(next <= 675 ? next : 0);
    }

    return initials.padStart(2, 'A');
}
