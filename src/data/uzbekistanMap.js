import pathList from './uzbekistanPaths.json'

/**
 * Interactive regions — path order matches `public/maps/uzbekistan-map.svg` (13 paths).
 * Universities catalog: tashkent | samarkand | bukhara | fergana | other
 */
export const UZ_MAP_ATTRIBUTION = {
  title: 'Uzbekistan map',
  note:
    'Vector artwork used for this interactive demo. Region labels are approximate for navigation; verify against official sources for geographic work.',
  licenseUrl: '',
  referenceUrl: '',
}

const DEFS = [
  {
    id: 'uz-west',
    labelEn: 'Western regions (Karakalpakstan & Khorezm)',
    labelUz: 'Gʻarbiy hududlar',
    catalogRegionId: 'other',
  },
  {
    id: 'uz-north',
    labelEn: 'North & capital area',
    labelUz: 'Shimol va poytaxt atrofi',
    catalogRegionId: 'tashkent',
  },
  {
    id: 'uz-central',
    labelEn: 'Central steppe & Zarafshan',
    labelUz: 'Markaziy va Zarafshon',
    catalogRegionId: 'samarkand',
  },
  {
    id: 'uz-south',
    labelEn: 'South (Surkhandarya & border)',
    labelUz: 'Janub',
    catalogRegionId: 'other',
  },
  {
    id: 'uz-southeast-a',
    labelEn: 'Southeast',
    labelUz: 'Janubi-sharq',
    catalogRegionId: 'other',
  },
  {
    id: 'uz-south-edge',
    labelEn: 'South foothills',
    labelUz: 'Janubiy etag',
    catalogRegionId: 'other',
  },
  {
    id: 'uz-east-a',
    labelEn: 'Eastern valleys',
    labelUz: 'Sharqiy vodiy',
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-east-center',
    labelEn: 'East–central',
    labelUz: 'Markaziy-sharq',
    catalogRegionId: 'samarkand',
  },
  {
    id: 'uz-east-b',
    labelEn: 'Far northeast',
    labelUz: 'Uzoq shimoli-sharq',
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-northeast',
    labelEn: 'Northeast',
    labelUz: 'Shimoli-sharq',
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-west-central',
    labelEn: 'Bukhara & west-central',
    labelUz: 'Buxoro va markaziy-gʻarb',
    catalogRegionId: 'bukhara',
  },
  {
    id: 'uz-east-tip',
    labelEn: 'Eastern border',
    labelUz: 'Sharqiy chegara',
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-east-mid',
    labelEn: 'East-central detail',
    labelUz: 'Sharqiy-markaziy',
    catalogRegionId: 'other',
  },
]

if (pathList.length !== DEFS.length) {
  console.warn(`[uzbekistanMap] expected ${DEFS.length} paths, got ${pathList.length}`)
}

/** @type {{ id: string; labelEn: string; labelUz: string; path: string; catalogRegionId: string }[]} */
export const UZ_REGIONS = DEFS.map((row, i) => ({
  ...row,
  path: pathList[i] ?? '',
}))

export const UZ_MAP_VIEWBOX = '0 0 860 561'
