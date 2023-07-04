export function durationToSeconds(duration: string): number {
    if (duration == null || duration === '00:00:00') return 0;
    const parts = duration.split(/[:.]/);
    return parseInt(parts[0], 10) * 3600
        + parseInt(parts[1], 10) * 60
        + parseInt(parts[2], 10);
}

export function formatDuration(duration: string): string | null {
    if (duration == null || duration === '00:00:00') return null;
    const parts = duration.split(/[:.]/);
    return `${parts[0]}h ${parts[1]}m`;
}

export function formatSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const seconds = totalSeconds % 3600;
    const minutes = Math.floor(seconds / 60);
    return `${hours.toString()}h ${minutes.toString()}m`;
}
