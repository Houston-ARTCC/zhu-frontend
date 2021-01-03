export function parseJWT() {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
        return JSON.parse(atob(accessToken.split('.')[1]))
    }
    return null
}

export function getFirstName() {
    const jwt = parseJWT()
    return jwt ? jwt.first_name : null
}

export function getLastName() {
    const jwt = parseJWT()
    return jwt ? jwt.last_name : null
}

export function getFullName() {
    return getFirstName() + ' ' + getLastName()
}

export function getCID() {
    const jwt = parseJWT()
    return jwt ? jwt.cid : null
}

export function isStaff() {
    const jwt = parseJWT()
    return jwt ? jwt.is_staff : false
}

export function asDuration(durationStr) {
    if (durationStr == null) return null
    const parts = durationStr.split(/[:.]/)
    return `${parts[0]}h ${parts[1]}m`
}
