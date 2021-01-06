export function parseJWT() {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
        return JSON.parse(atob(accessToken.split('.')[1]))
    }
    return null
}

export function getFirstName() {
    const jwt = parseJWT()
    return jwt && jwt.first_name
}

export function getLastName() {
    const jwt = parseJWT()
    return jwt && jwt.last_name
}

export function getFullName() {
    return getFirstName() + ' ' + getLastName()
}

export function getCID() {
    const jwt = parseJWT()
    return jwt && jwt.cid
}

export function isStaff() {
    const jwt = parseJWT()
    return jwt && jwt.is_staff
}

export function asDuration(durationStr) {
    if (durationStr == null) return null
    const parts = durationStr.split(/[:.]/)
    return `${parts[0]}h ${parts[1]}m`
}

export function asSeconds(durationStr) {
    if (durationStr == null) return 0
    const parts = durationStr.split(/[:.]/)
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
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

export function certLevel(user) {
    if (user.ocn_cert) { return 'Oceanic' }
    if (user.ctr_cert) { return 'Center' }
    if (user.app_cert) { return 'Approach' }
    if (user.twr_cert) { return 'Tower' }
    if (user.gnd_cert) { return 'Ground' }
    if (user.del_cert) { return 'Delivery' }
    return 'Observer'
}