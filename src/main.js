// Homepage boot: intro letters → colour wipe → can flies in → everything wakes up.
import { mountChrome } from './chrome.js';
import { build } from './build.js';
import { loadLabels } from './can.js';
import { Hero } from './hero.js';
import { initUI } from './ui.js';
import { Footer } from './game.js';
import { fillShots } from './shots.js';
import { setupLenis, playIntro, wipeCover, wipeFull, wipeClear } from './intro.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

mountChrome();
const lenis = setupLenis();
document.body.classList.add('is-loading');
build();
gsap.set('.header', { y: '-200%' });
gsap.set('.bandeau', { y: '-100%' });
gsap.set('.mainCanvas', { xPercent: -50, yPercent: 100 });

const fromTransition = sessionStorage.getItem('moonshot-wipe');
sessionStorage.removeItem('moonshot-wipe');
const intro = playIntro(!!fromTransition);
if (intro.seen) wipeFull(fromTransition || undefined);

await Promise.all([loadLabels(8), intro.done, document.fonts.ready]);

const hero = new Hero(lenis);
hero.setupScroll(); // pins first, so later triggers measure the pin-spacer
initUI({ hero, lenis });
new Footer();

// the cover is the hero's own colour, so it can simply be lifted (as the reference does on its home page)
if (!intro.seen) await wipeCover();
document.getElementById('intro').classList.add('off');
wipeClear();
document.body.classList.remove('is-loading', 'toHomePage');
ScrollTrigger.refresh();
hero.enter();
fillShots();
const target = location.hash && document.getElementById(location.hash.slice(1));
if (target) setTimeout(() => (lenis ? lenis.scrollTo(target, { duration: 2 }) : target.scrollIntoView({ behavior: 'smooth' })), 1800);
