export function applyTheme() {
    let theme = getTheme()

    if (theme === null) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    }

    document.body.className = theme
}

export function setTheme(theme) {
    localStorage.setItem('theme', theme)
    applyTheme()
}

export function getTheme() {
    return localStorage.getItem('theme')
}
