// Footer mini-game (mirrors the reference's Footer class): jump the energy-killers, catch the cans.
import { C } from './data.js';
import { bolt, art, sparkle } from './art.js';
import { shot } from './shots.js';
import { rainbow } from './ui.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const INK = C.ink;

const chhotu = () => `<svg class="chhotu" viewBox="0 0 300 420" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  <g class="leg-l"><path d="M128 300 118 384" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M96 398c0-18 14-22 28-22s22 8 22 22Z" fill="${C.chilli}" stroke="${INK}" stroke-width="4"/></g>
  <g class="leg-r"><path d="M172 300l10 84" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M158 398c0-18 14-22 28-22s22 8 22 22Z" fill="${C.chilli}" stroke="${INK}" stroke-width="4"/></g>
  <g class="body">
    <g class="arm-l"><path d="M70 214 30 266" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="28" cy="270" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/></g>
    <g class="arm-r"><path d="M230 214l40 52" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="272" cy="270" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/></g>
    ${bolt(150, 52, 2.1, C.saffron, 12, INK)}
    <path d="M150 80c66 0 98 60 96 126-2 70-40 110-96 110S56 276 54 206c-2-66 30-126 96-126Z" fill="${C.lavender}" stroke="${INK}" stroke-width="5"/>
    <path d="M60 240c10 50 44 76 90 76s80-26 90-76c-30 20-150 20-180 0Z" fill="${C.navy}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M196 112c22 10 36 30 40 52" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>
    <g transform="translate(150 172)">
      <ellipse cx="-36" cy="22" rx="12" ry="7" fill="${C.guava}"/><ellipse cx="36" cy="22" rx="12" ry="7" fill="${C.guava}"/>
      <g class="mood-walk"><ellipse cx="-20" cy="-6" rx="11" ry="14" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="20" cy="-6" rx="11" ry="14" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="-16" cy="-6" r="5.5" fill="${INK}"/><circle cx="24" cy="-6" r="5.5" fill="${INK}"/><path d="M-14 22q14 14 28 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g class="mood-happy"><path d="M-30-4q10-14 20 0M10-4q10-14 20 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-22 14h44q-4 30-22 30t-22-30Z" fill="${INK}"/><path d="M-10 34q10-8 20 0q-10 8-20 0Z" fill="${C.chilli}"/></g>
      <g class="mood-sad"><path d="M-30-10l18 8M30-10l-18 8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="-18" cy="4" r="5" fill="${INK}"/><circle cx="18" cy="4" r="5" fill="${INK}"/><path d="M-14 34q14-14 28 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 6q4 10 0 14q-6-4 0-14Z" fill="${C.lavender}"/></g>
    </g>
  </g>
</svg>`;

