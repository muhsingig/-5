// Product page (mirrors the reference's Product class).
import * as THREE from 'three';
import { mountChrome } from './chrome.js';
import { build, addStars, benefitCard, productCards } from './build.js';
import { loadLabels, createCan, environmentFor } from './can.js';
import { PRODUCTS, PACK_COPY, FLAVOURS, BENEFITS, INGREDIENTS, NUTRITION, INR, C } from './data.js';
import { art, icons, patternFor } from './art.js';
import { initUI, cart, openCart, toast, POS, $, $$ } from './ui.js';
import { Footer } from './game.js';
import { fillShots, shot } from './shots.js';
import { setupLenis, playIntro, wipeCover, wipeUncover, wipeFull } from './intro.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const mod = (n, m) => ((n % m) + m) % m;

const id = new URLSearchParams(location.search).get('f') || 'mango';
const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
const f = product.flavour;
document.body.dataset.flavour = f ? f.id : 'pack';
document.title = `Moonshot | ${product.name}`;

mountChrome();
const lenis = setupLenis();
build();

// intro on a first visit, otherwise the wipe left behind by the previous page covers until we are ready
const fromTransition = sessionStorage.getItem('moonshot-wipe');
sessionStorage.removeItem('moonshot-wipe');
const intro = playIntro(!!fromTransition);
if (intro.seen) wipeFull(fromTransition || C.night);

/* ---------- copy ---------- */
$('.pName').textContent = product.name;
$('.pNotes').textContent = f ? f.notes : PACK_COPY.notes;
$('.pLong').textContent = `${f ? f.tagline : PACK_COPY.tagline} A sparkling energy drink powered by green coffee and green tea, with real fruit, electrolytes and only 5 g of sugar a can. 80 mg of plant caffeine gives you a slow climb and a soft landing, so the deadline gets done and the 4 a.m. crash never shows up. Good cold, better shared, best after midnight.`;
$('.carac').innerHTML = BENEFITS.map((b) => `<li class="flex flexCl flexCe">${icons[b.icon]()}<span class="h6">${b.title}</span></li>`).join('');
const ingIcons = ['bean', 'drop', 'leaf', 'cube', 'drop', 'leaf', 'wave'];
$('.carac2').innerHTML = INGREDIENTS.map((t, i) => `<li class="flex flexSb flexCe"><span>${t}</span><span class="rondCarac flex flexCe flexJCe">${icons[ingIcons[i]]()}</span></li>`).join('');
$('.nutri').innerHTML = `<li class="flex med"><span class="g">Content</span><span class="d">Daily value</span></li>` + NUTRITION.map(([k, v, d]) => `<li class="flex"><span class="g"><v>${k}</v><v>${v}</v></span><span class="d">${d}</span></li>`).join('');
$('.innerCanvasP img').dataset.shot = f ? `back-${f.id}` : 'prodh-pack';
$('.innerCanvasP img').alt = f ? 'Back of the can with ingredients and nutrition' : 'All four cans';
$('.bulleSvg').innerHTML = Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 173) % 1600}" cy="${60 + ((i * 97) % 520)}" r="${4 + ((i * 13) % 22)}"/>`).join('');
addStars($('.queDuBon .parallaxEtoile'), 4, true);
addStars($('.queDuBon .innerEtoiles'), 3, true);
$('.innerCercleCP').innerHTML = Array.from({ length: 12 }, (_, i) => benefitCard(BENEFITS[i % 4])).join('');
$('.track').innerHTML = productCards(PRODUCTS);

/* ---------- price + purchase options ---------- */
const state = { pack: 12, qty: 1, sub: false };
const price = () => {
  const base = state.pack === 24 ? product.price24 : product.price;
  return state.sub ? Math.round(base * 0.85) : base;
};
const renderPrice = () => ($('.pPrice').textContent = INR(price()));
renderPrice();
$('#Product').addEventListener('change', (e) => { state.pack = +e.target.value; renderPrice(); showImg(e.target.value === '24' ? imgs.length - 1 : imgs.length - 2); });
$('.i_moins').addEventListener('click', () => { state.qty = Math.max(1, state.qty - 1); $('#Quantity').value = state.qty; });
$('.i_plus').addEventListener('click', () => { state.qty++; $('#Quantity').value = state.qty; });
const check = (el) => { el.parentNode.querySelector('[checked]')?.removeAttribute('checked'); el.setAttribute('checked', ''); };
$('.toAbonnement').addEventListener('click', (e) => { check(e.currentTarget); $('.ligneAbonnement').classList.add('on'); state.sub = true; renderPrice(); });
$('.toRegular').addEventListener('click', (e) => { check(e.currentTarget); $('.ligneAbonnement').classList.remove('on'); state.sub = false; renderPrice(); });
$$('.typeAbonnement').forEach((r) => r.addEventListener('click', () => check(r)));
$$('.radio').forEach((r) => r.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), r.click())));
$('#AddToCartForm').addEventListener('submit', () => {
  cart.add(product.id, state.qty, state.pack, state.sub);
  openCart();
});

