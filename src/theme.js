/** Read saved theme; explicit `light` wins over system preference. */
export function readStoredThemeIsDark() {
  const saved = localStorage.getItem('union-theme')
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyDarkClass(isDark) {
  document.documentElement.classList.toggle('dark', isDark)
}

export function persistTheme(isDark) {
  localStorage.setItem('union-theme', isDark ? 'dark' : 'light')
}
