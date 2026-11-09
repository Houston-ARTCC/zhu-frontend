'use server';

import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import sharp from 'sharp';
import { eq } from 'drizzle-orm';
import type { BasicUser, Roster } from '@/types/users';
import { requireMember, requireTrainingStaff } from '@/lib/auth/guards';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles } from '@/lib/db/schema';
import { logUpdate } from '@/lib/auditlog/log';
import { getSimplifiedUsers as querySimplifiedUsers } from '@/lib/users/repository';
import { deleteMedia, saveMedia } from '@/lib/media';
import { editProfileSchema } from './schema';

export async function getSimplifiedUsers(): Promise<Roster<BasicUser>> {
    return querySimplifiedUsers();
}

const USER_MODEL = { appLabel: 'users', modelName: 'user' };

export async function updateOwnProfile(input: { biography: string }): Promise<void> {
    const session = await requireMember();
    const cid = session.user.cid;

    const { biography } = editProfileSchema.parse(input);

    const [before] = await db.select().from(usersUser).where(eq(usersUser.cid, cid));
    if (!before) throw new Error('User not found');

    const [after] = await db
        .update(usersUser)
        .set({ biography })
        .where(eq(usersUser.cid, cid))
        .returning();

    if (after) {
        await logUpdate(USER_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, cid);
    }

    revalidatePath('/dashboard/profile');
}

export async function uploadOwnProfilePicture(formData: FormData): Promise<void> {
    const session = await requireMember();
    const cid = session.user.cid;

    const file = formData.get('avatar') as File | null;

    const [before] = await db.select().from(usersUser).where(eq(usersUser.cid, cid));
    if (!before) throw new Error('User not found');

    let profile: string | null;

    if (file && file.size > 0) {
        const input = Buffer.from(await file.arrayBuffer());
        let resized: Buffer;
        try {
            resized = await sharp(input)
                .resize(500, 500, { fit: 'fill' })
                .png()
                .toBuffer();
        } catch {
            throw new Error('Please upload an image file.');
        }

        if (before.profile) {
            await deleteMedia(before.profile);
        }

        const stem = randomBytes(4).toString('hex');
        profile = `profile/${stem}.png`;
        await saveMedia(profile, resized);
    } else {
        // Empty string / no file means reset to no avatar.
        profile = null;
    }

    const [after] = await db
        .update(usersUser)
        .set({ profile })
        .where(eq(usersUser.cid, cid))
        .returning();

    if (after) {
        await logUpdate(USER_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, cid);
    }

    revalidatePath('/dashboard/profile');
    revalidatePath(`/roster/${cid}`);
}

export interface AdminUpdateUserInput {
    first_name?: string;
    last_name?: string;
    email?: string;
    home_facility?: string;
    initials?: string;
    prevent_event_signup?: boolean;
    cic_endorsed?: boolean;
    endorsements?: Record<string, boolean | string>;
    roles?: string[];
}

export async function adminUpdateUser(cid: number, input: AdminUpdateUserInput): Promise<void> {
    const session = await requireTrainingStaff();
    const actorCid = session.user.cid;
    const isAdmin = session.user.permissions.is_staff;
    const isTrainingAdmin = session.user.permissions.is_training_admin;

    const [before] = await db.select().from(usersUser).where(eq(usersUser.cid, cid));
    if (!before) throw new Error(`User ${cid} not found`);

    const patch: Record<string, unknown> = {};

    if (isAdmin || isTrainingAdmin) {
        if (input.first_name !== undefined) patch.firstName = input.first_name;
        if (input.last_name !== undefined) patch.lastName = input.last_name;
        if (input.email !== undefined) patch.email = input.email;
        if (input.home_facility !== undefined) patch.homeFacility = input.home_facility;
        if (input.initials !== undefined) patch.initials = input.initials;
        if (input.prevent_event_signup !== undefined) patch.preventEventSignup = input.prevent_event_signup;
        if (input.cic_endorsed !== undefined) patch.cicEndorsed = input.cic_endorsed;
    }

    if (input.endorsements !== undefined) {
        const isMentorOnly = session.user.permissions.endorsement_scope === 'own';
        if (isMentorOnly) {
            // Restrict to keys the requester themselves holds (truthy in their own endorsements).
            const allowedKeys = new Set(
                Object.entries(session.user.endorsements ?? {})
                    .filter(([, v]) => v === true)
                    .map(([k]) => k),
            );
            const filtered = Object.fromEntries(
                Object.entries(input.endorsements).filter(([k]) => allowedKeys.has(k)),
            );
            // Merge into existing rather than full-overwrite.
            patch.endorsements = { ...(before.endorsements as Record<string, unknown> ?? {}), ...filtered };
        } else {
            patch.endorsements = input.endorsements;
        }
    }

    if (Object.keys(patch).length > 0) {
        const [after] = await db
            .update(usersUser)
            .set(patch)
            .where(eq(usersUser.cid, cid))
            .returning();

        if (after) {
            await logUpdate(USER_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, actorCid);
        }
    }

    if (isTrainingAdmin && input.roles !== undefined) {
        const allRoles = await db.select({ id: usersRole.id, short: usersRole.short }).from(usersRole);
        const membershipShorts = ['HC', 'VC'];

        const currentRoles = await db
            .select({ roleId: usersUserRoles.roleId })
            .from(usersUserRoles)
            .where(eq(usersUserRoles.userId, cid));
        const membershipRoleIds = allRoles
            .filter((r) => membershipShorts.includes(r.short))
            .map((r) => r.id);
        const keepIds = currentRoles
            .filter((r) => membershipRoleIds.includes(r.roleId))
            .map((r) => r.roleId);

        // Remove all current roles.
        await db.delete(usersUserRoles).where(eq(usersUserRoles.userId, cid));

        // Restore membership roles.
        for (const roleId of keepIds) {
            await db.insert(usersUserRoles).values({ userId: cid, roleId });
        }

        // Add new staff roles.
        for (const short of input.roles) {
            const role = allRoles.find((r) => r.short === short);
            if (role) {
                await db.insert(usersUserRoles).values({ userId: cid, roleId: role.id });
            }
        }
    }

    revalidatePath(`/roster/${cid}`);
}

