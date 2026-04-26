import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets window scroll to the top when the route (path or query) changes.
 * Hash-only updates are ignored so in-page anchors (e.g. /#map) can still scroll to targets.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}
