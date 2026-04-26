import { REGIONS, UNIVERSITIES_CATALOG } from './universitiesCatalog.js'

export const UNIVERSITY_HERO_VIDEOS = [
  'https://media.istockphoto.com/id/1364131749/video/female-junior-high-teacher-supervising-students-taking-exam-at-desks.mp4?s=mp4-640x640-is&k=20&c=nJKmCkCm7uhZEg9wUacaMtfUQpyHoHNGQ-AhyiABzg8=',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '/banner.mp4',
]

/** @returns {object | null} */
export function getUniversityDetail(id) {
  const idx = UNIVERSITIES_CATALOG.findIndex((u) => u.id === id)
  if (idx === -1) return null
  const u = UNIVERSITIES_CATALOG[idx]
  const regionLabel = REGIONS.find((r) => r.id === u.region)?.label ?? u.region

  const shopProductTeasers = [
    {
      name: { en: 'Studio notebook', uz: 'Studio daftari', ru: 'Блокнот Studio' },
      price: 18,
      img: `https://picsum.photos/seed/${u.id}shop1/240/240`,
    },
    {
      name: { en: 'Lab kit pouch', uz: 'Laboratoriya to‘plam sumkasi', ru: 'Чехол для lab-набора' },
      price: 42,
      img: `https://picsum.photos/seed/${u.id}shop2/240/240`,
    },
    {
      name: { en: 'Union thermos', uz: 'Union termos', ru: 'Термос Union' },
      price: 28,
      img: `https://picsum.photos/seed/${u.id}shop3/240/240`,
    },
  ]

  return {
    ...u,
    regionLabel,
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
      { label: { en: 'Labs & studios', uz: 'Laboratoriyalar va studiyalar', ru: 'Лаборатории и студии' }, value: `${22 + idx * 2}` },
      { label: { en: 'Industry partners', uz: 'Sanoat hamkorlari', ru: 'Индустриальные партнеры' }, value: `${35 + idx * 3}` },
      { label: { en: 'Campus hectares', uz: 'Kampus gektarlari', ru: 'Гектары кампуса' }, value: `${(1.1 + idx * 0.08).toFixed(1)}` },
    ],
    shopHeadline: {
      en: "Let's shop Union products",
      uz: 'Union mahsulotlarini tanlang',
      ru: 'Покупайте товары Union',
    },
    shopIntro: {
      en: 'Campus smart-lockers, limited drops, and bundles built with your timetable in mind — every purchase helps fund student maker grants.',
      uz: 'Kampus smart-locker, cheklangan drop va jadvalga mos to‘plamlar — har bir xarid talabalar grantini qo‘llab-quvvatlaydi.',
      ru: 'Смарт-локеры кампуса, лимитированные дропы и наборы под расписание — каждая покупка поддерживает студенческие гранты.',
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
    shopProductTeasers,
  }
}
