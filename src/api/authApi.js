import { jsonFetch, ApiError } from './core.js'

export { ApiError, isApiError } from './core.js'

export async function signIn(payload) {
  return jsonFetch('/auth/sign-in', { method: 'POST', body: payload })
}

export async function signUp(payload) {
  return jsonFetch('/auth/sign-up', { method: 'POST', body: payload })
}

export async function checkSignUpEmail(payload) {
  return jsonFetch('/auth/sign-up/check-email', { method: 'POST', body: payload })
}

export async function verifySignUpCode(payload) {
  return jsonFetch('/auth/sign-up/verify-code', { method: 'POST', body: payload })
}

export async function requestPasswordReset(payload) {
  return jsonFetch('/auth/password-reset/request', { method: 'POST', body: payload })
}

export async function verifyPasswordResetCode(payload) {
  return jsonFetch('/auth/password-reset/verify', { method: 'POST', body: payload })
}

export async function confirmPasswordReset(payload) {
  return jsonFetch('/auth/password-reset/confirm', { method: 'POST', body: payload })
}
