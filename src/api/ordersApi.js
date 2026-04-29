import { readAuthToken } from '../authSession.js'
import { jsonFetch } from './core.js'

function headersWithAuth() {
  const token = readAuthToken()
  if (!token) {
    throw new Error('Sign in required')
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Create pending order and Payme Checkout URL (server builds return URL + order query).
 * @param {{ returnUrl?: string }} [opts]
 */
export async function createPaymeCheckout(opts = {}) {
  const body = {}
  if (opts.returnUrl) {
    body.returnUrl = opts.returnUrl
  }
  return jsonFetch('/orders/payme/checkout', {
    method: 'POST',
    headers: headersWithAuth(),
    body,
  })
}

/** @param {string} orderId */
export async function getOrder(orderId) {
  return jsonFetch(`/orders/status/${encodeURIComponent(orderId)}`, {
    headers: headersWithAuth(),
  })
}

/** Dev/mock — requires ALLOW_TEST_PAYMENT=true on API */
export async function completeTestPayment(orderId) {
  return jsonFetch('/orders/test-pay/complete', {
    method: 'POST',
    headers: headersWithAuth(),
    body: { orderId },
  })
}
