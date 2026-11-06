// Builds the data-driven parts of each page.
import { FLAVOURS, BENEFITS, PRODUCTS, LEARN, C, INR } from './data.js';
import { art, icons, heroScene, patternFor, sparklePath } from './art.js';
import { logoSVG } from './logo.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const starSVG = () => `<svg viewBox="-12 -12 24 24"><path d="${sparklePath}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>`;
const bulleSVG = () => `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;

export function splitLetters(root = document) {
  $$('.rainbow .mot, footer .titre .mot', root).forEach((mot) => {
    if (mot.dataset.split) return;
    mot.dataset.split = 1;
    mot.innerHTML = [...mot.textContent].map((ch) => `<span class="lettre c-cream">${ch}</span>`).join('');
  });
}

export function addStars(container, n, bulle = false) {
  if (!container) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'etoile a' + (bulle ? ' etoileBulle' : '');
    s.innerHTML = bulle ? bulleSVG() : starSVG();
    container.appendChild(s);
  }
}

const socials = () =>
  [
    ['Instagram', '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/>'],
    ['YouTube', '<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9.2v5.6l4.8-2.8Z" fill="currentColor"/>'],
    ['LinkedIn', '<path d="M5 9.5v9M5 5.6v.1M9.5 18.5v-9m0 4.2c0-2.6 1.5-4.4 3.8-4.4s3.2 1.6 3.2 4.2v5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'],
  ]
    .map(([n, p]) => `<a class="btn btnOmbre btnRond3 r" href="#${n.toLowerCase()}" aria-label="${n}"><span class="flex flexCe flexJCe"><svg viewBox="0 0 24 24" width="26">${p}</svg></span></a>`)
    .join('');

export function productCards(list) {
  return list
    .map((p, i) => {
      const f = p.flavour;
      return `<article class="productThumb" data-i="${i}">
      <a href="product.html?f=${p.id}" data-product="${p.id}">
        <span class="sousTitre">${p.name}</span>
        <div class="base" style="background:${f ? f.bg : C.pack}"><img data-shot="prod-${p.id}" alt="${p.name} can"></div>
        <div class="hover" style="background:${f ? f.accent : C.gold}"><div class="pat">${patternFor(f ? f.id : 'pack')}</div><img data-shot="prodh-${p.id}" alt=""></div>
        <span class="btn decouvrez">Discover this product</span>
        <span class="btnRondP" role="button" tabindex="0" data-add="${p.id}" aria-label="Add ${p.name} to cart"><svg viewBox="0 0 24 24" width="24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>
    </article>`;
    })
    .join('');
}

export function benefitCard(b, withIcon = true) {
  return `<div class="cercle a"><div class="etape h100 flex flexCe flexJCe etapeBenefice"><div class="data"><div class="haut">${b.title}</div><div class="bas r"><p class="petitTexte2">${b.text}</p>${withIcon ? icons[b.icon]() : ''}</div></div></div></div>`;
}

export function build() {
  $('.logoLink').innerHTML = logoSVG('logo');
  addStars($('#intro .innerEtoiles'), 9);
  addStars($('.c-HomeHero--part3 .parallaxEtoile'), 4);
  addStars($('.c-HomeHero--part3 .innerEtoiles'), 3);

  if ($('.lotties')) {
    $('.lotties').innerHTML = Array.from({ length: 8 }, (_, k) => {
      const f = FLAVOURS[k % 4];
      const s = heroScene(f.id);
      const g = k === 0 ? `<div class="introGauche">${s.gauche}</div>` : s.gauche;
      const d = k === 0 ? `<div class="introDroite">${s.droite}</div>` : s.droite;
      return `<div class="step step${k}${k === 0 ? ' current' : ''}" data-f="${f.id}"><div class="stepChild"><div class="gauche">${g}</div><div class="droite">${d}</div></div></div>`;
    }).join('');
    $('.innerBtn').innerHTML = FLAVOURS.map(
      (f, i) => `<a href="product.html?f=${f.id}" class="btn btnOmbre r${i === 0 ? ' current' : ''}" data-i="${i}"><span style="background-color:${f.accent}"><span class="premier">${f.name}</span><span class="a second">${f.name}</span></span></a>`
    ).join('');
    $('.mainCanvas .bulles').innerHTML = Array.from({ length: 14 }, (_, i) => `<circle cx="${30 + ((i * 47) % 140)}" cy="380" r="${3 + ((i * 7) % 9)}"/>`).join('');
    const spe = $('.cercleSpe');
    BENEFITS.forEach((b) => spe.insertAdjacentHTML('beforebegin', benefitCard(b)));
    $('.allBulles').innerHTML = Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 137) % 1400}" cy="${40 + ((i * 89) % 320)}" r="${4 + ((i * 13) % 26)}"/>`).join('');
  }

  // mega menu + mobile flavours
  $('.itemsBoutique').innerHTML = PRODUCTS.map(
    (p) => `<li><a href="product.html?f=${p.id}" class="bounce2"><div class="border r" style="background:${p.flavour ? p.flavour.bg : C.pack}"><img data-shot="menu-${p.id}" alt=""></div>${p.name}</a></li>`
  ).join('');
  const learnArt = { stores: [art.rocket(), FLAVOURS[3].bg], bean: [icons.bean().replace(/currentColor/g, '#a6ec74'), FLAVOURS[2].bg], faq: [art.moon(), FLAVOURS[0].bg], contact: [art.gola(), FLAVOURS[1].bg] };
  $('.itemsApprendre').innerHTML = LEARN.map((l) => {
    const [s, bg] = learnArt[l.art];
    return `<li><a href="#${l.id}" class="bounce2"><div class="border r" style="background:${bg}">${s}</div>${l.name}</a></li>`;
  }).join('');
  $('.saveurs').innerHTML = PRODUCTS.map((p) => `<li><a href="product.html?f=${p.id}"><img data-shot="menu-${p.id}" alt="" style="background:${p.flavour ? p.flavour.bg : C.pack}">${p.name}</a></li>`).join('');

  if ($('.track')) $('.track').innerHTML = productCards(PRODUCTS);

  if ($('.duo1')) {
    $('.duo1').innerHTML = `<div class="bg">${art.sun(C.gold)}</div><img class="shot" data-shot="duo1" alt="Mango and Guava cans"><span class="tag">Alphonso Mango × Guava &amp; Chilli</span>`;
    $('.duo2').innerHTML = `<div class="bg">${art.moon()}</div><img class="shot" data-shot="duo2" alt="Jamun can, opened"><span class="tag">Jamun after dark</span>`;
    const tiles = [[FLAVOURS[0].bg, art.sun(C.gold)], [FLAVOURS[3].bg, art.limeWheel()], [FLAVOURS[2].bg, art.guavaHalf()], [FLAVOURS[1].bg, art.planet()]];
    $$('.pushInsta').forEach((el, i) => {
      const [bg, a] = tiles[i];
      el.style.background = bg;
      el.innerHTML = `<div style="position:absolute;inset:-10%;opacity:.9">${a}</div><img data-shot="insta${i}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain">`;
    });
    $('.fleurArt').innerHTML = art.badge();
    $('.lottieFusee').innerHTML = art.rocket();
  }

  $('footer .socials').innerHTML = socials();
  $('.basMenuMob .socials').innerHTML = socials();
  $$('.nuage').forEach((n) => (n.innerHTML = art.cloud(C.moon, C.night)));
  splitLetters();
}
