export type Metar = {
    station: string;
    raw: string;
    flight_rules: 'VFR' | 'MVFR' | 'IFR' | 'LIFR';
    timestamp: string;
}
