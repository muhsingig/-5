// Hand-built SVG illustration kit for Moonshot.
// Every function returns an SVG/markup string so the same art can be used
// in the DOM (hero scenes, cards, menus) and rasterised onto the 3D can label.
import { C } from './data.js';

let uid = 0;
const id = (p) => `${p}${++uid}`;
const INK = C.ink;

/* ---------- primitives ---------- */
export const sparklePath = 'M0-10C1.3-2.2 2.2-1.3 10 0 2.2 1.3 1.3 2.2 0 10-1.3 2.2-2.2 1.3-10 0-2.2-1.3-1.3-2.2 0-10Z';
export const boltPath = 'M15 0 2 23h9.5L6 42 24 15.5h-9.6L19.5 0Z';

export const sparkle = (x, y, s, fill = C.cream) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" d="${sparklePath}"/>`;

export const bolt = (x, y, s, fill = C.saffron, rot = 0, stroke = '') =>
  `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(-13 -21)" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="${3 / s}" stroke-linejoin="round"` : ''} d="${boltPath}"/>`;

export function burst(cx, cy, r1, r2, n, fill) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? r2 : r1;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon fill="${fill}" points="${pts.join(' ')}"/>`;
}

export function face(cx, cy, s = 1, mood = 'happy', ink = INK) {
  const e = (x) => `<ellipse cx="${x}" cy="${-4}" rx="7.5" ry="9.5" fill="#fff"/><circle cx="${x + 1.5}" cy="${-5.5}" r="4" fill="${ink}"/><circle cx="${x + 3}" cy="${-7.5}" r="1.3" fill="#fff"/>`;
  const cheeks = `<ellipse cx="-24" cy="9" rx="7" ry="4.5" fill="${C.guava}" opacity=".9"/><ellipse cx="24" cy="9" rx="7" ry="4.5" fill="${C.guava}" opacity=".9"/>`;
  let eyes = e(-12) + e(12);
  let mouth = `<path d="M-11 9Q0 26 11 9Z" fill="${ink}"/><path d="M-6 16Q0 22 6 16Q0 13-6 16Z" fill="${C.chilli}"/>`;
  if (mood === 'cool') {
    eyes = `<path d="M-27-12h22a3 3 0 0 1 3 3c0 9-5 15-14 15S-30 0-30-9a3 3 0 0 1 3-3Zm32 0h22a3 3 0 0 1 3 3c0 9-4 15-13 15S2 0 2-9a3 3 0 0 1 3-3Z" fill="${ink}"/><path d="M-5-9h10" stroke="${ink}" stroke-width="3"/><path d="M-24-8l6 0M8-8l6 0" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
    mouth = `<path d="M-9 12Q2 20 12 9" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`;
  }
  if (mood === 'wow') mouth = `<ellipse cx="0" cy="14" rx="6" ry="8" fill="${ink}"/>`;
  if (mood === 'sad') {
    eyes = `<path d="M-19-4q7 5 14 0M5-4q7 5 14 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    mouth = `<path d="M-8 16Q0 8 8 16" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return `<g transform="translate(${cx} ${cy}) scale(${s})">${cheeks}${eyes}${mouth}</g>`;
}

const arm = (d, hx, hy, cls = '', ink = INK) =>
  `<g class="${cls}"><path d="${d}" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="10" fill="#fff" stroke="${ink}" stroke-width="4"/></g>`;

const svg = (vb, body, cls = '') => `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" overflow="visible">${body}</svg>`;

/* ---------- characters & props ---------- */
export const art = {
  mango: () =>
    svg(
      '0 0 340 380',
      `<path d="M188 58c12-40 70-56 96-34-22 26-58 40-96 34Z" fill="#2f8f4e"/><path d="M190 56c30-12 56-22 86-30" stroke="#11603b" stroke-width="3" fill="none"/>
      <rect x="176" y="40" width="10" height="26" rx="5" fill="#6b3b1a" transform="rotate(14 181 53)"/>
      ${arm('M60 214Q18 186 30 136', 30, 132, 'arm-l')}
      ${arm('M286 214Q330 236 326 190', 326, 186, 'arm-r')}
      <g class="legs"><path d="M140 330l-10 32M196 332l10 30" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><ellipse cx="122" cy="364" rx="20" ry="10" fill="${INK}"/><ellipse cx="214" cy="364" rx="20" ry="10" fill="${INK}"/></g>
      <path d="M170 60c80-10 135 70 120 160-12 80-80 120-140 110-70-12-105-70-90-140 12-60 40-120 110-130Z" fill="#ff9a1f"/>
      <path d="M222 92c40 15 62 60 58 100-18-30-43-60-68-80Z" fill="#ffc44a"/>
      <path d="M74 250c20 50 70 76 120 74-60 14-120-14-120-74Z" fill="#ff6a2b" opacity=".75"/>
      ${face(172, 200, 1.6, 'happy')}`
    ),
  mangoCheek: () => {
    const cp = id('mc');
    let cubes = '';
    for (let r = -6; r <= 6; r++) for (let c = -6; c <= 6; c++) cubes += `<rect x="${130 + (c - r) * 17}" y="${110 + (c + r) * 17}" width="26" height="26" rx="6" transform="rotate(45 ${143 + (c - r) * 17} ${123 + (c + r) * 17})" fill="${(r + c) % 2 ? '#ffc44a' : '#ffb21f'}"/>`;
    return svg('0 0 260 230', `<clipPath id="${cp}"><ellipse cx="130" cy="120" rx="112" ry="92"/></clipPath><ellipse cx="130" cy="128" rx="124" ry="98" fill="#ff8a1f"/><ellipse cx="130" cy="120" rx="112" ry="92" fill="#ffd36b"/><g clip-path="url(#${cp})">${cubes}</g>${sparkle(214, 40, 1.4)}${sparkle(40, 196, 1)}`);
  },
  sun: (fill = '#fff1c8') => svg('0 0 300 300', `${burst(150, 150, 150, 92, 14, fill)}`),
  flower: (petal = C.guava, center = C.cream) => {
    let p = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      p += `<circle cx="${100 + Math.cos(a) * 52}" cy="${100 + Math.sin(a) * 52}" r="44" fill="${petal}"/>`;
    }
    return svg('0 0 200 200', `${p}<circle cx="100" cy="100" r="34" fill="${center}"/><circle cx="100" cy="100" r="14" fill="${C.mango}"/>`);
  },
  leaves: (a = '#2f8f4e', b = '#11603b') =>
    svg(
      '0 0 300 260',
      `<path d="M150 250C90 220 30 140 50 40c60 20 110 110 100 210Z" fill="${a}"/><path d="M150 250C120 180 80 110 52 44" stroke="${b}" stroke-width="5" fill="none"/>
      <path d="M150 250c20-80 70-150 140-170-10 80-70 150-140 170Z" fill="${b}"/><path d="M150 250c40-60 90-120 138-168" stroke="${a}" stroke-width="5" fill="none"/>
      <path d="M150 250c-10-60 0-140 40-230 30 80 10 170-40 230Z" fill="#46b06a"/><path d="M150 250c10-70 20-150 40-226" stroke="${b}" stroke-width="5" fill="none"/>`
    ),
  gola: () =>
    svg(
      '0 0 240 400',
      `<rect x="108" y="262" width="24" height="132" rx="10" fill="#f2d29b"/><rect x="108" y="262" width="8" height="132" rx="4" fill="#e3b977"/>
      <path d="M30 160C24 70 216 70 210 160l-30 112c-20 22-100 22-120 0Z" fill="#4b2490"/>
      <path d="M48 130c30-40 120-50 150-6-30-10-60 0-70 30-14-30-50-30-80-24Z" fill="#7a4fd0"/>
      <path d="M62 250c10-30 4-60 20-60 18 0 6 40 12 66ZM150 262c4-40 0-70 18-70 16 2 8 50 4 74Z" fill="#7a4fd0" opacity=".9"/>
      ${Array.from({ length: 26 }, (_, i) => `<circle cx="${50 + ((i * 53) % 150)}" cy="${100 + ((i * 37) % 150)}" r="${2 + (i % 3)}" fill="#fff" opacity=".55"/>`).join('')}
      ${face(120, 188, 1.5, 'cool')}
      ${arm('M40 190Q4 170 14 126', 14, 122, 'arm-l')}${arm('M200 196Q236 210 238 170', 238, 166, 'arm-r')}`
    ),
  moon: () => svg('0 0 220 220', `<path d="M150 18A98 98 0 1 0 204 160 78 78 0 1 1 150 18Z" fill="${C.cream}"/><circle cx="70" cy="118" r="10" fill="#ddd6f2"/><circle cx="96" cy="170" r="7" fill="#ddd6f2"/>${sparkle(190, 50, 1.6)}${sparkle(160, 100, 0.9)}`),
  planet: () =>
    svg(
      '0 0 260 200',
      `<path d="M30 120C-10 150 30 170 130 140" stroke="${C.saffron}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <circle cx="130" cy="100" r="70" fill="${C.mango}"/><path d="M80 70c20-20 60-30 90-12" stroke="#ffd29e" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="160" cy="130" r="12" fill="#f08a2e"/><circle cx="110" cy="80" r="7" fill="#f08a2e"/>
      <path d="M130 140c100-30 140-70 100-80" stroke="${C.saffron}" stroke-width="14" fill="none" stroke-linecap="round"/>`
    ),
  jamun: () =>
    svg(
      '0 0 260 300',
      `<path d="M128 56c-4-30 10-46 30-52-6 20-14 36-30 52Z" fill="#2f8f4e"/><path d="M130 60c20-30 70-40 100-20-30 26-66 30-100 20Z" fill="#46b06a"/>
      ${arm('M40 170Q0 160 8 120', 8, 116, 'arm-l')}${arm('M222 176Q262 176 256 136', 256, 132, 'arm-r')}
      <ellipse cx="130" cy="170" rx="100" ry="112" fill="#3a1a66"/><ellipse cx="96" cy="110" rx="26" ry="16" fill="#6c45b8" transform="rotate(-30 96 110)"/>
      <path d="M60 230c30 40 100 50 140 10" stroke="#5a2f9e" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
      ${face(132, 172, 1.55, 'happy')}`
    ),
  guavaHalf: () => {
    let seeds = '';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      seeds += `<ellipse cx="${150 + Math.cos(a) * 74}" cy="${150 + Math.sin(a) * 74}" rx="6" ry="9" transform="rotate(${(a * 180) / Math.PI} ${150 + Math.cos(a) * 74} ${150 + Math.sin(a) * 74})" fill="#ffe9c9"/>`;
    }
    return svg('0 0 300 300', `<circle cx="150" cy="150" r="146" fill="#6cbf4a"/><circle cx="150" cy="150" r="132" fill="#ffe0cf"/><circle cx="150" cy="150" r="114" fill="#ff6f91"/><circle cx="150" cy="150" r="54" fill="#ff8fab"/>${seeds}${face(150, 150, 1.5, 'happy')}`);
  },
  chilli: (body = C.chilli, cap = '#2f8f4e', mood = 'cool') =>
    svg(
      '0 0 220 380',
      `<g class="flame"><path d="M58 352c-30 0-34-36-16-50 0 16 10 18 14 10 0-16 18-26 24-40 10 30 22 80-22 80Z" fill="${C.mango}"/><path d="M60 344c-14 0-14-16-6-22 2 8 8 6 8 2 4-8 10-10 12-18 6 16 4 38-14 38Z" fill="${C.saffron}"/></g>
      <path d="M104 46c58-2 76 82 64 166-12 80-56 130-92 140 20-56 10-130 0-196-6-50 2-108 28-110Z" fill="${body}"/>
      <path d="M140 90c10 40 10 90 0 140" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".3"/>
      <path d="M78 60c4-30 60-36 74-6-18 10-56 14-74 6Z" fill="${cap}"/><path d="M112 40c-4-20 6-34 24-38" stroke="${cap}" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${face(118, 150, 1.25, mood)}`
    ),
  guava: () =>
    svg(
      '0 0 220 240',
      `<path d="M110 40c-4-20 4-32 18-36" stroke="#6b3b1a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M118 34c30-26 80-20 96 6-30 16-66 14-96-6Z" fill="#2f8f4e"/>
      <path d="M110 40c70 0 104 60 98 118-6 54-50 80-98 80S16 212 12 158C6 100 40 40 110 40Z" fill="#9bd36a"/><path d="M60 80c20-20 50-26 70-20" stroke="#cdeca4" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M100 232l10-14 10 14" fill="#6cbf4a"/>${sparkle(190, 60, 1.2, C.cream)}`
    ),
  limeWheel: () => {
    let seg = '';
    for (let i = 0; i < 10; i++) {
      const a0 = ((i * 36 + 3.5) * Math.PI) / 180, a1 = (((i + 1) * 36 - 3.5) * Math.PI) / 180;
      const p = (r, a) => `${(150 + Math.cos(a) * r).toFixed(1)} ${(150 + Math.sin(a) * r).toFixed(1)}`;
      seg += `<path d="M${p(20, (a0 + a1) / 2)}L${p(112, a0)}A112 112 0 0 1 ${p(112, a1)}Z" fill="#a6e05a" stroke="#c9ef8a" stroke-width="4" stroke-linejoin="round"/>`;
    }
    return svg('0 0 300 300', `<circle cx="150" cy="150" r="148" fill="#3f8f2f"/><circle cx="150" cy="150" r="136" fill="#d9f5a6"/><circle cx="150" cy="150" r="124" fill="#eefad2"/>${seg}<circle cx="150" cy="150" r="16" fill="#eefad2"/>`);
  },
  limeWedge: () =>
    svg('0 0 240 140', `<path d="M8 10a112 112 0 0 0 224 0Z" fill="#3f8f2f"/><path d="M22 10a98 98 0 0 0 196 0Z" fill="#eefad2"/>${[0, 1, 2, 3].map((i) => { const a0 = ((i * 45 + 4) * Math.PI) / 180, a1 = (((i + 1) * 45 - 4) * Math.PI) / 180; const p = (r, a) => `${(120 + Math.cos(a) * r).toFixed(1)} ${(10 + Math.sin(a) * r).toFixed(1)}`; return `<path d="M${p(10, (a0 + a1) / 2)}L${p(88, a0)}A88 88 0 0 1 ${p(88, a1)}Z" fill="#a6e05a"/>`; }).join('')}`),
  mintLeaf: (withFace = true) =>
    svg(
      '0 0 240 320',
      `<path d="M120 300c4 10 6 16 4 20" stroke="#11603b" stroke-width="8" stroke-linecap="round"/>
      <path d="M120 10c96 50 110 200 0 290C10 210 24 60 120 10Z" fill="#2f9a55"/><path d="M120 24c0 90 0 180 0 270" stroke="#11603b" stroke-width="6" fill="none"/>
      <path d="M120 90l-48-30M120 90l48-30M120 150l-62-34M120 150l62-34M120 210l-56-30M120 210l56-30" stroke="#11603b" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
      ${withFace ? face(120, 162, 1.45, 'happy') : ''}`
    ),
  charm: () => {
    const ch = (y) => `<g transform="translate(60 ${y})"><path d="M-8 0c-6 30 0 60 10 78 8-22 12-52 4-78Z" fill="#2f8f4e"/><path d="M-10 0h18" stroke="#1d6b36" stroke-width="7" stroke-linecap="round"/></g>`;
    return svg('0 0 120 560', `<path d="M60 0v520" stroke="${INK}" stroke-width="3"/><circle cx="60" cy="74" r="38" fill="#dfee55"/><path d="M40 56c10-10 26-12 36-6" stroke="#f6fbb0" stroke-width="7" fill="none" stroke-linecap="round"/>${[130, 196, 262, 328, 394].map(ch).join('')}<circle cx="60" cy="502" r="36" fill="#dfee55"/><path d="M42 486c8-8 22-10 32-4" stroke="#f6fbb0" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  },
  bubbles: (stroke = INK) => svg('0 0 200 200', `<circle cx="60" cy="140" r="34" fill="none" stroke="${stroke}" stroke-width="4"/><circle cx="140" cy="70" r="22" fill="none" stroke="${stroke}" stroke-width="4"/><circle cx="150" cy="160" r="12" fill="none" stroke="${stroke}" stroke-width="4"/><circle cx="80" cy="50" r="8" fill="none" stroke="${stroke}" stroke-width="4"/>`),
  boltBig: (fill = C.saffron, stroke = INK) => svg('-4 -4 34 50', `<path d="${boltPath}" fill="${fill}" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>`),
  sparkles: (fill = C.cream) => svg('0 0 120 120', `${sparkle(40, 40, 3, fill)}${sparkle(92, 84, 1.8, fill)}${sparkle(90, 20, 1, fill)}`),
  drops: (fill = C.chilli) => svg('0 0 160 160', [[30, 40, 1], [90, 20, 0.7], [120, 90, 1.2], [50, 120, 0.8]].map(([x, y, s]) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-22C0-22-16 0-16 10a16 16 0 0 0 32 0C16 0 0-22 0-22Z" fill="${fill}"/>`).join('')),
  rocket: () =>
    svg(
      '0 0 300 520',
      `<g class="flame"><path d="M150 400c-40 30-40 90 0 120 40-30 40-90 0-120Z" fill="${C.mango}"/><path d="M150 420c-24 18-24 56 0 74 24-18 24-56 0-74Z" fill="${C.saffron}"/><path d="M150 440c-12 10-12 28 0 36 12-8 12-26 0-36Z" fill="${C.chilli}"/></g>
      <path d="M96 300l-50 60 10 60 60-60ZM204 300l50 60-10 60-60-60Z" fill="${C.chilli}"/>
      <path d="M150 20c80 60 90 220 56 380H94C60 240 70 80 150 20Z" fill="${C.navy}"/><path d="M150 20c30 24 50 60 60 100H90c10-40 30-76 60-100Z" fill="${C.chilli}"/>
      <circle cx="150" cy="200" r="44" fill="${C.cream}"/><circle cx="150" cy="200" r="32" fill="${C.lavender}"/><path d="M130 190c6-10 18-14 28-10" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M110 330h80" stroke="${C.cream}" stroke-width="8" stroke-linecap="round"/><path d="M150 400v-30" stroke="${C.navy}" stroke-width="40"/>
      ${bolt(150, 285, 1.2, C.mango, 0)}`
    ),
  cloud: (stroke = INK, fill = C.cream) => svg('0 0 260 120', `<path d="M40 110h180a34 34 0 0 0 0-68 50 50 0 0 0-94-14 38 38 0 0 0-62 30A26 26 0 0 0 40 110Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`),
  badge: () => {
    let p = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      p += `<circle cx="${130 + Math.cos(a) * 70}" cy="${130 + Math.sin(a) * 70}" r="56" fill="${C.sky}" stroke="${INK}" stroke-width="3"/>`;
    }
    return svg('0 0 260 260', `${p}<circle cx="130" cy="130" r="92" fill="${C.sky}"/>${p.replace(/stroke="[^"]+" stroke-width="3"/g, 'stroke="none"').replace(/r="56"/g, 'r="53.5"')}<path d="M70 70c10-10 22-16 34-18" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>`);
  },
};

