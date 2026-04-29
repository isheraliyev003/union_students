import { jsonFetch } from './core.js'

/**
 * @returns {Promise<{ slug: string, label: string, sortOrder: number }[]>}
 */
export function getRegions() {
  return jsonFetch('/regions')
}

/**
 * @param {{ region?: string }} [query]
 * @returns {Promise<{ id: string, slug: string, name: string, shortDetail: string, image: string, region: string, regionLabel: string }[]>}
 */
export function getUniversities(query = {}) {
  const { region } = query
  const q =
    region && String(region).trim() && region !== 'all'
      ? `?region=${encodeURIComponent(String(region).trim())}`
      : ''
  return jsonFetch(`/universities${q}`)
}

/**
 * @param {string} slug
 * @returns {Promise<{ id: string, slug: string, name: string, shortDetail: string, image: string, region: string, regionLabel: string }>}
 */
export function getUniversityBySlug(slug) {
  return jsonFetch(`/universities/${encodeURIComponent(slug)}`)
}

const STORE_PARAM_KEYS = new Set([
  'university',
  'category',
  'q',
  'tags',
  'sort',
  'excludeId',
  'limit',
])

/**
 * @param {Record<string, string | number | undefined | null>} [query]
 * @returns {Promise<Array<{ id: string, name: string, category: string, tag: string, universitySlug: string, price: number, featuredScore: number, image: string, imageLg: string, images: string[], optionGroups?: unknown, variants?: unknown }>>}
 */
export function getStoreProducts(query = {}) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v == null) continue
    if (!STORE_PARAM_KEYS.has(k)) continue
    const s = String(v).trim()
    if (s === '') continue
    p.set(k, s)
  }
  const qs = p.toString()
  return jsonFetch(qs ? `/collections?${qs}` : '/collections')
}

/**
 * @param {string} id MongoDB ObjectId hex string
 */
export function getStoreProductById(id) {
  return jsonFetch(
    `/collections/${encodeURIComponent(String(id).trim())}`,
  )
}
