import { type SelectOption } from '@/components/Forms';
import { type BasicUser } from '@/types/users';

export function ratingToInt(ratingStr: string): number {
    switch (ratingStr) {
        case 'OBS': return 0;
        case 'S1': return 1;
        case 'S2': return 2;
        case 'S3': return 3;
        case 'C1': return 4;
        case 'C3': return 5;
        case 'I1': return 6;
        case 'I3': return 7;
        case 'SUP': return 8;
        case 'ADM': return 9;
        default: return -1;
    }
}

export function userToOption(user: BasicUser): SelectOption {
    return {
        value: user.cid,
        label: `${user.first_name} ${user.last_name}`,
    };
}

export function scoreToBadgeColor(score: number): string {
    if (score < 65) return '!bg-red-400 !shadow-red-400/25';
    if (score < 90) return '!bg-amber-400 !shadow-amber-400/25';
    return '!bg-green-400 !shadow-green-400/25';
}
