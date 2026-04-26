/** Demo feed for the News wire page (no backend). */

export const NEWS_CATEGORIES = [
  { en: 'All', uz: 'Barchasi', ru: 'Все' },
  { en: 'Campus', uz: 'Kampus', ru: 'Кампус' },
  { en: 'Labs', uz: 'Laboratoriyalar', ru: 'Лаборатории' },
  { en: 'Culture', uz: 'Madaniyat', ru: 'Культура' },
  { en: 'Code', uz: 'Kod', ru: 'Код' },
]

export const NEWS_ITEMS = [
  {
    id: 'n-1',
    category: { en: 'Campus', uz: 'Kampus', ru: 'Кампус' },
    title: {
      en: 'Night classes quietly reshape the library floor plan',
      uz: "Kechki darslar kutubxona ishlash tartibini o'zgartirmoqda",
      ru: 'Вечерние занятия меняют привычный ритм библиотеки',
    },
    dek: {
      en: 'Circulation data from three semesters suggests a permanent shift in how quiet zones are used after 9pm.',
      uz: "Uch semestr ma'lumotlari 21:00 dan keyingi jim zonalar foydalanishi o'zgarganini ko'rsatadi.",
      ru: 'Данные за три семестра показывают устойчивое изменение использования тихих зон после 21:00.',
    },
    date: '2026-04-22',
    readMin: 6,
    featured: true,
  },
  {
    id: 'n-2',
    category: { en: 'Labs', uz: 'Laboratoriyalar', ru: 'Лаборатории' },
    title: {
      en: 'Open bench policy draws twice as many cross-major teams',
      uz: "Ochiq laboratoriya siyosati yo'nalishlararo jamoalarni ikki baravar oshirdi",
      ru: 'Политика открытых рабочих мест удвоила междисциплинарные команды',
    },
    dek: {
      en: 'Co-authored projects jumped when equipment check-out moved to a trust-based model.',
      uz: "Uskuna berish ishonch modeliga o'tgach hamkorlikdagi loyihalar ko'paydi.",
      ru: 'После перехода на модель доверительного доступа к оборудованию число совместных проектов выросло.',
    },
    date: '2026-04-20',
    readMin: 4,
    featured: false,
  },
  {
    id: 'n-3',
    category: { en: 'Code', uz: 'Kod', ru: 'Код' },
    title: {
      en: 'Student CLI tools are replacing five admin dashboards',
      uz: "Talabalar yozgan CLI vositalari beshta admin panelni almashtirmoqda",
      ru: 'Студенческие CLI-инструменты заменяют пять админ-панелей',
    },
    dek: {
      en: 'A grassroots toolkit written in Rust and TypeScript is winning on speed and transparency.',
      uz: 'Rust va TypeScriptda yozilgan vositalar tezlik va shaffoflik bo‘yicha oldinga chiqdi.',
      ru: 'Набор инструментов на Rust и TypeScript выигрывает по скорости и прозрачности.',
    },
    date: '2026-04-18',
    readMin: 8,
    featured: false,
  },
  {
    id: 'n-4',
    category: { en: 'Culture', uz: 'Madaniyat', ru: 'Культура' },
    title: {
      en: 'Poster archive digitised - browse by ink smell (almost)',
      uz: "Poster arxivi raqamlashtirildi - deyarli bo'yoq hidi bo'yicha ham qidirish mumkin",
      ru: 'Архив постеров оцифрован - почти можно искать даже по запаху краски',
    },
    dek: {
      en: 'Tongue-in-cheek metadata fields are driving unexpected engagement in the union’s riso vault.',
      uz: "Qiziqarli metadata maydonlari Union riso arxiviga qiziqishni oshirdi.",
      ru: 'Ироничные поля метаданных неожиданно повысили вовлеченность в архиве riso.',
    },
    date: '2026-04-15',
    readMin: 3,
    featured: false,
  },
  {
    id: 'n-5',
    category: { en: 'Campus', uz: 'Kampus', ru: 'Кампус' },
    title: {
      en: 'Shuttle pilot: fewer loops, more predictable headways',
      uz: "Shuttle pilot: kamroq aylana, aniqroq interval",
      ru: 'Пилот шаттла: меньше петель, предсказуемее интервалы',
    },
    dek: {
      en: 'GPS traces from spring break week informed a counter-intuitive simplification of the route map.',
      uz: "Bahorgi ta'tildagi GPS izlari marshrutni soddalashtirish qarorini qo'llab-quvvatladi.",
      ru: 'GPS-данные за весенние каникулы помогли упростить карту маршрута.',
    },
    date: '2026-04-12',
    readMin: 5,
    featured: false,
  },
  {
    id: 'n-6',
    category: { en: 'Labs', uz: 'Laboratoriyalar', ru: 'Лаборатории' },
    title: {
      en: 'Safety drills now include “graceful degradation” scenarios',
      uz: "Xavfsizlik mashg'ulotlariga endi graceful degradation ssenariylari ham kiritildi",
      ru: 'Тренировки безопасности теперь включают сценарии graceful degradation',
    },
    dek: {
      en: 'Borrowed from SRE playbooks, the new drill cards keep labs calmer during simulated outages.',
      uz: "SRE amaliyotidan olingan yangi kartalar uzilishlarda laboratoriyalarni barqaror ushlab turadi.",
      ru: 'Новые карточки учений из практик SRE помогают лабораториям спокойнее проходить симулированные сбои.',
    },
    date: '2026-04-09',
    readMin: 4,
    featured: false,
  },
  {
    id: 'n-7',
    category: { en: 'Code', uz: 'Kod', ru: 'Код' },
    title: {
      en: 'Union site template ships with motion presets you can fork',
      uz: "Union sayt shabloni fork qilinadigan motion presetlar bilan keladi",
      ru: 'Шаблон сайта Union поставляется с motion-пресетами, которые можно форкнуть',
    },
    dek: {
      en: 'This very codebase is the reference implementation - remix routes, keep the theme contract.',
      uz: "Aynan shu kod bazasi reference implementation hisoblanadi - route'larni o'zgartiring, tema kontraktini saqlang.",
      ru: 'Этот репозиторий - эталонная реализация: меняйте маршруты, сохраняя контракт темы.',
    },
    date: '2026-04-06',
    readMin: 7,
    featured: false,
  },
]
