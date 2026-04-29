function defaultApiUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:3000`
  }
  return 'http://localhost:3000'
}

export function baseUrl() {
  const env = import.meta.env.VITE_API_URL
  if (env && String(env).trim()) return String(env).replace(/\/$/, '')
  return defaultApiUrl()
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function pickMessage(data) {
  if (!data) return 'Request failed'
  if (Array.isArray(data.message)) {
    return data.message.filter(Boolean).map(String).join(', ') || 'Request failed'
  }
  if (typeof data.message === 'string') return data.message
  return 'Request failed'
}

export async function jsonFetch(path, { method = 'GET', body, headers: extra = {} } = {}) {
  const res = await fetch(`${baseUrl()}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extra,
    },
    body: body == null ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  } else {
    data = {}
  }
  if (!res.ok) {
    throw new ApiError(pickMessage(data), res.status)
  }
  return data
}

export function isApiError(err) {
  return err instanceof ApiError
}
