import { getUniversityBySlug } from '../api/catalogApi.js'

export const UNIVERSITY_HERO_VIDEOS = [
  'https://media.istockphoto.com/id/1364131749/video/female-junior-high-teacher-supervising-students-taking-exam-at-desks.mp4?s=mp4-640x640-is&k=20&c=nJKmCkCm7uhZEg9wUacaMtfUQpyHoHNGQ-AhyiABzg8=',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '/banner.mp4',
]

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Build rich detail from API catalog row (same fields as /universities/:slug).
 * @param {object} u
 * @param {string} u.id
 * @param {string} u.name
 * @param {string} u.shortDetail
 * @param {string} u.image
 * @param {string} u.region
 * @param {string} u.regionLabel
 * @returns {object | null}
 */
export function buildUniversityDetailView(u) {
  if (!u) return null
  const id = u.id
  const idx = hashString(String(id)) % 1000

  return {
    id: u.id,
    name: u.name,
    region: u.region,
    shortDetail: u.shortDetail,
    image: u.image,
    regionLabel: u.regionLabel,
    heroVideo: UNIVERSITY_HERO_VIDEOS[idx % UNIVERSITY_HERO_VIDEOS.length],
    tagline: u.shortDetail,
    paragraphs: [
      {
        en: `${u.name} has grown into a corridor where research, craft, and industry briefs meet. Labs stay open late, and mentors arrive from both campus and partner studios.`,
        uz: `${u.name} tadqiqot, amaliyot va sanoat tajribasi kesishadigan markazga aylandi. Laboratoriyalar kechgacha ochiq bo‘ladi.`,
        ru: `${u.name} стал пространством, где встречаются исследования, практика и индустриальные задачи. Лаборатории работают допоздна.`,
      },
      {
        en: `Programs lean on live projects: cohorts prototype in short sprints, present to panels, then fold feedback into the next cycle — closer to a product studio than a lecture-only track.`,
        uz: `Dasturlar jonli loyihalarga tayanadi: jamoalar qisqa sprintlarda prototip yaratadi, taqdim etadi va feedback asosida keyingi bosqichni boshlaydi.`,
        ru: `Программы опираются на реальные проекты: команды делают прототипы в коротких спринтах, защищают и учитывают обратную связь.`,
      },
      {
        en: `Campus life mixes regional heritage with maker culture: courtyards for quiet study, halls wired for streaming defenses, and student-run pop-ups that test Union shop drops each term.`,
        uz: `Kampus hayoti hududiy meros va maker madaniyatini uyg‘unlashtiradi: sokin o‘qish joylari, himoyalar uchun jihozlangan zallar va talabalar pop-up loyihalari.`,
        ru: `Жизнь кампуса сочетает региональные традиции и maker-культуру: тихие зоны, залы для защит и студенческие pop-up проекты.`,
      },
    ],
    stats: [
      { label: { en: 'Schools & faculties', uz: 'Maktablar va fakultetlar', ru: 'Школы и факультеты' }, value: `${6 + (idx % 4)}` },
      { label: { en: 'Labs & studios', uz: 'Laboratoriyalar va studiyalar', ru: 'Лаборатории и студии' }, value: `${22 + (idx % 200) * 2}` },
      { label: { en: 'Industry partners', uz: 'Sanoat hamkorlari', ru: 'Индустриальные партнеры' }, value: `${35 + (idx % 200) * 3}` },
      { label: { en: 'Campus hectares', uz: 'Kampus gektarlari', ru: 'Гектары кампуса' }, value: `${(1.1 + (idx % 50) * 0.08).toFixed(1)}` },
    ],
    shopHeadline: {
      en: 'Campus collections',
      uz: 'Kampus kolleksiyalari',
      ru: 'Коллекции кампуса',
    },
    shopIntro: {
      en: 'Curated drops for study, wear, and lab — open the storefront to filter by this university and explore everything in one place.',
      uz: 'O‘qish, kiyim va laboratoriya uchun tanlangan to‘plamlar — do‘konda shu universitet bo‘yicha filtrlab barchasini ko‘ring.',
      ru: 'Подборки для учёбы, одежды и лабораторий — откройте витрину с фильтром по этому университету.',
    },
    shopBullets: [
      {
        en: 'Order online — pick up between classes with a single QR tap',
        uz: 'Onlayn buyurtma bering — darslar oralig‘ida QR orqali olib keting',
        ru: 'Заказывайте онлайн — забирайте между парами по QR',
      },
      {
        en: 'Bundles pair courseware with textiles, tools, and alumni-made editions',
        uz: 'To‘plamlar kurs materiallari, tekstil va asboblarni birlashtiradi',
        ru: 'Наборы сочетают учебные материалы, текстиль и инструменты',
      },
      {
        en: 'Hassle returns through week four of each teaching period',
        uz: 'O‘quv davrining to‘rtinchi haftasigacha qulay qaytarish',
        ru: 'Удобный возврат до четвертой недели учебного периода',
      },
    ],
  }
}

/**
 * @param {string} id
 * @returns {Promise<object | null>}
 */
export async function fetchUniversityDetailView(id) {
  try {
    const row = await getUniversityBySlug(id)
    return buildUniversityDetailView(row)
  } catch {
    return null
  }
}
