const exceptions = {
    'I90_APP': 'Houston Approach',
    'HOU_APP': 'Houston Approach',
    'HOU_CTR': 'Houston Center',
    'ZHU_FSS': 'Houston Oceanic',
}

const airports = {
    'HOU': 'Hobby',
    'IAH': 'Houston',
    'AUS': 'Austin',
    'MSY': 'New Orleans',
    'SAT': 'San Antonio',
    'DLF': 'Laughlin',
    'SKF': 'Kelly',
    'SSF': 'Stinson',
    'RND': 'Hangover',
    'BAZ': 'New Braunfels',
    'GTU': 'Georgetown',
    'GRK': 'Gray',
    'HLR': 'Hood',
    'VCT': 'Victoria',
    'CLL': 'Easterwood',
    'DWH': 'Hooks',
    'EFD': 'Ellington',
    'SGR': 'Sugarland',
    'CRP': 'Corpus',
    'NGP': 'Navy Corpus',
    'NOG': 'Orange Grove',
    'NQI': 'Kingsville',
    'LRD': 'Laredo',
    'MFE': 'McAllen',
    'BRO': 'Brownsville',
    'HRL': 'Harlingen',
    'CXO': 'Conroe',
    'GLS': 'Galveston',
    'BPT': 'Beaumont',
    'POE': 'Polk',
    'LCH': 'Lake Charles',
    'CWF': 'Chennault',
    'AEX': 'Alexandria',
    'LFT': 'Lafayette',
    'ARA': 'Acadiana',
    'BTR': 'Ryan',
    'HUM': 'Houma',
    'NEW': 'Lakefront',
    'NBG': 'Navy New Orleans',
    'HSA': 'Stennis',
    'GPT': 'Gulfport',
    'BIX': 'Keesler',
    'PQL': 'Trent Lott',
    'BFM': 'Downtown',
    'MOB': 'Mobile',
}

export default function getPositionName(position) {
    if (position in exceptions) {
        return exceptions[position]
    }
    let split = position.split('_')
    let airport = airports[split[0]]
    let level = split[1]
    switch (split[1]) {
        case 'DEL': level = 'Delivery'; break
        case 'GND': level = 'Ground'; break
        case 'TWR': level = 'Tower'; break
        case 'APP': level = 'Approach'; break
        case 'DEP': level = 'Departure'; break
        case 'CTR': level = 'Center'; break
        case 'FSS': level = 'Flight Service Station'; break
    }
    return airport + ' ' + level
}
