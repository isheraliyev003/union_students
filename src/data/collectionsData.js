/** Demo catalog for the Collections experience (no backend). */

export const COLLECTION_CATEGORIES = [
  { id: 'study', label: 'Study' },
  { id: 'wear', label: 'Wear' },
  { id: 'gear', label: 'Gear' },
  { id: 'print', label: 'Print' },
]

export const COLLECTION_TAGS = ['Drop', 'Archive', 'Campus', 'Night lab', 'Co-op']

/** @typedef {{ id: string, label: string, priceDelta?: number, swatch?: string, imageIndex?: number }} ProductOptionValue */
/** @typedef {{ id: string, label: string, type: 'swatch' | 'pill', values: ProductOptionValue[] }} ProductOptionGroup */

const COLOR_SWATCHES = [
  { id: 'obsidian', label: 'Obsidian', swatch: '#0f172a', priceDelta: 0 },
  { id: 'chalk', label: 'Chalk', swatch: '#f1f5f9', priceDelta: 4 },
  { id: 'signal', label: 'Signal', swatch: '#84cc16', priceDelta: 12 },
  { id: 'orbit', label: 'Orbit', swatch: '#d946ef', priceDelta: 10 },
]

/**
 * @param {number} index
 * @param {string} category
 * @param {number} imageCount
 * @returns {ProductOptionGroup[]}
 */
export function buildProductOptions(index, category, imageCount) {
  const n = Math.max(1, imageCount)
  const colorCount = 3 + (index % 2)
  const colors = COLOR_SWATCHES.slice(0, colorCount).map((c, idx) => ({
    ...c,
    imageIndex: idx % n,
  }))

  /** @param {string[]} labels */
  const pills = (labels) =>
    labels.map((label, j) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      priceDelta: j * 6,
    }))

  /** @type {ProductOptionGroup} */
  const colorGroup = { id: 'color', label: 'Color', type: 'swatch', values: colors }

  /** @type {ProductOptionGroup} */
  let second
  switch (category) {
    case 'study':
      second = { id: 'format', label: 'Format', type: 'pill', values: pills(['Pocket', 'Standard', 'Archive']) }
      break
    case 'gear':
      second = { id: 'tier', label: 'Tier', type: 'pill', values: pills(['Compact', 'Standard', 'Pro']) }
      break
    case 'print':
      second = { id: 'size', label: 'Size', type: 'pill', values: pills(['A4', 'A3', 'Poster']) }
      break
    default:
      second = { id: 'size', label: 'Size', type: 'pill', values: pills(['XS', 'S', 'M', 'L', 'XL']) }
  }

  const groups = [colorGroup, second]

  if (category === 'print') {
    groups.push({
      id: 'finish',
      label: 'Finish',
      type: 'pill',
      values: [
        { id: 'matte', label: 'Matte', priceDelta: 0 },
        { id: 'gloss', label: 'Gloss', priceDelta: 14 },
        { id: 'deckle', label: 'Deckle', priceDelta: 22 },
      ],
    })
  } else if (category === 'gear') {
    groups.push({
      id: 'warranty',
      label: 'Coverage',
      type: 'pill',
      values: [
        { id: '1y', label: '1 yr', priceDelta: 0 },
        { id: '2y', label: '2 yr', priceDelta: 18 },
        { id: '3y', label: '3 yr', priceDelta: 32 },
      ],
    })
  }

  return groups
}

/**
 * @param {{ price: number, optionGroups?: ProductOptionGroup[] } | null} product
 * @param {Record<string, string>} selections optionId -> valueId
 */
export function computeVariantPrice(product, selections) {
  if (!product) return 0
  let total = Number(product.price) || 0
  const groups = product.optionGroups ?? []
  for (const g of groups) {
    if (!g?.values?.length) continue
    const vid = selections[g.id]
    const v = g.values.find((x) => x.id === vid)
    if (!v) continue
    const d = v.priceDelta
    const n = typeof d === 'number' && !Number.isNaN(d) ? d : Number(d)
    if (Number.isFinite(n)) total += n
  }
  return total
}

/**
 * @param {ProductOptionGroup[]} optionGroups
 * @returns {Record<string, string>}
 */
