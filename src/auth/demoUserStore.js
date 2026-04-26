/**
 * DEMO ONLY — plain passwords in sessionStorage. Do not use in production.
 */
const STORAGE_KEY = 'union-demo-users'

function readRaw() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function getDemoUsers() {
  return readRaw()
}

export function findDemoUserByEmail(email) {
  const normalized = email.trim().toLowerCase()
  return readRaw().find((u) => u.email.toLowerCase() === normalized) ?? null
}

export function addDemoUser(user) {
  const users = readRaw()
  if (users.some((u) => u.email.toLowerCase() === user.email.trim().toLowerCase())) {
    return { ok: false, error: 'auth.error.accountExists' }
  }
  users.push({
    email: user.email.trim(),
    fullName: user.fullName.trim(),
    gender: user.gender,
    universityId: user.universityId,
    password: user.password,
  })
  writeUsers(users)
  return { ok: true }
}

export function updateDemoUserPassword(email, newPassword) {
  const users = readRaw()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (idx === -1) return { ok: false, error: 'auth.error.noAccount' }
  users[idx] = { ...users[idx], password: newPassword }
  writeUsers(users)
  return { ok: true }
}

export function verifyDemoCredentials(email, password, t = null) {
  const tx = (key, fallback) => (typeof t === 'function' ? t(key, fallback) : fallback)
  const user = findDemoUserByEmail(email)
  if (!user) return { ok: false, error: tx('authErrorNoAccount', 'No account found for this email.') }
  if (user.password !== password) return { ok: false, error: tx('authErrorWrongPassword', 'Incorrect password.') }
  return { ok: true, user }
}
