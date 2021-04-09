export function applyTheme() {
    document.body.className = getTheme()
}

export function setTheme(theme) {
    localStorage.setItem('theme', theme)
    applyTheme()
}

export function getTheme() {
    let theme = localStorage.getItem('theme')
    return theme === 'default' ? getSystemTheme() : theme || getSystemTheme()
}

export function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}