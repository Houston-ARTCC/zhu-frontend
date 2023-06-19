import { Category } from '@/types/api/resources';

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
