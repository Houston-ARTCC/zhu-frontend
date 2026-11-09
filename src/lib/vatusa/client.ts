import 'server-only';

const VATUSA_BASE = process.env.VATUSA_API_BASE ?? 'https://api.vatusa.net/v2';

// Raw field names returned by VATUSA v2 /transfer/checklist
interface RawChecklist {
    hasHome: boolean;
    needbasic: boolean;
    hasRating: boolean;
    '60days': boolean;
    promo: boolean;
    '50hrs': boolean;
    visiting: boolean;
}

export interface VatusaTransferChecklist {
    has_home_facility: boolean;
    rce_completed: boolean;
    has_s3_rating: boolean;
    time_since_visit: boolean;
    time_since_promo: boolean;
    controlling_time: boolean;
    visiting: boolean;
}

export async function getTransferChecklist(cid: number): Promise<VatusaTransferChecklist> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        throw new Error('VATUSA_API_TOKEN is not configured');
    }

    const url = new URL(`${VATUSA_BASE}/user/${cid}/transfer/checklist`);
    url.searchParams.set('apikey', apiKey);

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`VATUSA transfer checklist failed: ${res.status}`);
    }

    const raw: RawChecklist = ((await res.json()) as { data: RawChecklist }).data;

    return {
        has_home_facility: raw.hasHome,
        rce_completed: raw.needbasic,
        has_s3_rating: raw.hasRating,
        time_since_visit: raw['60days'],
        time_since_promo: raw.promo,
        controlling_time: raw['50hrs'],
        visiting: raw.visiting,
    };
}

export interface VatusaRosterMember {
    cid: number;
    email: string;
    fname: string;
    lname: string;
    rating_short: string;
}

export async function getFacilityRoster(membership: 'home' | 'visit'): Promise<VatusaRosterMember[]> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        throw new Error('VATUSA_API_TOKEN is not configured');
    }

    const facility = process.env.VATUSA_FACILITY_ID ?? 'ZHU';
    const url = new URL(`${VATUSA_BASE}/facility/${facility}/roster/${membership}`);
    url.searchParams.set('apikey', apiKey);

    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
    if (!res.ok) {
        throw new Error(`VATUSA ${membership} roster fetch failed: ${res.status}`);
    }

    return ((await res.json()) as { data: VatusaRosterMember[] }).data;
}

export async function postVisitorRosterAdd(cid: number): Promise<void> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        throw new Error('VATUSA_API_TOKEN is not configured');
    }

    const facility = process.env.VATUSA_FACILITY_ID ?? 'ZHU';

    const url = new URL(`${VATUSA_BASE}/facility/${facility}/roster/manageVisitor/${cid}/`);
    url.searchParams.set('apikey', apiKey);

    const res = await fetch(url, { method: 'POST', cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`VATUSA visitor roster add failed: ${res.status}`);
    }
}

export async function deleteHomeController(cid: number, reason: string, actorCid: number): Promise<void> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        throw new Error('VATUSA_API_TOKEN is not configured');
    }

    const facility = process.env.VATUSA_FACILITY_ID ?? 'ZHU';
    const url = new URL(`${VATUSA_BASE}/facility/${facility}/roster/${cid}`);
    url.searchParams.set('apikey', apiKey);

    const body = new URLSearchParams({ reason, by: String(actorCid) });
    const res = await fetch(url, {
        method: 'DELETE',
        body,
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error(`VATUSA HC roster remove failed: ${res.status}`);
    }
}

export async function deleteVisitingController(cid: number, reason: string): Promise<void> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        throw new Error('VATUSA_API_TOKEN is not configured');
    }

    const facility = process.env.VATUSA_FACILITY_ID ?? 'ZHU';
    const url = new URL(`${VATUSA_BASE}/facility/${facility}/roster/manageVisitor/${cid}`);
    url.searchParams.set('apikey', apiKey);

    const body = new URLSearchParams({ reason });
    const res = await fetch(url, {
        method: 'DELETE',
        body,
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error(`VATUSA VC roster remove failed: ${res.status}`);
    }
}
