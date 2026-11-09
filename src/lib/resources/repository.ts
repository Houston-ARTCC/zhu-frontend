import 'server-only';

import pathLib from 'path';
import { statSync } from 'fs';
import type { Resource, ResourceData } from '@/types/resources';
import { db } from '@/lib/db';
import { resourcesResource } from '@/lib/db/schema';
import { mediaPath } from '@/lib/media';

function fileSize(relPath: string): string {
    try {
        const bytes = statSync(mediaPath(relPath)).size;
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    } catch {
        return '0 bytes';
    }
}

export async function getResources(): Promise<ResourceData> {
    const rows = await db
        .select({
            id: resourcesResource.id,
            name: resourcesResource.name,
            category: resourcesResource.category,
            path: resourcesResource.path,
            updated: resourcesResource.updated,
        })
        .from(resourcesResource)
        .orderBy(resourcesResource.name);

    const result: Partial<ResourceData> = {};

    for (const row of rows) {
        const resource: Resource = {
            id: row.id,
            name: row.name,
            category: row.category as Resource['category'],
            path: `/media/${row.path}`,
            extension: pathLib.extname(row.path),
            size: fileSize(row.path),
            updated: row.updated,
        };

        const cat = row.category as Resource['category'];
        if (!result[cat]) result[cat] = [];
        result[cat]!.push(resource);
    }

    return result as ResourceData;
}
