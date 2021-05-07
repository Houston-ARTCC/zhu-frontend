export function durationStrAsSeconds(durationStr) {
    if (durationStr == null) return 0
    const parts = durationStr.split(/[:.]/)
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
}

export function formatDurationStr(durationStr) {
    if (durationStr == null) return null
    const parts = durationStr.split(/[:.]/)
    return `${parts[0]}h ${parts[1]}m`
}

export function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600)
    seconds = seconds % 3600
    const minutes = Math.floor(seconds / 60)
    return `${hours.toString()}h ${minutes.toString()}m`
}

export function ratingInt(ratingStr) {
    switch (ratingStr) {
        case 'OBS': return 0
        case 'S1': return 1
        case 'S2': return 2
        case 'S3': return 3
        case 'C1': return 4
        case 'C3': return 5
        case 'I1': return 6
        case 'I3': return 7
        case 'SUP': return 8
        case 'ADM': return 9
        default: return -1
    }
}

export function maxCertLevel(user) {
    if (user.ocn_cert) return 6
    if (user.ctr_cert) return 5
    if (user.app_cert) return 4
    if (user.twr_cert) return 3
    if (user.gnd_cert) return 2
    if (user.del_cert) return 1
    return 0
}

export function certName(certInt) {
    switch (certInt) {
        case 6: return 'Oceanic'
        case 5: return 'Center'
        case 4: return 'Approach'
        case 3: return 'Tower'
        case 2: return 'Ground'
        case 1: return 'Delivery'
        default: return 'Observer'
    }
}

export function certLevel(certInt) {
    switch (certInt) {
        case 1: return 'Minor'
        case 2: return 'Major'
        case 3: return 'Solo'
        default: return 'None'
    }
}

export function certColor(certInt) {
    switch (certInt) {
        case 1: return 'yellow'
        case 2: return 'green'
        case 3: return 'red'
        default: return 'lightgray'
    }
}

export function levelDisplay(levelInt) {
    switch (levelInt) {
        case 0: return 'Minor Ground'
        case 1: return 'Major Ground'
        case 2: return 'Minor Tower'
        case 3: return 'Major Tower'
        case 4: return 'Minor Approach'
        case 5: return 'Major Approach'
        case 6: return 'Center'
        case 7: return 'Oceanic'
        default: return 'Unknown'
    }
}

export function typeDisplay(typeInt) {
    switch (typeInt) {
        case 0: return 'Classroom'
        case 1: return 'Sweatbox'
        case 2: return 'Online'
        case 3: return 'OTS'
        default: return 'Unknown'
    }
}

export function sessionStatusDisplay(statusInt) {
    switch (statusInt) {
        case 0: return 'Scheduled'
        case 1: return 'Completed'
        case 2: return 'Cancelled'
        case 3: return 'No-Show'
        default: return 'Unknown'
    }
}

export function userStatusDisplay(statusInt) {
    switch (statusInt) {
        case 0: return 'Active'
        case 1: return 'LOA'
        case 2: return 'Non-Member'
        default: return 'Unknown'
    }
}

export function formDataFromObject(object) {
    let formData = new FormData()
    Object.keys(object).forEach(key => formData.append(key, object[key]))
    return formData
}
