import { Category } from '@/types/resources';

export function categoryToString(category: Category): string {
    switch (category) {
        case Category.VRC: return 'VRC';
        case Category.VSTARS: return 'vSTARS';
        case Category.VERAM: return 'vERAM';
        case Category.VATIS: return 'vATIS';
        case Category.SOP: return 'SOP';
        case Category.LOA: return 'LOA';
        case Category.MAVP: return 'MAVP';
        case Category.Misc: return 'Miscellaneous';
    }
    return '';
}

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
