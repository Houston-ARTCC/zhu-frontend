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

export function isAuthenticated() {
    return !!parseJWT()
}

export function isTrainingStaff() {
    const jwt = parseJWT()
    return jwt && jwt.is_training_staff
}

export function isStaff() {
    const jwt = parseJWT()
    return jwt && jwt.is_staff
}

export function isSeniorStaff() {
    const jwt = parseJWT()
    return jwt && jwt.is_senior_staff
}

export function isAdmin() {
    const jwt = parseJWT()
    return jwt && jwt.is_admin
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
