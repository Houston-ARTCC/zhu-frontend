export function getAuthURL() {
    return 'https://auth.vatsim.net/oauth/authorize' +
        '?client_id=' + process.env.REACT_APP_VATSIM_CONNECT_CLIENT_ID +
        '&redirect_uri=' + process.env.REACT_APP_VATSIM_CONNECT_REDIRECT_URI +
        '&response_type=code&scope=full_name+vatsim_details+email' +
        '&required_scopes=full_name+vatsim_details+email'
}

export function parseJWT() {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
        return JSON.parse(atob(accessToken.split('.')[1]))
    }
    return null
}

export function getCID() {
    const jwt = parseJWT()
    return jwt && jwt.cid
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

export function getRating() {
    const jwt = parseJWT()
    return jwt && jwt.rating
}

export function isAuthenticated() {
    return !!parseJWT()
}

export function isMember() {
    const jwt = parseJWT()
    return jwt && jwt.is_member
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
