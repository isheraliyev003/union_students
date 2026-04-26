const REGISTERED_KEY = 'union-registered'

export function readRegistered() {
  return localStorage.getItem(REGISTERED_KEY) === 'true'
}

export function setRegistered(registered) {
  if (registered) localStorage.setItem(REGISTERED_KEY, 'true')
  else localStorage.removeItem(REGISTERED_KEY)
}
