// Intro (rainbow letters + stars) and the page transition.
// The transition mirrors the reference's: seven circles burst open from fixed points with staggered
// starts until they cover the screen; to reveal, the same seven circles punch holes out of the colour.
import { revealLetters, popStars } from './ui.js';

const gsap = window.gsap;
const $ = (s) => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';

// positions (in a 2000×2000 frame anchored top-left, like the reference), start frames at 60 fps
const BURSTS = [[555, 1223, 0], [260, 371, 2], [1409, 904, 3], [647, 1671, 6], [1763, -169, 7], [1003, 695, 9], [1759, 1647, 15]];
const R0 = 475, RMAX = 475 * 1.564;

export function setupLenis() {
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  const lenis = matchMedia('(pointer: coarse)').matches ? null : new window.Lenis({ duration: 1.4, easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)) });
  if (lenis) {
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.__moonshot = { lenis };
  return lenis;
}

let svg, cover, holes, fillRect;
function stage() {
  if (svg) return;
  svg = $('#transition .bursts');
  svg.innerHTML = `<defs><mask id="burstHoles" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff"/><g class="holes"></g></mask></defs>
    <g class="cover"></g><rect class="fillRect" x="-2000" y="-2000" width="6000" height="6000" mask="url(#burstHoles)" style="display:none"/>`;
  cover = svg.querySelector('.cover');
  holes = svg.querySelector('.holes');
  fillRect = svg.querySelector('.fillRect');
  BURSTS.forEach(([x, y]) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 0);
    cover.appendChild(c);
    const h = c.cloneNode();
    h.setAttribute('fill', '#000');
    holes.appendChild(h);
  });
}
const setColor = (color) => svg.style.setProperty('--burst', color || 'var(--hero)');

// circles burst open and cover the screen
export function wipeCover(color) {
  stage();
  setColor(color);
  $('#transition').classList.add('devant');
  fillRect.style.display = 'none';
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    [...cover.children].forEach((c, i) => tl.fromTo(c, { attr: { r: 0 } }, { attr: { r: RMAX }, duration: 0.95, ease: 'power3.in' }, BURSTS[i][2] / 60));
  });
}
// a solid cover (used when arriving from another page that already covered the screen)
export function wipeFull(color) {
  stage();
  setColor(color);
  $('#transition').classList.add('devant');
  [...cover.children].forEach((c) => c.setAttribute('r', RMAX));
}
// holes burst open in the cover and reveal the page
export function wipeUncover() {
  stage();
  fillRect.style.display = '';
  [...cover.children].forEach((c) => c.setAttribute('r', 0));
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => { wipeClear(); resolve(); } });
    [...holes.children].forEach((c, i) => tl.fromTo(c, { attr: { r: 0 } }, { attr: { r: RMAX }, duration: 0.8, ease: 'power2.in' }, BURSTS[i][2] / 60));
  });
}
// the home page just drops the cover (its colour is the hero's own colour)
export function wipeClear() {
  stage();
  [...cover.children, ...holes.children].forEach((c) => c.setAttribute('r', 0));
  fillRect.style.display = 'none';
  $('#transition').classList.remove('devant');
}

// The intro plays on every load, except when we arrive through our own page transition.
export function playIntro(viaTransition = false) {
  const intro = $('#intro');
  if (viaTransition) {
    intro.classList.add('off');
    return { seen: true, done: Promise.resolve() };
  }
  revealLetters(intro.querySelector('.rainbowDebut'), { delay: 0.8 });
  popStars(intro.querySelector('.innerEtoiles'), { delay: 2 });
  gsap.to('.greenCoffee span', { autoAlpha: 1, y: 0, ease: 'elastic.out(0.8, 0.35)', duration: 1, stagger: 0.1, delay: 1.7 });
  return { seen: false, done: new Promise((r) => setTimeout(r, 3400)) };
}