export function defaultOptionSelections(optionGroups) {
  /** @type {Record<string, string>} */
  const s = {}
  for (const g of optionGroups) {
    if (g.values?.length) s[g.id] = g.values[0].id
  }
  return s
}

/** Matches union_students_back catalog university slugs for demo filtering. */
export const PRODUCT_UNIVERSITY_SLUGS = [
  'tuit',
  'nuu',
  'wiut',
  'tsul',
  'medic',
  'sam-poly',
  'sam-uni',
  'bukh-inno',
  'bukh-ped',
  'ferg-poly',
  'andijan-med',
  'other',
]

const NAMES = [
  ['Chromatic notebook', 'study'],
  ['Meridian tote', 'wear'],
  ['Field thermos', 'gear'],
  ['Riso poster set', 'print'],
  ['Graph paper vault', 'study'],
  ['Wool studio cap', 'wear'],
  ['Modular desk lamp', 'gear'],
  ['Zine bundle 04', 'print'],
  ['Cipher pencil case', 'study'],
  ['Fleece corridor jacket', 'wear'],
  ['Bluetooth labeler', 'gear'],
  ['Screenprint tee', 'wear'],
  ['Index card tower', 'study'],
  ['Alloy key organizer', 'gear'],
  ['Letterpress cards', 'print'],
  ['Velvet lanyard', 'wear'],
  ['Beam projector mini', 'gear'],
  ['Carbon sketchbook', 'study'],
]

export const COLLECTION_PRODUCTS = NAMES.map(([name, category], i) => {
  const tag = COLLECTION_TAGS[i % COLLECTION_TAGS.length]
  const price = 18 + ((i * 7 + 11) % 94)
  const imgCount = i % 4 === 0 ? 4 : i % 3 === 1 ? 2 : 3
  const images = Array.from({ length: imgCount }, (_, j) => {
    const seed = `unioncol${i}img${j}`
    return `https://picsum.photos/seed/${seed}/960/1200`
  })
  const thumbSeed = `unioncol${i}img0`
  return {
    id: `col-${i + 1}`,
    name,
    category,
    tag,
    universitySlug: PRODUCT_UNIVERSITY_SLUGS[i % PRODUCT_UNIVERSITY_SLUGS.length],
    price,
    featuredScore: (i * 13 + 5) % 100,
    /** First frame — used on collection cards */
    image: `https://picsum.photos/seed/${thumbSeed}/640/800`,
    /** Same as images[0] at higher resolution */
    imageLg: images[0],
    /** Full gallery for the product page (order = display order) */
    images,
    /** Axes (Color, Size, …) for the picker — no per-value pricing; bundles own price/images */
    optionGroups: buildProductOptions(i, category, imgCount),
  }
})

/**
 * @param {{ images?: string[], imageLg?: string, image?: string }} product
 * @returns {string[]}
 */
export function getProductGalleryImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) return [...product.images]
  if (product.imageLg) return [product.imageLg]
  if (product.image) return [product.image]
  return []
}

/**
 * API store products: each bundle is a full combination with its own price and images.
 * @param {{ variants?: Array<{ id?: string, selection: Record<string, string> }> } | null} product
 * @param {Record<string, string>} selections
 */
export function findBundleBySelections(product, selections) {
  if (!product?.variants?.length) return null
  for (const b of product.variants) {
    const sel = b.selection
    if (!sel || typeof sel !== 'object') continue
    const keys = new Set([...Object.keys(sel), ...Object.keys(selections)])
    let match = true
    for (const k of keys) {
      if (sel[k] !== selections[k]) {
        match = false
        break
      }
    }
    if (match) return b
  }
  return null
}

/**
 * @param {Parameters<findBundleBySelections>[0]} product
 * @param {Record<string, string>} selections
 */
export function resolveActiveBundle(product, selections) {
  if (!product?.variants?.length) return null
  const exact = findBundleBySelections(product, selections)
  if (exact) return exact
  return product.variants[0] ?? null
}

/** @param {string} id */
export function getCollectionProductById(id) {
  return COLLECTION_PRODUCTS.find((p) => p.id === id) ?? null
}

/** @param {string} categoryId @param {string} [exceptId] */
export function getRelatedCollectionProducts(categoryId, exceptId, limit = 4) {
  return COLLECTION_PRODUCTS.filter((p) => p.category === categoryId && p.id !== exceptId).slice(0, limit)
}
