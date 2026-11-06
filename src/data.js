// Moonshot: content + palette (single source of truth).
// Palette keys keep the roles of the reference build (cream base, gold, orange, navy, …) with Moonshot's own colours.

export const C = {
  cream: '#f6f3ff', // moon-white page ground
  ink: '#17142e', // midnight ink
  mango: '#ffa94d', // apricot (the "gold" role: buttons, overlays, insta field)
  saffron: '#ff7a1a', // tangerine (default button)
  lavender: '#9fb4ff', // periwinkle
  jamun: '#2a1f6b', // indigo
  guava: '#ff7f9e', // coral pink
  chilli: '#e8364f', // signal red
  lime: '#7ee0c3', // mint aqua
  mint: '#0d5c50', // deep teal
  sky: '#c3b1ff', // lilac
  navy: '#1e1b4b', // midnight (bandeau, rockets)
  white: '#ffffff',
  night: '#0d0b21', // page ground (dark theme)
  panel: '#1a1640', // raised surfaces
  pack: '#1f2a5c', // discovery box tiles
  moon: '#f3eee0', // moonlight text
  gold: '#ffc75a', // primary buttons
};

// Order = hero wheel order (step0..3, repeated as step4..7)
export const FLAVOURS = [
  {
    id: 'mango',
    name: 'Alphonso Mango',
    short: 'Mango',
    bg: '#2a1d5c',
    accent: '#ffb547',
    label: { band: '#ffb547', word: '#f3eee0', tint: '#3b2b78' },
    fruitLine: 'Alphonso mango · lime',
    tagline: 'Golden hour, at midnight.',
    notes: 'Ripe Ratnagiri Alphonso with a squeeze of lime and a lot of fizz. Round, sunny and dangerously easy to drink at 2 a.m.',
    big: 'MANGO',
  },
  {
    id: 'jamun',
    name: 'Jamun & Black Salt',
    short: 'Jamun',
    bg: '#0b3a42',
    accent: '#b9a7ff',
    label: { band: '#b9a7ff', word: '#f3eee0', tint: '#11505a' },
    fruitLine: 'Black jamun · kokum · kala namak',
    tagline: 'The kala khatta gola, grown up.',
    notes: 'Black jamun and kokum with a pinch of kala namak. Tangy, salty, a little moody, exactly like the gola outside school.',
    big: 'JAMUN',
  },
  {
    id: 'guava',
    name: 'Guava & Chilli',
    short: 'Guava',
    bg: '#0f3527',
    accent: '#ff8fb1',
    label: { band: '#ff8fb1', word: '#f3eee0', tint: '#174a37' },
    fruitLine: 'Pink guava · Kashmiri chilli',
    tagline: 'Sweet start, warm finish.',
    notes: 'Pink guava from the cart with red chilli and salt pressed into it. Sweet first, then a slow, friendly burn.',
    big: 'GUAVA',
  },
  {
    id: 'nimbu',
    name: 'Nimbu Mint',
    short: 'Nimbu',
    bg: '#3a1238',
    accent: '#a6ec74',
    label: { band: '#a6ec74', word: '#f3eee0', tint: '#4e1a4b' },
    fruitLine: 'Kagzi lime · fresh pudina',
    tagline: 'Cold, sharp, lucky.',
    notes: 'Kagzi lime and fresh pudina, extra fizzy. A nimbu soda that keeps you up instead of putting you to sleep.',
    big: 'NIMBU',
  },
];

export const BENEFITS = [
  { title: 'Without the crash', text: 'A slow climb and a soft landing. No 4 a.m. nosedive.', icon: 'wave' },
  { title: 'Plant caffeine', text: '80 mg from green coffee beans and green tea leaves. Grown, not synthesised.', icon: 'bean' },
  { title: 'Electrolytes', text: 'Pink salt and coconut-water minerals, because all-nighters dry you out.', icon: 'drop' },
  { title: 'Barely sweet', text: 'Just 5 g of cane sugar a can. Your dentist says thanks.', icon: 'cube' },
];

export const PRODUCTS = [
  ...FLAVOURS.map((f) => ({ id: f.id, name: f.name, flavour: f, price: 649, price24: 1199, unit: '12 cans' })),
  { id: 'pack', name: 'Discovery box', flavour: null, price: 699, price24: 1349, unit: '12 cans · 3 of each' },
];

export const PACK_COPY = {
  name: 'Discovery box',
  tagline: 'Can’t pick? Take all four.',
  notes: 'Twelve cans, three of each flavour. The easiest way to find your favourite (and your flatmate’s).',
  big: 'ALL FOUR',
};

export const INGREDIENTS = [
  '80 mg of caffeine from green coffee beans and green tea',
  'Carbonated water',
  'Real fruit: 5 to 8% pulp or juice',
  'Organic cane sugar, 5 g a can',
  'Pink salt and coconut-water minerals',
  'Lime juice',
  'Natural flavours, nothing else',
];

export const NUTRITION = [
  ['Calories', '28', ''],
  ['Fat', '0 g', '0%'],
  ['Carbohydrates', '6.4 g', ''],
  ['Sugars', '5 g', '5%'],
  ['Protein', '0 g', ''],
  ['Sodium', '38 mg', '2%'],
  ['Potassium', '90 mg', '2%'],
  ['Caffeine', '80 mg', ''],
];

export const LEARN = [
  { id: 'stores', name: 'Where to buy', art: 'stores' },
  { id: 'green-coffee', name: 'Green coffee', art: 'bean' },
  { id: 'faq', name: 'FAQ', art: 'faq' },
  { id: 'contact', name: 'Contact', art: 'contact' },
];

export const INR = (n) => '₹' + n.toLocaleString('en-IN');
export const flavour = (id) => FLAVOURS.find((f) => f.id === id);
