import { NextResponse, type NextRequest } from 'next/server';
import { requireMember } from '@/lib/auth/guards';
import { getUserQuarterlyStatus } from '@/lib/connections/repository';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ key: string[] }> },
): Promise<NextResponse> {
    let session;
    try {
        session = await requireMember();
    } catch {
        return NextResponse.json({ detail: 'Forbidden' }, { status: 403 });
    }

    const { key } = await params;
    // key segments: [year, quarter] where quarter is 0-indexed
    const year = parseInt(key[0] ?? '', 10);
    const quarter = parseInt(key[1] ?? '', 10);

    if (!year || isNaN(quarter)) {
        return NextResponse.json({ detail: 'Invalid key' }, { status: 400 });
    }

    const data = await getUserQuarterlyStatus(session.user.cid, year, quarter);
    return NextResponse.json(data);
}
