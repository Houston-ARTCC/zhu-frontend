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
