import { type NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import pathLib from 'path';
import { mediaRoot } from '@/lib/media';

const CONTENT_TYPES: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.zip': 'application/zip',
};

// Uploads are served from the site's own origin, so anything that can carry script (SVG, HTML) must download instead.
const INLINE_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'text/plain']);

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
    const { path } = await params;

    const root = pathLib.resolve(mediaRoot());
    const resolved = pathLib.resolve(root, ...path);

    // Reject path traversal outside MEDIA_ROOT.
    if (resolved !== root && !resolved.startsWith(root + pathLib.sep)) {
        return new NextResponse('Not found', { status: 404 });
    }

    let data: Buffer;
    try {
        data = await readFile(resolved);
    } catch {
        return new NextResponse('Not found', { status: 404 });
    }

    const contentType = CONTENT_TYPES[pathLib.extname(resolved).toLowerCase()] ?? 'application/octet-stream';
    const disposition = INLINE_TYPES.has(contentType) ? 'inline' : 'attachment';

    return new NextResponse(new Uint8Array(data), {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `${disposition}; filename*=UTF-8''${encodeURIComponent(pathLib.basename(resolved))}`,
            'X-Content-Type-Options': 'nosniff',
        },
    });
}
