import 'server-only';
import { mkdir, unlink, writeFile } from 'fs/promises';
import pathLib from 'path';

export function mediaRoot(): string {
    const root = process.env.MEDIA_ROOT;
    if (!root) throw new Error('MEDIA_ROOT is not set');
    return root;
}

export function mediaPath(relPath: string): string {
    return pathLib.join(mediaRoot(), relPath);
}

export async function saveMedia(relPath: string, data: Uint8Array): Promise<void> {
    const absPath = mediaPath(relPath);
    await mkdir(pathLib.dirname(absPath), { recursive: true });
    await writeFile(absPath, data);
}

export async function deleteMedia(relPath: string): Promise<void> {
    await unlink(mediaPath(relPath)).catch(() => undefined);
}
