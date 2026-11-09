import 'dotenv/config';

import React from 'react';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersUser } from '@/lib/db/schema';
import { getStatistics } from '@/lib/connections/repository';
import { ActivityReminderEmail } from '@/lib/connections/emails/ActivityReminderEmail';
import { sendMail } from '@/lib/mailer/send';
import { FROM_MANAGEMENT } from '@/lib/mailer/transport';

const STATUS_ACTIVE = 0;

async function main(): Promise<void> {
    const { home, visiting } = await getStatistics();
    const inactiveCids = [...home, ...visiting].filter((stat) => !stat.quarter_active).map((stat) => stat.cid);

    // Controllers on LOA aren't reminded.
    const users = inactiveCids.length === 0 ? [] : await db
        .select({ cid: usersUser.cid, firstName: usersUser.firstName, email: usersUser.email, rating: usersUser.rating })
        .from(usersUser)
        .where(and(inArray(usersUser.cid, inactiveCids), eq(usersUser.status, STATUS_ACTIVE)));

    let errors = 0;

    for (const user of users) {
        try {
            await sendMail({
                to: user.email,
                from: FROM_MANAGEMENT,
                subject: 'Quarterly activity reminder',
                react: React.createElement(ActivityReminderEmail, {
                    user: { first_name: user.firstName, rating: user.rating },
                }),
            });
        } catch (err) {
            errors++;
            console.error('activity reminder failed for cid', user.cid, ':', err);
        }
    }

    console.log(`${new Date().toISOString()} :: notify-inactive-controllers :: sent=${users.length - errors} errors=${errors}`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