/* ---------- photo slider with the three-circle mask ---------- */
await loadLabels(8);
const svgImg = (markup) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup.replace('<svg ', '<svg width="800" height="800" ')); });
const loadImg = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
async function compose(shotName, bg, artMarkup, { scale = 0.86, artScale = 1.25, rot = -10 } = {}) {
  const cv = document.createElement('canvas');
  cv.width = 710;
  cv.height = 840;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 710, 840);
  if (artMarkup) {
    const a = await svgImg(artMarkup);
    if (a) { ctx.save(); ctx.translate(355, 420); ctx.rotate((rot * Math.PI) / 180); const w = 710 * artScale; ctx.drawImage(a, -w / 2, -w / 2, w, w); ctx.restore(); }
  }
  const im = await loadImg(shot(shotName));
  const h = 840 * scale, w = (im.width / im.height) * h;
  ctx.drawImage(im, (710 - w) / 2, (840 - h) / 2 + 20, w, h);
  return cv.toDataURL('image/jpeg', 0.9);
}
const fid = f ? f.id : null;
const slides = f
  ? [
      ['prod-' + fid, f.bg, null, { scale: 0.88 }],
      ['prodh-' + fid, f.accent, patternFor(fid), {}],
      ['back-' + fid, C.panel, null, { scale: 0.88 }],
      ['top-' + fid, f.bg, art.sun(f.accent), { scale: 1, artScale: 1.4 }],
      ['lie-' + fid, C.night, art.moon(), { scale: 0.95, artScale: 0.9, rot: 0 }],
      ['duoof-' + fid, f.bg, art.leaves(), { scale: 0.95, artScale: 1.1, rot: 0 }],
      ['prod-pack', C.pack, null, { scale: 0.82 }],
      ['prodh-pack', f.bg, art.sun(C.gold), { scale: 0.86 }],
    ]
  : [
      ['prod-pack', C.pack, null, { scale: 0.82 }],
      ['prodh-pack', C.mango, art.sun(C.gold), { scale: 0.86 }],
      ...FLAVOURS.map((x) => ['prod-' + x.id, x.bg, patternFor(x.id), { artScale: 1.1 }]),
    ];
