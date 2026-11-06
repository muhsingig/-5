// Site-wide interactions (mirrors the reference's Global class + click router).
import { PRODUCTS, INR, C } from './data.js';
import { shot } from './shots.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- rainbow letters (each letter flicks through the palette, settles in ink) ---------- */
const CYCLE = ['c-saffron', 'c-gold', 'c-chilli', 'c-guava', 'c-lavender', 'c-lime', 'c-ink'];
export function rainbow(el, settle = 'c-ink') {
  const all = ['c-cream', ...CYCLE];
  CYCLE.forEach((c, i) =>
    setTimeout(() => {
      el.classList.remove(...all);
      el.classList.add(i === CYCLE.length - 1 ? settle : c);
    }, i * 70)
  );
}
export function revealLetters(root, { delay = 0, scrollTrigger, settle } = {}) {
  const letters = $$('.lettre', root);
  gsap.set(letters, { scale: 0.8, transformOrigin: 'center center' });
  gsap.set(letters, { delay, stagger: { each: 0.07, onComplete() { rainbow(this.targets()[0], settle); } }, scrollTrigger });
  gsap.to(letters, { delay, scale: 1, stagger: 0.07, duration: 0.6, ease: 'elastic.out(2, 0.5)', scrollTrigger });
}
export function popStars(container, { delay = 0.8, scrollTrigger } = {}) {
  let t = delay;
  $$('.etoile', container).forEach((s) => {
    const x = 0.8 * Math.random() * container.clientWidth + 0.1 * container.clientWidth;
    const y = 0.8 * Math.random() * container.clientHeight + 0.1 * container.clientHeight;
    gsap.set(s, { xPercent: -50, yPercent: -50 });
    gsap.fromTo(s, { rotate: 360 * Math.random() * (Math.random() > 0.5 ? 1 : -1), x, y: y + 200, scale: 0.5 }, { rotate: 0, y, duration: 1.5, scale: 1 - (4 * Math.random()) / 10, delay: t, opacity: 1, ease: 'elastic.out(0.8, 0.35)', scrollTrigger });
    t += 0.1;
  });
}