/* ---------- benefit icons (stroke drawn) ---------- */
export const icons = {
  wave: () => svg('0 0 120 120', `<path class="draw" d="M8 44c28 0 22 46 52 46s24-46 52-46" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round"/>`),
  bean: () => svg('0 0 120 120', `<ellipse class="draw" cx="52" cy="66" rx="26" ry="38" transform="rotate(-24 52 66)" fill="none" stroke="currentColor" stroke-width="9"/><path class="draw" d="M40 36c18 18-6 38 22 58" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path class="draw" d="M84 40c4-22 18-30 30-30 0 20-12 32-30 30Z" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>`),
  drop: () => svg('0 0 120 120', `<path class="draw" d="M60 10S26 54 26 78a34 34 0 0 0 68 0C94 54 60 10 60 10Z" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/><path class="pop" d="M64 52 50 78h10l-4 18 16-28H62Z" fill="currentColor"/>`),
  cube: () => svg('0 0 120 120', `<path class="draw" d="M60 16 100 36v46L60 104 20 82V36Z M20 36l40 20 40-20 M60 56v48" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/><path class="pop" transform="translate(98 18) scale(1.1)" d="${sparklePath}" fill="currentColor"/>`),
  leaf: () => svg('0 0 120 120', `<path class="draw" d="M20 100C20 50 50 20 104 16c-2 54-30 86-84 84Z M20 100 70 50" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>`),
};

