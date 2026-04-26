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
    { name: 'Studio notebook', price: 18, img: `https://picsum.photos/seed/${u.id}shop1/240/240` },
    { name: 'Lab kit pouch', price: 42, img: `https://picsum.photos/seed/${u.id}shop2/240/240` },
    { name: 'Union thermos', price: 28, img: `https://picsum.photos/seed/${u.id}shop3/240/240` },
  ]

  return {
    ...u,
    regionLabel,
    heroVideo: UNIVERSITY_HERO_VIDEOS[idx % UNIVERSITY_HERO_VIDEOS.length],
    tagline: u.shortDetail,
    paragraphs: [
      `${u.name} has grown into a corridor where research, craft, and industry briefs meet. Labs stay open late, and mentors arrive from both campus and partner studios.`,
      `Programs lean on live projects: cohorts prototype in short sprints, present to panels, then fold feedback into the next cycle — closer to a product studio than a lecture-only track.`,
      `Campus life mixes regional heritage with maker culture: courtyards for quiet study, halls wired for streaming defenses, and student-run pop-ups that test Union shop drops each term.`,
    ],
    stats: [
      { label: 'Schools & faculties', value: `${6 + (idx % 4)}` },
      { label: 'Labs & studios', value: `${22 + idx * 2}` },
      { label: 'Industry partners', value: `${35 + idx * 3}` },
      { label: 'Campus hectares', value: `${(1.1 + idx * 0.08).toFixed(1)}` },
    ],
    shopHeadline: "Let's shop Union products",
    shopIntro:
      'Campus smart-lockers, limited drops, and bundles built with your timetable in mind — every purchase helps fund student maker grants.',
    shopBullets: [
      'Order online — pick up between classes with a single QR tap',
      'Bundles pair courseware with textiles, tools, and alumni-made editions',
      'Hassle returns through week four of each teaching period',
    ],
    shopProductTeasers,
  }
}