/* ---------- toast ---------- */
let toastT;
export function toast(msg) {
  const t = $('.toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2800);
}

/* ---------- cart ---------- */
const FREE_SHIP = 999;
const linePrice = (l) => {
  const p = PRODUCTS.find((x) => x.id === l.id);
  const base = l.pack === 24 ? p.price24 : p.price;
  return Math.round(base * (l.sub ? 0.85 : 1));
};
export const cart = {
  lines: JSON.parse(localStorage.getItem('moonshot-cart') || '[]'),
  save() { localStorage.setItem('moonshot-cart', JSON.stringify(this.lines)); render(); },
  add(id, qty = 1, pack = 12, sub = false) {
    const key = `${id}|${pack}|${sub ? 1 : 0}`;
    const l = this.lines.find((x) => x.key === key);
    l ? (l.qty += qty) : this.lines.push({ key, id, pack, sub, qty });
    this.save();
  },
  set(key, qty) {
    const l = this.lines.find((x) => x.key === key);
    if (!l) return;
    l.qty = qty;
    if (qty <= 0) this.lines = this.lines.filter((x) => x !== l);
    this.save();
  },
  count() { return this.lines.reduce((a, l) => a + l.qty, 0); },
  total() { return this.lines.reduce((a, l) => a + linePrice(l) * l.qty, 0); },
};
function render() {
  const n = cart.count();
  const p = $('.pastille');
  p.textContent = n;
  p.classList.toggle('off', !n);
  const total = cart.total();
  const left = Math.max(0, FREE_SHIP - total);
  $('.oCart__shipping').innerHTML = n ? `${left ? `${INR(left)} before free shipping` : 'Free shipping unlocked'}<div class="bar"><i style="width:${Math.min(100, (total / FREE_SHIP) * 100)}%"></i></div>` : '';
  $('.oCart__products').innerHTML = n
    ? cart.lines
        .map((l) => {
          const pr = PRODUCTS.find((x) => x.id === l.id);
          return `<li><div class="thumb" style="background:${pr.flavour ? pr.flavour.bg : C.pack}"><img src="${shot('cart-' + l.id)}" alt=""></div>
          <div><div>${pr.name}</div><div class="details" style="opacity:.6">${l.pack} cans${l.sub ? ' · monthly' : ''}</div><div class="qty"><button type="button" data-q="${l.key}" data-d="-1" aria-label="Fewer">−</button><span>${l.qty}</span><button type="button" data-q="${l.key}" data-d="1" aria-label="More">+</button></div></div>
          <div style="text-align:right">${INR(linePrice(l) * l.qty)}<button type="button" class="rm" data-rm="${l.key}">Remove</button></div></li>`;
        })
        .join('')
    : `<li class="oCart__empty"><p>Your cart is empty.</p><a href="${document.body.classList.contains('template-index') ? '#products' : 'index.html#products'}" class="btn btnOmbre r closeCartCredits"><span>See our products</span></a></li>`;
  $('.oCart__total--price').textContent = INR(total);
}

/* ---------- drawers ---------- */
function drawerTimeline(panel, inner) {
  return gsap
    .timeline({ paused: true })
    .fromTo('.overlayDrawer', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.8, ease: 'power4.inOut' }, 0)
    .fromTo(`${panel} .fondC`, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power4.inOut' }, 0)
    .fromTo(inner, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power4.inOut' }, '-=0.2');
}
let openCartFn = () => {};
export const openCart = () => openCartFn();

export function initUI({ hero, lenis }) {
  const body = document.body;
  render();

  /* bandeau */
  const band = $('.bandeau');
  if (!localStorage.getItem('moonshot-bandeau')) band.classList.remove('off');
  band.addEventListener('click', (e) => {
    if (e.target.closest('.closeBandeau')) {
      band.classList.add('off');
      localStorage.setItem('moonshot-bandeau', 'seen');
    } else location.href = body.classList.contains('template-index') ? '#products' : 'index.html#products';
  });

  /* mega menu */
  const tlMenu = gsap.timeline({ paused: true })
    .set('.sousMenu', { autoAlpha: 1 })
    .to('.fondM', { scaleY: 1, duration: 0.8, ease: 'power4.inOut' }, 0.05)
    .fromTo('.overlayMenu', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.8, ease: 'power4.inOut' }, 0.05);
  const listTl = (sel, withBtn) => {
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(`${sel} li`, { autoAlpha: 0, y: '-5%' }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.3, ease: 'power4.out' });
    if (withBtn) tl.to('.sousMenu .toAllProd', { opacity: 1, y: 0, duration: 0.3, ease: 'power4.out' }, '-=0.2');
    return tl;
  };
  const tlShop = listTl('.itemsBoutique', true), tlLearn = listTl('.itemsApprendre', false);
  $$('.toVolet').forEach((t) =>
    t.addEventListener('mouseenter', () => {
      const d = $('.items.on') ? 0.2 : 0.6;
      tlShop.delay(d).restart(true).pause();
      tlLearn.delay(d).restart(true).pause();
      $('.items.on')?.classList.remove('on');
      $('.' + t.dataset.menu).classList.add('on');
      const shop = t.dataset.menu === 'itemsBoutique';
      $('.overlayMenu').classList.toggle('jaune', shop);
      $('.overlayMenu').classList.toggle('bleu', !shop);
      (shop ? tlShop : tlLearn).timeScale(1).play();
      $('.toAllProd').classList.toggle('off', !shop);
      tlMenu.play();
      body.classList.add('panneauOn');
    })
  );
  $('.hoverSousmenu').addEventListener('mouseleave', () => {
    tlMenu.reverse();
    tlShop.timeScale(2).reverse();
    tlLearn.timeScale(2).reverse();
    body.classList.remove('panneauOn');
    $('.items.on')?.classList.remove('on');
  });

  /* cart + credits */
  const tlCart = drawerTimeline('.oCart', '.innerCart');
  tlCart.eventCallback('onReverseComplete', () => $('.oCart').classList.remove('on'));
  const tlCredits = drawerTimeline('.credits', '.innerCredits');
  tlCredits.eventCallback('onReverseComplete', () => $('.credits').classList.remove('on'));
  openCartFn = () => {
    $('.oCart').classList.add('on');
    $('.fondTransparent').classList.add('on');
    lenis?.stop();
    tlCart.timeScale(1).play();
  };
  const closeDrawers = () => {
    tlCart.timeScale(1.5).reverse();
    tlCredits.timeScale(1.5).reverse();
    $('.fondTransparent').classList.remove('on');
    lenis?.start();
  };

  /* mobile menu */
  const tlMob = gsap.timeline({ paused: true, onReverseComplete: () => { $('.overlayMenu').classList.remove('jaune'); $('.innerMenuMob').classList.remove('on'); } })
    .fromTo('.overlayMenu', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.8, ease: 'power4.inOut' }, 0)
    .to('.fondMenuMobile', { scaleY: 1, duration: 0.8, ease: 'power4.inOut' }, 0)
    .to('.contentMenuMob', { autoAlpha: 1, duration: 0.5, ease: 'power4.inOut' }, '-=0.2');
  const closeMob = () => { body.classList.remove('menuOuvert', 'panneauOn'); tlMob.timeScale(1.5).reverse(); };

  /* hero swipe + arrows */
  const part1 = $('.c-HomeHero--part1');
  if (part1 && hero) {
    let tx = 0;
    part1.addEventListener('touchstart', (e) => (tx = e.changedTouches[0].screenX), { passive: true });
    part1.addEventListener('touchend', (e) => { const d = e.changedTouches[0].screenX - tx; if (Math.abs(d) > 100) hero.go(d < 0 ? 1 : -1); });
  }

  /* global click router */
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.heroNext')) return hero?.go(1);
    if (t.closest('.heroPrev')) return hero?.go(-1);
    const add = t.closest('[data-add]');
    if (add) { e.preventDefault(); cart.add(add.dataset.add); return openCartFn(); }
    const q = t.closest('[data-q]');
    if (q) { const l = cart.lines.find((x) => x.key === q.dataset.q); return l && cart.set(q.dataset.q, l.qty + +q.dataset.d); }
    const rm = t.closest('[data-rm]');
    if (rm) return cart.set(rm.dataset.rm, 0);
    if (t.closest('.openCart')) { if (body.classList.contains('menuOuvert')) closeMob(); return openCartFn(); }
    if (t.closest('.toCredits')) { $('.credits').classList.add('on'); $('.fondTransparent').classList.add('on'); return tlCredits.timeScale(1).play(); }
    if (t.closest('.closeCartCredits')) { closeDrawers(); if (!t.closest('a')) return; }
    if (t.closest('.checkout')) return toast(cart.count() ? 'Concept store: checkout is not wired up yet' : 'Your cart is empty');
    if (t.closest('.openMenu')) {
      body.classList.toggle('menuOuvert');
      body.classList.toggle('panneauOn');
      if (body.classList.contains('menuOuvert')) { $('.innerMenuMob').classList.add('on'); $('.overlayMenu').classList.add('jaune'); tlMob.timeScale(1).play(); }
      else tlMob.timeScale(1.5).reverse();
      return;
    }
    if (t.closest('.toSaveurs')) { $('.saveurs').classList.toggle('on'); $('.barrePlus').classList.toggle('off'); return; }
    if (t.closest('.langToggle')) return toast('हिंदी version coming soon');

    const a = t.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (body.classList.contains('menuOuvert')) closeMob();
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = href.length > 1 && document.getElementById(href.slice(1));
      if (target) lenis ? lenis.scrollTo(target, { offset: -40, duration: 1.6 }) : target.scrollIntoView({ behavior: 'smooth' });
      else toast('That page is part of the concept, not built yet');
      return;
    }
    if (/^(product\.html|index\.html)/.test(href)) { e.preventDefault(); pageTransition(e.clientX, e.clientY, href); }
  });
  $('.fondTransparent').addEventListener('click', closeDrawers);
  addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawers());

  /* header logo hides going down, returns going up */
  let down = false, lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY, dir = y > lastY ? 1 : -1;
    lastY = y;
    if (dir === 1 && !down && y > 50) { down = true; gsap.to('.header .gauche', { y: -100, duration: 0.3, ease: 'power3.in' }); }
    if (dir === -1 && down) { down = false; gsap.to('.header .gauche', { y: 0, duration: 0.3, ease: 'power3.out' }); }
  }, { passive: true });

  /* logo turns ink over cream ("negativ") sections */
  const negs = $$('.negativ');
  let q = false;
  const checkNeg = () => { q = false; body.classList.toggle('logoNeg', negs.some((n) => { const r = n.getBoundingClientRect(); return r.top <= 60 && r.bottom >= 60; })); };
  ScrollTrigger.addEventListener('refresh', checkNeg);
  addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(checkNeg); } }, { passive: true });

  /* scroll reveals */
  $$('.rainbow:not(.rainbowDebut)').forEach((el) => el.querySelector('.lettre') && revealLetters(el, { scrollTrigger: { trigger: el, start: el.classList.contains('rainbowSpe') ? 'bottom 200%' : 'top 70%' } }));
  $$('.innerEtoiles:not(.etoilesDebut)').forEach((c) => popStars(c, { scrollTrigger: { trigger: c, start: 'top 80%' } }));
  if (innerWidth > 767) $$('.parallaxEtoile').forEach((p) => gsap.fromTo(p, { y: -80 }, { y: 80, ease: 'none', scrollTrigger: { trigger: p.parentNode, start: 'top bottom+=80', end: 'bottom top-=80', scrub: true } }));
  $$('.parallax').forEach((p) => gsap.to(p, { y: 0, ease: 'none', scrollTrigger: { trigger: p.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.arrondi').forEach((a) => gsap.to(a, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: a, start: 'top bottom', end: 'top top', scrub: true } }));
  if ($('.innerInsta'))
    [['.pushInsta0', { y: '-80%', x: '30%', rotation: 0 }], ['.pushInsta1', { y: '0%', x: '-10%', rotation: -10 }], ['.pushInsta2', { y: '-80%', x: '-60%', rotation: -10 }], ['.pushInsta3', { y: '-100%', x: '10%', rotation: 5 }]].forEach(([s, v]) =>
      gsap.to(s, { ...v, ease: 'none', scrollTrigger: { trigger: '.innerInsta', start: 'top bottom', end: 'bottom top', scrub: true } })
    );
  if ($('.lottieFusee')) gsap.fromTo('.lottieFusee', { y: '40%', x: '-30%' }, { y: '-60%', x: '20%', ease: 'none', scrollTrigger: { trigger: '.c-newsletterSubscribe', start: 'top bottom', end: 'bottom top', scrub: true } });
  if ($('.path1')) gsap.fromTo('.path1', { x: '6%' }, { x: '-6%', ease: 'none', scrollTrigger: { trigger: '.c-newsletterSubscribe', start: 'top bottom', end: 'bottom top', scrub: true } });

  if ($('.track')) { initSlider(); initThumbMasks(); }
}

/* ---------- looping product slider (3 per view, 2 on phones) ---------- */
function initSlider() {
  const track = $('.track');
  const originals = $$('.productThumb', track);
  const N = originals.length;
  originals.forEach((o) => track.append(o.cloneNode(true)));
  originals.forEach((o) => track.prepend(o.cloneNode(true)));
  const svgNS = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(svgNS, 'svg');
  defs.setAttribute('width', 0);
  defs.setAttribute('height', 0);
  defs.style.position = 'absolute';
  track.parentNode.appendChild(defs);
  $$('.productThumb', track).forEach((card, k) => {
    const cp = document.createElementNS(svgNS, 'clipPath');
    cp.setAttribute('id', 'maskc' + k);
    cp.setAttribute('clipPathUnits', 'objectBoundingBox');
    cp.innerHTML = '<circle r="0"/><circle r="0"/><circle r="0"/>';
    defs.appendChild(cp);
    $('.hover', card).style.clipPath = `url(#maskc${k})`;
    card.dataset.k = k;
  });
  let index = N;
  const per = () => (innerWidth <= 767 ? 2 : 3);
  const place = (animate) => {
    const w = track.parentNode.clientWidth / per();
    gsap.to(track, { x: -index * w, duration: animate ? 0.9 : 0, ease: 'power3.inOut', overwrite: true, onComplete: wrap });
  };
  const wrap = () => {
    if (index >= 2 * N) { index -= N; place(false); }
    if (index < N) { index += N; place(false); }
  };
  place(false);
  $$('.toNextSlide').forEach((b) => b.addEventListener('click', () => { index++; place(true); }));
  $$('.toPrevSlide').forEach((b) => b.addEventListener('click', () => { index--; place(true); }));
  addEventListener('resize', () => place(false));
  ScrollTrigger.addEventListener('refresh', () => place(false));
  let sx = null;
  track.addEventListener('pointerdown', (e) => (sx = e.clientX));
  addEventListener('pointerup', (e) => {
    if (sx == null) return;
    const d = e.clientX - sx;
    sx = null;
    if (Math.abs(d) > 60) { index += d < 0 ? 1 : -1; place(true); }
  });
}

/* ---------- product hover: three circles grow from one of eight preset layouts ---------- */
export const POS = [[[80, 50], [60, 80], [40, 20]], [[30, 80], [80, 65], [50, 30]], [[50, 40], [80, 60], [30, 80]], [[30, 20], [65, 80], [80, 40]], [[60, 30], [40, 20], [50, 75]], [[25, 50], [70, 70], [40, 20]], [[50, 20], [60, 65], [20, 80]], [[30, 70], [45, 25], [80, 45]]];
function initThumbMasks() {
  $$('.productThumb').forEach((card) => {
    const circles = $$('circle', document.getElementById('maskc' + card.dataset.k));
    const p = POS[Math.floor(Math.random() * POS.length)];
    circles.forEach((c, i) => { c.setAttribute('cx', p[i][0] / 100); c.setAttribute('cy', p[i][1] / 100); });
    const tl = gsap.timeline({ paused: true }).to(circles, { attr: { r: 0.95 }, stagger: 0.07, duration: 1, ease: 'power3.inOut' });
    const a = $('a', card);
    a.addEventListener('mouseenter', () => tl.play());
    a.addEventListener('mouseleave', () => tl.reverse());
  });
}

/* ---------- page transition: circle grows from the click point ---------- */
export function pageTransition(x, y, href) {
  const c = $('#firstCercle');
  const pid = new URL(href, location.href).searchParams.get('f');
  const p = PRODUCTS.find((pp) => pp.id === pid);
  const color = p?.flavour ? p.flavour.bg : C.night;
  c.style.background = color;
  $('#transition').classList.add('devant');
  gsap.set(c, { x, y, xPercent: -50, yPercent: -50, scale: 0 });
  c.classList.add('on');
  gsap.to(c, { scale: 1, duration: 1.4, ease: 'power3.inOut' });
  gsap.delayedCall(0.2, () => import('./intro.js').then((m) => m.wipeCover(color).then(() => { sessionStorage.setItem('moonshot-wipe', color); location.href = href; })));
}