/* ---------- hero scenes: one per flavour, two halves ---------- */
const el = (style, s, a = '') => `<div class="h-el ${a}" style="${style}">${s}</div>`;

export function heroScene(fid) {
  switch (fid) {
    case 'mango':
      return {
        gauche:
          el('left:2vw;top:6vh;width:26vw', art.sun(), 'a-spin') +
          el('left:9vw;top:26vh;width:28vw', art.mango(), 'a-dance') +
          el('left:36vw;top:16vh;width:6vw', art.sparkles(C.cream), 'a-twinkle') +
          el('left:2vw;bottom:8vh;width:9vw', art.boltBig(C.saffron), 'a-wiggle'),
        droite:
          el('right:10vw;top:12vh;width:22vw', art.mangoCheek(), 'a-bob') +
          el('right:33vw;top:9vh;width:9vw', art.flower(C.guava), 'a-spin-r') +
          el('right:-2vw;bottom:-4vh;width:26vw', art.leaves(), 'a-sway') +
          el('right:30vw;bottom:14vh;width:7vw', art.boltBig(C.cream), 'a-wiggle') +
          el('right:4vw;top:52vh;width:6vw', art.sparkles(C.saffron), 'a-twinkle'),
      };
    case 'jamun':
      return {
        gauche:
          el('left:8vw;top:14vh;width:19vw', art.gola(), 'a-bob-tilt') +
          el('left:31vw;bottom:6vh;width:13vw', art.jamun(), 'a-dance') +
          el('left:30vw;top:12vh;width:6vw', art.sparkles(C.cream), 'a-twinkle') +
          el('left:2vw;bottom:10vh;width:8vw', art.bubbles(C.jamun), 'a-bob'),
        droite:
          el('right:9vw;top:8vh;width:18vw', art.moon(), 'a-swing') +
          el('right:20vw;top:54vh;width:14vw', art.planet(), 'a-bob') +
          el('right:3vw;bottom:2vh;width:17vw', art.jamun(), 'a-dance') +
          el('right:32vw;top:12vh;width:6vw', art.boltBig(C.mango), 'a-wiggle') +
          el('right:2vw;top:44vh;width:5vw', art.sparkles(C.cream), 'a-twinkle'),
      };
    case 'guava':
      return {
        gauche:
          el('left:5vw;bottom:-6vh;width:27vw', art.guavaHalf(), 'a-spin-slow') +
          el('left:28vw;top:8vh;width:13vw', art.chilli(C.chilli, '#2f8f4e', 'happy'), 'a-swing') +
          el('left:4vw;top:12vh;width:10vw', art.drops(C.chilli), 'a-bob') +
          el('left:36vw;bottom:24vh;width:6vw', art.sparkles(C.cream), 'a-twinkle'),
        droite:
          el('right:9vw;top:9vh;width:16vw', art.chilli(), 'a-bob-tilt') +
          el('right:23vw;bottom:8vh;width:13vw', art.guava(), 'a-bob') +
          el('right:2vw;bottom:6vh;width:12vw', art.flower(C.cream, C.chilli), 'a-spin-r') +
          el('right:34vw;top:18vh;width:7vw', art.boltBig(C.mango), 'a-wiggle'),
      };
    default:
      return {
        gauche:
          el('left:3vw;top:22vh;width:30vw', art.limeWheel(), 'a-spin-slow') +
          el('left:29vw;top:6vh;width:12vw', art.mintLeaf(false), 'a-sway') +
          el('left:33vw;bottom:8vh;width:9vw', art.bubbles(C.mint), 'a-bob') +
          el('left:2vw;top:6vh;width:6vw', art.sparkles(C.cream), 'a-twinkle'),
        droite:
          el('right:27vw;top:-3vh;width:7vw', art.charm(), 'a-pendulum') +
          el('right:5vw;bottom:3vh;width:17vw', art.mintLeaf(true), 'a-dance') +
          el('right:8vw;top:12vh;width:13vw', art.limeWedge(), 'a-wiggle') +
          el('right:22vw;bottom:14vh;width:7vw', art.boltBig(C.mango), 'a-wiggle') +
          el('right:2vw;top:46vh;width:5vw', art.sparkles(C.mint), 'a-twinkle'),
      };
  }
}

export const fruitArt = { mango: art.mangoCheek, jamun: art.gola, guava: art.guavaHalf, nimbu: art.limeWheel };
export function patternFor(fid) {
  return (fruitArt[fid] || (() => art.sun(C.cream)))();
}
