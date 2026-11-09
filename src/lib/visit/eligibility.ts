import 'server-only';
import { eq } from 'drizzle-orm';
import type { VisitEligibility } from '@/types/visit';
import { db } from '@/lib/db';
import { usersUser, visitVisitingapplication } from '@/lib/db/schema';
import { getTransferChecklist } from '@/lib/vatusa/client';

const NON_MEMBER = 2;

export async function getVisitEligibility(cid: number): Promise<VisitEligibility> {
    let has_vatusa_user = true;
    let checklist;
    try {
        checklist = await getTransferChecklist(cid);
    } catch (err) {
        console.error('VATUSA transfer-checklist call failed:', err);
        has_vatusa_user = false;
        checklist = {
            has_home_facility: false,
            rce_completed: false,
            has_s3_rating: false,
            time_since_visit: false,
            time_since_promo: false,
            controlling_time: false,
            visiting: false,
        };
    }

    const [[user], [pending]] = await Promise.all([
        db.select({ status: usersUser.status }).from(usersUser).where(eq(usersUser.cid, cid)),
        db
            .select({ id: visitVisitingapplication.id })
            .from(visitVisitingapplication)
            .where(eq(visitVisitingapplication.userId, cid)),
    ]);

    const membership_check = user?.status === NON_MEMBER;
    const pending_application_check = pending === undefined;

    const is_eligible =
        has_vatusa_user &&
        checklist.visiting &&
        checklist.has_home_facility &&
        checklist.rce_completed &&
        checklist.has_s3_rating &&
        checklist.time_since_visit &&
        checklist.time_since_promo &&
        checklist.controlling_time &&
        membership_check &&
        pending_application_check;

    return {
        has_vatusa_user,
        has_home_facility: checklist.has_home_facility,
        rce_completed: checklist.rce_completed,
        has_s3_rating: checklist.has_s3_rating,
        time_since_visit: checklist.time_since_visit,
        time_since_promo: checklist.time_since_promo,
        controlling_time: checklist.controlling_time,
        membership_check,
        pending_application_check,
        is_eligible,
    };
}
