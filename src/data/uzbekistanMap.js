import pathList from './uzbekistanPaths.json'

/**
 * Interactive regions — path order matches `public/maps/uzbekistan-map.svg` (13 paths).
 * Universities catalog: tashkent | samarkand | bukhara | fergana | other
 */
export const UZ_MAP_ATTRIBUTION = {
  title: {
    en: 'Uzbekistan map',
    uz: "O'zbekiston xaritasi",
    ru: 'Карта Узбекистана',
  },
  note: {
    en: 'Vector artwork used for this interactive demo. Region labels are approximate for navigation; verify against official sources for geographic work.',
    uz: "Ushbu interaktiv demo uchun vektor xarita ishlatilgan. Hudud nomlari navigatsiya uchun taxminiy.",
    ru: 'В этом интерактивном демо используется векторная карта. Названия регионов приблизительны для навигации.',
  },
  licenseUrl: '',
  referenceUrl: '',
}

const DEFS = [
  {
    id: 'uz-west',
    label: {
      en: 'Western regions (Karakalpakstan & Khorezm)',
      uz: "G'arbiy hududlar (Qoraqalpog'iston va Xorazm)",
      ru: 'Западные регионы (Каракалпакстан и Хорезм)',
    },
    catalogRegionId: 'other',
  },
  {
    id: 'uz-north',
    label: {
      en: 'North & capital area',
      uz: 'Shimol va poytaxt atrofi',
      ru: 'Север и столичный регион',
    },
    catalogRegionId: 'tashkent',
  },
  {
    id: 'uz-central',
    label: {
      en: 'Central steppe & Zarafshan',
      uz: 'Markaziy hudud va Zarafshon',
      ru: 'Центральная степь и Зарафшан',
    },
    catalogRegionId: 'samarkand',
  },
  {
    id: 'uz-south',
    label: {
      en: 'South (Surkhandarya & border)',
      uz: 'Janub (Surxondaryo va chegara)',
      ru: 'Юг (Сурхандарья и граница)',
    },
    catalogRegionId: 'other',
  },
  {
    id: 'uz-southeast-a',
    label: {
      en: 'Southeast',
      uz: 'Janubi-sharq',
      ru: 'Юго-восток',
    },
    catalogRegionId: 'other',
  },
  {
    id: 'uz-south-edge',
    label: {
      en: 'South foothills',
      uz: "Janubiy etak hududlar",
      ru: 'Южные предгорья',
    },
    catalogRegionId: 'other',
  },
  {
    id: 'uz-east-a',
    label: {
      en: 'Eastern valleys',
      uz: 'Sharqiy vodiylar',
      ru: 'Восточные долины',
    },
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-east-center',
    label: {
      en: 'East-central',
      uz: "Markaziy-sharq",
      ru: 'Восточно-центральный регион',
    },
    catalogRegionId: 'samarkand',
  },
  {
    id: 'uz-east-b',
    label: {
      en: 'Far northeast',
      uz: 'Uzoq shimoli-sharq',
      ru: 'Дальний северо-восток',
    },
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-northeast',
    label: {
      en: 'Northeast',
      uz: 'Shimoli-sharq',
      ru: 'Северо-восток',
    },
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-west-central',
    label: {
      en: 'Bukhara & west-central',
      uz: "Buxoro va markaziy-g'arb",
      ru: 'Бухара и западно-центральный регион',
    },
    catalogRegionId: 'bukhara',
  },
  {
    id: 'uz-east-tip',
    label: {
      en: 'Eastern border',
      uz: 'Sharqiy chegara',
      ru: 'Восточная граница',
    },
    catalogRegionId: 'fergana',
  },
  {
    id: 'uz-east-mid',
    label: {
      en: 'East-central detail',
      uz: 'Sharqiy-markaziy',
      ru: 'Деталь восточно-центрального региона',
    },
    catalogRegionId: 'other',
  },
]

if (pathList.length !== DEFS.length) {
  console.warn(`[uzbekistanMap] expected ${DEFS.length} paths, got ${pathList.length}`)
}

/** @type {{ id: string; label: { en: string; uz: string; ru: string }; path: string; catalogRegionId: string }[]} */
export const UZ_REGIONS = DEFS.map((row, i) => ({
  ...row,
  path: pathList[i] ?? '',
}))

export const UZ_MAP_VIEWBOX = '0 0 860 561'
