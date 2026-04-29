const REGISTERED_KEY = 'union-registered'
const TOKEN_KEY = 'union-auth-token'
const USER_KEY = 'union-auth-user'

/** @type {typeof TOKEN_KEY} */
export const AUTH_TOKEN_KEY = TOKEN_KEY
/** @type {typeof USER_KEY} */
export const AUTH_USER_KEY = USER_KEY

/**
 * Token + user live in localStorage (not sessionStorage) so every tab/window
 * includes `Authorization` on API calls (e.g. user-bound cart) after sign-in.
 */

function notifyAuthChanged() {
  if (typeof window === 'undefined') return
  try {
    window.dispatchEvent(new Event('union-auth-changed'))
  } catch {
    /* ignore */
  }
}

function migrateFromSessionStorage(legacyKey) {
  try {
    const s = sessionStorage.getItem(legacyKey)
    if (s) {
      localStorage.setItem(legacyKey, s)
      sessionStorage.removeItem(legacyKey)
    }
  } catch {
    /* ignore */
  }
}

export function readAuthToken() {
  try {
    migrateFromSessionStorage(TOKEN_KEY)
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function readAuthUser() {
  try {
    migrateFromSessionStorage(USER_KEY)
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * After successful sign-in (or when you have a token + user from the API).
 */
export function setSession({ token, user } = {}) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    if (user != null) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    /* Remove legacy per-tab copy */
    try {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    } catch {
      /* ignore */
    }
    localStorage.setItem(REGISTERED_KEY, 'true')
  } catch {
    if (user != null) {
      /* ignore storage failures */
    }
  }
  notifyAuthChanged()
}

function clearServerSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

export function readRegistered() {
  if (readAuthToken()) return true
  return localStorage.getItem(REGISTERED_KEY) === 'true'
}

export function setRegistered(registered) {
  if (registered) {
    localStorage.setItem(REGISTERED_KEY, 'true')
  } else {
    clearServerSession()
    localStorage.removeItem(REGISTERED_KEY)
  }
  notifyAuthChanged()
}
