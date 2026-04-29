import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addCartItem, getCart, removeCartLine, updateCartLine } from './api/cartApi.js'
import { isApiError } from './api/core.js'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, readAuthToken } from './authSession.js'

/** @typedef {{ id: string, productId: string, variantId: string, quantity: number, name: string, image: string, unitPrice: number, selectionSummary: string, lineTotal: number }} CartLine */
/** @typedef {{ userId: string, itemCount: number, subtotal: number, lines: CartLine[] } | null} CartState */

const CartStateContext = createContext({
  /** @type {CartState} */
  cart: null,
  loading: true,
  error: '',
  /** @type {() => Promise<void>} */
  refresh: async () => {},
  /** @type {(p: { productId: string, variantId: string, quantity?: number }) => Promise<CartState>} */
  addItem: async () => null,
  /** @type {(lineId: string, quantity: number) => Promise<CartState>} */
  setLineQuantity: async () => null,
  /** @type {(lineId: string) => Promise<CartState>} */
  removeLine: async () => null,
  /** @type {() => void} */
  clearError: () => {},
})

export function CartProvider({ children }) {
  /** @type {[CartState, (c: CartState) => void]} */
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    if (!readAuthToken()) {
      setCart(null)
      setLoading(false)
      return
    }
    try {
      const data = await getCart()
      setCart(data)
    } catch (e) {
      const msg = isApiError(e) ? e.message : 'Could not load cart'
      setError(msg)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onAuth = () => {
      setLoading(true)
      refresh()
    }
    if (typeof window === 'undefined') return undefined
    window.addEventListener('union-auth-changed', onAuth)
    return () => window.removeEventListener('union-auth-changed', onAuth)
  }, [refresh])

  /** Other tabs: localStorage updates do not fire `union-auth-changed` in this tab. */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onStorage = (e) => {
      if (e.storageArea !== localStorage) return
      if (e.key !== AUTH_TOKEN_KEY && e.key !== AUTH_USER_KEY) return
      setLoading(true)
      refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  const addItem = useCallback(async (item) => {
    setError('')
    try {
      const data = await addCartItem(item)
      setCart(data)
      return data
    } catch (e) {
      const msg = isApiError(e) ? e.message : 'Could not add to cart'
      setError(msg)
      throw e
    }
  }, [])

  const setLineQuantity = useCallback(async (lineId, quantity) => {
    setError('')
    try {
      const data = await updateCartLine(lineId, quantity)
      setCart(data)
      return data
    } catch (e) {
      const msg = isApiError(e) ? e.message : 'Could not update cart'
      setError(msg)
      throw e
    }
  }, [])

  const removeLine = useCallback(async (lineId) => {
    setError('')
    try {
      const data = await removeCartLine(lineId)
      setCart(data)
      return data
    } catch (e) {
      const msg = isApiError(e) ? e.message : 'Could not remove item'
      setError(msg)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(''), [])

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      refresh,
      addItem,
      setLineQuantity,
      removeLine,
      clearError,
    }),
    [cart, loading, error, refresh, addItem, setLineQuantity, removeLine, clearError],
  )

  return <CartStateContext.Provider value={value}>{children}</CartStateContext.Provider>
}

export function useCart() {
  return useContext(CartStateContext)
}
