export function parseJWT() {
    const accessToken = localStorage.getItem('access_token')
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