const imgs = [];
for (const [s, bg, a, o] of slides) {
  const img = new Image();
  img.alt = product.name;
  img.src = await compose(s, bg, a, o);
  $('.lesImgs').appendChild(img);
  imgs.push(img);
}
imgs[0].classList.add('current');
gsap.to('.heroProduct .gauche', { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
let current = 0, z = 2, busy = false;
const maskCircles = $$('#svgMask circle');
function showImg(i) {
  if (busy) return;
  busy = true;
  current = mod(i, imgs.length);
  $('.lesImgs img.current')?.classList.remove('current');
  const img = imgs[current];
  img.classList.add('current');
  img.style.zIndex = z++;
  const p = POS[Math.floor(Math.random() * POS.length)];
  maskCircles.forEach((c, k) => { c.setAttribute('cx', p[k][0] / 100); c.setAttribute('cy', p[k][1] / 100); c.setAttribute('r', 0); });
  gsap.to('.lesImgs', { scale: 1, ease: 'power2.inOut', duration: 0.3 });
  gsap.to('.lesImgs', { scale: 1.02, ease: 'elastic.out(3, 0.75)', duration: 1, delay: 0.3 });
  gsap.to(maskCircles, { attr: { r: 0.95 }, stagger: 0.07, duration: 1, ease: 'power3.inOut', onComplete: () => { busy = false; imgs.forEach((x) => x !== img && x.classList.remove('current')); } });
}
// first image shows without the mask
maskCircles.forEach((c) => c.setAttribute('r', 1.5));
$('.produitNext').addEventListener('click', () => showImg(current + 1));
$('.produitPrev').addEventListener('click', () => showImg(current - 1));

/* ---------- 3D can at the foot of the card wheel ---------- */
const size = innerWidth >= 650 ? gsap.utils.clamp(300, 700, 0.3 * innerWidth) : 300;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(size, size);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('.sectionCercleProd .mainCanvas').appendChild(renderer.domElement);
gsap.set('.sectionCercleProd .mainCanvas', { xPercent: -50 });
const scene = new THREE.Scene();
scene.environment = environmentFor(renderer);
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(5, 6, 9);
scene.add(key, new THREE.AmbientLight(0xffffff, 0.3));
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 4.5, 10);
camera.lookAt(0, 1.2, 0);
const group = new THREE.Group(), groupMouse = new THREE.Group(), groupRot = new THREE.Group();
const can = createCan(f ? f.id : 'mango');
groupRot.add(can.group);
groupMouse.add(groupRot);
group.add(groupMouse);
group.position.y = -1.4;
scene.add(group);
can.setOpen(1);
const qt = (o, p) => gsap.quickTo(o, p, { duration: 0.6, ease: 'power3' });
const xTo = qt(groupMouse.position, 'x'), yTo = qt(groupMouse.position, 'y'), rYTo = qt(groupMouse.rotation, 'y'), rXTo = qt(groupMouse.rotation, 'x'), rZTo = qt(groupMouse.rotation, 'z');
const onMouse = (e) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; xTo(nx * 0.6); yTo(-ny * 0.6); rYTo(nx / 2); rXTo((ny * Math.PI) / 12); rZTo(nx / 10); };
const animate = (t, dt) => { groupRot.rotation.y += dt / 4000; renderer.render(scene, camera); };
renderer.render(scene, camera);
ScrollTrigger.create({
  trigger: '.sectionCercleProd',
  start: 'top bottom',
  end: 'bottom top',
  onToggle: (s) => {
    if (s.isActive) { gsap.ticker.add(animate); addEventListener('mousemove', onMouse); }
    else { gsap.ticker.remove(animate); removeEventListener('mousemove', onMouse); }
  },
});
let carte = 0, cBusy = false;
function updateCarte(dir) {
  if (cBusy) return;
  cBusy = true;
  carte += dir;
  gsap.timeline().to('.innerCercleCP', { rotation: -30 * carte + 15 * dir, ease: 'power2.in', duration: 0.3 }).to('.innerCercleCP', { rotation: -30 * carte, ease: 'elastic.out(0.34, 0.26)', duration: 0.9 });
  gsap.fromTo('.sectionCercleProd .mainCanvas', { x: 0 }, { x: 0.03 * -dir * innerWidth, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.inOut' });
  gsap.timeline().to(can.group.rotation, { y: '+=' + (dir * Math.PI) / 6, ease: 'power2.in', duration: 0.3 }).to(can.group.rotation, { y: '+=' + (dir * Math.PI) / 2, ease: 'elastic.out(0.34, 0.26)', duration: 1.3 });
  gsap.delayedCall(1, () => (cBusy = false));
}
$('.toNextCarte').addEventListener('click', () => updateCarte(1));
$('.toPrevCarte').addEventListener('click', () => updateCarte(-1));
let tx = 0;
$('.sectionCercleProd').addEventListener('touchstart', (e) => (tx = e.changedTouches[0].screenX), { passive: true });
$('.sectionCercleProd').addEventListener('touchend', (e) => { const d = e.changedTouches[0].screenX - tx; if (Math.abs(d) > 100) updateCarte(d < 0 ? 1 : -1); });

/* ---------- shared UI, motion, reveal ---------- */
initUI({ hero: null, lenis });
new Footer();
gsap.to('.outer', { rotate: -360, ease: 'none', scrollTrigger: { trigger: '.heroProduct', start: 'top top', end: 'bottom top', scrub: 1 } });
ScrollTrigger.refresh();
fillShots();

if (intro.seen) {
  await wipeUncover();
} else {
  await intro.done;
  await wipeCover(f ? f.bg : C.pack);
  $('#intro').classList.add('off');
  await wipeUncover();
}
lenis?.start();
