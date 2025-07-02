const exceptions = new Map<string, string>([
    ['I90_APP', 'Houston Approach'],
    ['HOU_APP', 'Houston Approach'],
    ['HOU_CTR', 'Houston Center'],
]);

const airports = new Map<string, string>([
    ['AEX', 'Alexandria'],
    ['ARA', 'Acadiana'],
    ['AUS', 'Austin'],
    ['BAZ', 'New Braunfels'],
    ['BFM', 'Downtown'],
    ['BIX', 'Keesler'],
    ['BPT', 'Beaumont'],
    ['BRO', 'Brownsville'],
    ['BTR', 'Ryan'],
    ['CLL', 'Easterwood'],
    ['CRP', 'Corpus'],
    ['CWF', 'Chennault'],
    ['CXO', 'Conroe'],
    ['DLF', 'Laughlin'],
    ['DWH', 'Hooks'],
    ['EDC', 'Austin Executive'],
    ['EFD', 'Ellington'],
    ['GLS', 'Galveston'],
    ['GPT', 'Gulfport'],
    ['GTU', 'Georgetown'],
    ['HDC', 'Hammond'],
    ['HOU', 'Hobby'],
    ['HRL', 'Harlingen'],
    ['HSA', 'Stennis'],
    ['HUM', 'Houma'],
    ['HYI', 'San Marcos'],
    ['IAH', 'Houston'],
    ['LCH', 'Lake Charles'],
    ['LFT', 'Lafayette'],
    ['LRD', 'Laredo'],
    ['MFE', 'McAllen'],
    ['MOB', 'Mobile'],
    ['MSY', 'New Orleans'],
    ['NBG', 'Navy New Orleans'],
    ['NEW', 'Lakefront'],
    ['NGP', 'Navy Corpus'],
    ['NGW', 'Navy Cabaniss'],
    ['NOG', 'Orange Grove'],
    ['NQI', 'Kingsville'],
    ['NWL', 'Navy Waldron'],
    ['POE', 'Polk'],
    ['PQL', 'Trent Lott'],
    ['RND', 'Hangover'],
    ['SAT', 'San Antonio'],
    ['SGR', 'Sugarland'],
    ['SKF', 'Kelly'],
    ['SSF', 'Stinson'],
    ['TME', 'Houston Executive'],
    ['VCT', 'Victoria'],
    ['VLY', 'Valley'],
]);

export function getPositionName(position: string): string {
    const exception = exceptions.get(position);
    if (exception) return exception;

    const split = position.split('_');

    const airport = airports.get(split[0]);

    let level = split[1];
    switch (split[1]) {
        case 'DEL':
            level = 'Delivery';
            break;
        case 'RMP':
            level = 'Ramp';
            break;
        case 'GND':
            level = 'Ground';
            break;
        case 'TWR':
            level = 'Tower';
            break;
        case 'APP':
            level = 'Approach';
            break;
        case 'DEP':
            level = 'Departure';
            break;
        case 'CTR':
            level = 'Center';
            break;
        case 'FSS':
            level = 'Flight Service Station';
            break;
    }
    return `${airport} ${level}`;
}
