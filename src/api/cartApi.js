import { readAuthToken } from '../authSession.js'
import { ApiError, jsonFetch } from './core.js'

function authHeaders() {
  const token = readAuthToken()
  if (!token) {
    throw new ApiError('Sign in to use your cart.', 401)
  }
  return { Authorization: `Bearer ${token}` }
}

/**
 * @returns {Promise<{ userId: string, itemCount: number, subtotal: number, lines: Array<Record<string, unknown>> }>}
 */
export function getCart() {
  return jsonFetch('/cart', { headers: authHeaders() })
}

/**
 * @param {{ productId: string, variantId: string, quantity?: number }} item
 */
export function addCartItem(item) {
  const q = item.quantity != null && item.quantity > 0 ? item.quantity : 1
  return jsonFetch('/cart/items', {
    method: 'POST',
    headers: authHeaders(),
    body: { productId: item.productId, variantId: item.variantId, quantity: q },
  })
}

/**
 * @param {string} lineId
 * @param {number} quantity
 */
export function updateCartLine(lineId, quantity) {
  return jsonFetch(`/cart/items/${encodeURIComponent(lineId)}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: { quantity },
  })
}

/**
 * @param {string} lineId
 */
export function removeCartLine(lineId) {
  return jsonFetch(`/cart/items/${encodeURIComponent(lineId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}