const ob = (body) => `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" overflow="visible">${body}</svg>`;
const T = (x, y, s, w, t, fill = INK) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter Tight" font-weight="${w}" font-size="${s}" fill="${fill}">${t}</text>`;
const OBSTACLES = [
  ob(`<path d="M52 196 36 218M148 196l16 22" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="56" cy="62" r="26" fill="${C.chilli}" stroke="${INK}" stroke-width="5"/><circle cx="144" cy="62" r="26" fill="${C.chilli}" stroke="${INK}" stroke-width="5"/><circle cx="100" cy="128" r="80" fill="${C.chilli}" stroke="${INK}" stroke-width="5"/><circle cx="100" cy="128" r="62" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M100 128V86M100 128h30" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>${T(100, 178, 18, 400, '6:00')}`),
  ob(`${[[20, 150], [86, 150], [52, 92], [120, 92], [152, 150]].map(([x, y]) => `<rect x="${x}" y="${y}" width="60" height="60" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M${x + 14} ${y + 16}h8M${x + 34} ${y + 36}h8" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('')}${T(100, 72, 22, 500, 'SUGAR CRASH')}`),
  ob(`<rect x="30" y="40" width="140" height="176" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M30 92V54a14 14 0 0 1 14-14h112a14 14 0 0 1 14 14v38Z" fill="${C.chilli}" stroke="${INK}" stroke-width="5"/><path d="M64 26v28M136 26v28" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>${T(100, 80, 26, 500, 'MON', '#fff')}${T(100, 180, 72, 300, '9')}`),
  ob(`<rect x="52" y="20" width="96" height="196" rx="18" fill="${INK}"/><rect x="60" y="34" width="80" height="166" rx="10" fill="#fff"/><rect x="74" y="96" width="46" height="26" rx="4" fill="none" stroke="${INK}" stroke-width="4"/><rect x="120" y="103" width="5" height="12" fill="${INK}"/><rect x="78" y="100" width="4" height="18" fill="${C.chilli}"/>${T(100, 152, 22, 500, '1%', C.chilli)}`),
  ob(`<path d="M86 30h28l40 170H46Z" fill="${C.saffron}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M76 76h48l8 34H68ZM62 140h76l8 34H54Z" fill="#fff"/><rect x="24" y="196" width="152" height="20" rx="6" fill="${C.saffron}" stroke="${INK}" stroke-width="5"/>`),
  ob(`<path d="M20 150c0-40 30-60 80-60s80 20 80 60-30 66-80 66-80-26-80-66Z" fill="${C.lavender}" stroke="${INK}" stroke-width="5"/><path d="M60 132c10 6 24 8 40 8" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>${T(128, 70, 40, 500, 'z')}${T(150, 42, 30, 500, 'z')}${T(168, 20, 22, 500, 'z')}`),
  ob(`<path d="M40 30h92l28 28v158H40Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M132 30v28h28" fill="none" stroke="${INK}" stroke-width="5"/><path d="M60 80h70M60 104h80M60 128h56" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".3"/><g transform="rotate(-14 100 170)"><rect x="40" y="148" width="120" height="44" rx="6" fill="none" stroke="${C.chilli}" stroke-width="5"/>${T(100, 180, 24, 500, 'DEADLINE', C.chilli)}</g>`),
];

const landscape = () => {
  const s = `stroke="${C.moon}" stroke-width="1.6" fill="none" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"`;
  const palm = (x, h) => `<path d="M${x} 260c4-${h * 0.5} -6-${h * 0.8} 6-${h}" ${s}/><path d="M${x + 6} ${260 - h}c-30-6-46 6-56 20M${x + 6} ${260 - h}c30-8 48 2 58 18M${x + 6} ${260 - h}c-14-24-36-28-50-26M${x + 6} ${260 - h}c16-22 36-26 50-22M${x + 6} ${260 - h}c2-20 0-30-6-38" ${s}/>`;
  const bldg = (x, w, h) => `<path d="M${x} 260V${260 - h}h${w}V260" ${s}/>${Array.from({ length: Math.floor(h / 26) }, (_, r) => Array.from({ length: Math.floor(w / 22) }, (_, c) => `<rect x="${x + 8 + c * 22}" y="${260 - h + 12 + r * 26}" width="8" height="12" ${s}/>`).join('')).join('')}`;
  return `<svg viewBox="0 0 1600 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 230C120 200 220 150 360 170S600 230 760 200 1040 120 1200 150 1460 220 1600 230" ${s}/>
    ${bldg(180, 70, 150)}${bldg(260, 50, 100)}${palm(420, 150)}${palm(470, 110)}
    <path d="M640 260v-60h120v60M650 200c0-40 50-70 50-70s50 30 50 70M700 130v-30M690 108h20" ${s}/>
    ${palm(880, 170)}${bldg(1000, 90, 190)}${bldg(1100, 60, 120)}
    <path d="M1260 260V120M1260 120l-120 140M1260 120l-80 140M1260 120l-40 140M1260 120l40 140M1260 120l80 140M1260 120l120 140" ${s}/>
    ${palm(1480, 140)}
  </svg>`;
};

export class Footer {
  constructor() {
    this.jeu = $('.innerJeu');
    this.jeu.innerHTML = chhotu();
    // a night sky over the runner: crescent moon and scattered stars
    const stars = Array.from({ length: 40 }, (_, i) => {
      const x = (i * 293 + 37) % 1000, y = (i * 127 + 11) % 360;
      return i % 6 ? `<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.5}" fill="${C.moon}" opacity="${0.3 + (i % 4) * 0.17}"/>` : sparkle(x, y, 0.55, C.moon);
    }).join('');
    $('footer').insertAdjacentHTML('afterbegin', `<div class="nightSky a" aria-hidden="true"><svg class="nightStars" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice">${stars}</svg><div class="nightMoon">${art.moon()}</div></div>`);
    this.char = $('.chhotu', this.jeu);
    $('.innerPaysage').innerHTML = `<div class="strip">${landscape()}${landscape()}</div>`;
    this.strip = $('.innerPaysage .strip');
    const inner = $('.innerDenree');
    inner.innerHTML = OBSTACLES.map((o) => `<div class="item obstacle">${o}</div>`).join('') + `<div class="item canItem"><img alt="Moonshot can"></div>`;
    this.items = $$('.item', inner);
    this.canItem = $('.canItem', inner);
    this.denree = $('.denree');
    this.landX = 0;
    this.speed = 1;
    this.running = this.playing = this.jumping = this.visibleBtn = false;
    this.jumpY = 0;
    this.tick = this.tick.bind(this);
    this.clouds = $$('.nuage').map((n, i) => gsap.timeline({ repeat: -1, paused: true }).fromTo(n, { x: 0 }, { x: -innerWidth, xPercent: -100, duration: 9 - i, ease: 'none', delay: i * 3 }));

    ScrollTrigger.create({ trigger: 'footer', start: 'top bottom', onEnter: () => this.start(), onEnterBack: () => this.start(), onLeaveBack: () => this.stop() });
    ScrollTrigger.create({ trigger: '.startGame', start: 'bottom bottom', onEnter: () => (this.visibleBtn = true), onLeaveBack: () => (this.visibleBtn = false) });
    $('.startGame').addEventListener('click', () => this.startGame());
    $('.startGameMobile').addEventListener('click', () => { this.startGame(); this.jump(); });
    $('footer').addEventListener('touchstart', () => this.playing && this.jump(), { passive: true });
    addEventListener('keydown', (e) => {
      if (e.code !== 'Space' || e.target.closest('input,textarea,select')) return;
      if (this.visibleBtn && !this.playing) { e.preventDefault(); this.startGame(); return; }
      if (this.playing && this.visibleBtn) { e.preventDefault(); this.jump(); }
    });
  }
  start() {
    if (this.running) return;
    this.running = true;
    gsap.ticker.add(this.tick);
    this.clouds.forEach((t) => t.play());
    this.jeu.classList.remove('paused');
  }
  stop() {
    this.running = false;
    gsap.ticker.remove(this.tick);
    this.clouds.forEach((t) => t.pause());
    this.jeu.classList.add('paused');
    this.tl?.kill();
    this.playing = false;
    gsap.set('.denree, .startGame, .startGameMobile', { clearProps: 'all' });
  }
  tick(_, dt) {
    this.landX -= (dt / 1000) * 6 * this.speed;
    if (this.landX <= -50) this.landX += 50;
    this.strip.style.transform = `translateX(${this.landX}%)`;
    if (this.playing && !this.resolved) this.collide();
  }
  startGame() {
    gsap.to('.btnEspace', { y: 0.1 * innerHeight, duration: 0.8, autoAlpha: 0, ease: 'elastic.inOut(1.3,1)' });
    if (this.playing) return;
    this.playing = true;
    this.canItem.querySelector('img').src ||= shot('game-can');
    this.spawn(true);
  }
  spawn(first = false) {
    this.items.forEach((i) => i.classList.remove('on'));
    this.good = first || Math.random() >= 0.7;
    (this.good ? this.canItem : this.items[Math.floor(Math.random() * OBSTACLES.length)]).classList.add('on');
    gsap.set('.innerDenree', { clearProps: 'all' });
    this.resolved = false;
    this.tl = gsap.fromTo(this.denree, { x: 0 }, { x: -innerWidth, xPercent: -100, duration: innerWidth > innerHeight ? 3.5 : 3, delay: 0.5, ease: 'none', onComplete: () => this.playing && this.spawn() });
  }
  collide() {
    const a = this.char.getBoundingClientRect(), b = this.denree.getBoundingClientRect();
    const ac = a.left + a.width / 2, bc = b.left + b.width / 2;
    if (Math.abs(ac - bc) >= a.width * 0.32 + b.width * 0.3) { if (bc < ac - a.width) this.resolved = true; return; }
    if (this.jumpY > b.height * 0.55) return;
    this.resolved = true;
    this.good ? this.happy() : this.sad();
  }
  jump() {
    if (this.jumping) return;
    this.jumping = true;
    this.jeu.classList.add('jump');
    const h = this.denree.getBoundingClientRect().height * 1.25 || 160;
    const o = { y: 0 };
    gsap.timeline({ onComplete: () => { this.jumping = false; this.jeu.classList.remove('jump'); } })
      .to(o, { y: h, duration: 0.42, ease: 'power2.out', onUpdate: () => this.setY(o.y) })
      .to(o, { y: 0, duration: 0.42, ease: 'power2.in', onUpdate: () => this.setY(o.y) });
  }
  setY(y) { this.jumpY = y; this.char.style.transform = `translateY(${-y}px)`; }
  happy() {
    this.word('#boost');
    this.mood('happy', 1.5);
    gsap.to('.innerDenree', { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: 'elastic.in(3, 1)' });
    gsap.timeline().to(this, { speed: 6, duration: 0.2, ease: 'power1.in' }).to(this, { speed: 1, duration: 1, delay: 1, ease: 'power1.out' });
  }
  sad() {
    this.word('#ark');
    this.mood('sad', 2.8);
    gsap.to('.innerDenree', { y: '80%', duration: 0.5, rotation: -10, ease: 'elastic.in(1, 1)' });
    gsap.to('.innerDenree', { opacity: 0, duration: 0.05, delay: 0.45 });
    gsap.to('.nuage', { y: '100%', stagger: 0.08, ease: 'elastic.inOut(1,1)', duration: 1 });
    gsap.to('.nuage', { y: '0%', stagger: 0.08, ease: 'elastic.inOut(1,1)', duration: 1, delay: 2 });
  }
  mood(m, t) {
    this.jeu.classList.remove('happy', 'sad');
    this.jeu.classList.add(m);
    gsap.delayedCall(t, () => this.jeu.classList.remove(m));
  }
  word(sel) {
    $('footer .titre.on')?.classList.remove('on');
    const el = $(sel);
    el.classList.add('on');
    const letters = $$('.lettre', el);
    gsap.set(letters, { scale: 0.8, transformOrigin: 'center center' });
    gsap.set(letters, { stagger: { each: 0.07, onComplete() { const l = this.targets()[0]; rainbow(l); gsap.delayedCall(2, () => { l.classList.remove('c-ink'); l.classList.add('c-cream'); }); } } });
    gsap.to(letters, { scale: 1, stagger: 0.07, duration: 0.6, ease: 'elastic.out(2, 0.5)' });
  }
}
