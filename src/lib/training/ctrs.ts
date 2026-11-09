import 'server-only';

const VATUSA_BASE = process.env.VATUSA_API_BASE ?? 'https://api.vatusa.net/v2';

interface CtrsPayload {
    instructor_id: number;
    session_date: string;
    position: string;
    duration: string;
    movements: number;
    score: number;
    notes: string;
    location: number;
    ots_status: number;
}

// Classroom=0, Sweatbox=1, Online=2, OTS=3 in our DB -> VATUSA location codes
function ctrsLocation(type: number): number {
    switch (type) {
        case 0: return 0; // Classroom -> 0
        case 1: return 2; // Sweatbox -> 2
        case 2: return 1; // Online -> 1 (Live)
        case 3: return 1; // OTS -> 1 (Live)
        default: return 0;
    }
}

function durationHHMM(startIso: string, endIso: string): string {
    const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
    const totalMinutes = Math.max(0, Math.round(ms / 60000));
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// VATUSA expects "YYYY-MM-DD HH:MM" (no seconds, no T separator)
function sessionDate(isoString: string): string {
    const d = new Date(isoString);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const min = String(d.getUTCMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export interface SessionForCtrs {
    instructorId: number;
    start: string;
    end: string;
    position: string | null;
    movements: number;
    progress: number;
    notes: string | null;
    type: number;
    otsStatus: number;
}

function buildPayload(session: SessionForCtrs): CtrsPayload {
    const rawNotes = session.notes ?? '';
    return {
        instructor_id: session.instructorId,
        session_date: sessionDate(session.start),
        position: session.position ?? '',
        duration: durationHHMM(session.start, session.end),
        movements: session.movements,
        score: session.progress,
        notes: rawNotes === '' ? 'No notes provided.' : rawNotes,
        location: ctrsLocation(session.type),
        ots_status: session.otsStatus,
    };
}

export async function postSessionRecord(session: SessionForCtrs, studentCid: number): Promise<number | null> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        console.error('VATUSA_API_TOKEN is not configured; skipping CTRS post');
        return null;
    }

    const payload = buildPayload(session);
    const body = new URLSearchParams({ apikey: apiKey, ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])) });

    const res = await fetch(`${VATUSA_BASE}/user/${studentCid}/training/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!res.ok) {
        throw new Error(`CTRS post failed: ${res.status} ${await res.text()}`);
    }
    const json = await res.json() as { data?: { id?: unknown }; id?: unknown };
    return Number(json?.data?.id ?? json?.id) || null;
}

export async function putSessionRecord(session: SessionForCtrs, ctrsId: number): Promise<void> {
    const apiKey = process.env.VATUSA_API_TOKEN;
    if (!apiKey) {
        console.error('VATUSA_API_TOKEN is not configured; skipping CTRS put');
        return;
    }

    const payload = buildPayload(session);
    const body = new URLSearchParams({ apikey: apiKey, ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])) });

    const res = await fetch(`${VATUSA_BASE}/training/record/${ctrsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!res.ok) {
        console.error('CTRS put failed:', res.status, await res.text());
    }
}
