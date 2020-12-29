export function parseJWT() {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
        return JSON.parse(atob(accessToken.split('.')[1]))
    }
    return null
}

export function getFirstName() {
    const jwt = parseJWT()
    if (jwt) {
        return jwt.first_name
    }
    return null
}

export function getLastName() {
    const jwt = parseJWT()
    if (jwt) {
        return jwt.last_name
    }
    return null
}

export function getFullName() {
    return getFirstName() + ' ' + getLastName()
}

export function getCID() {
    const jwt = parseJWT()
    if (jwt) {
        return jwt.cid
    }
    return null
}

export function asDuration(durationStr) {
    if (durationStr == null) return null
    const parts = durationStr.split(/[:.]/)
    return `${parts[0]}h ${parts[1]}m`
}
