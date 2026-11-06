// Shared page chrome for every page (mirrors the reference's layout file).
const arrowL = `<svg viewBox="0 0 24 24" width="22" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const arrowR = `<svg viewBox="0 0 24 24" width="22" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const chevron = `<svg class="fleche" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
const close = (c = '#fff') => `<svg viewBox="0 0 24 24" width="20" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" stroke="${c}" stroke-width="1.8"/></svg>`;
export const ARROWS = { arrowL, arrowR };

export function mountChrome() {
  const home = document.body.classList.contains('template-index');
  const h = (hash) => (home ? hash : 'index.html' + hash);

  document.getElementById('chrome-top').outerHTML = `
  <div id="transition" class="f">
    <div id="firstCercle"></div>
    <svg class="bursts" viewBox="0 0 2000 2000" preserveAspectRatio="xMinYMin slice" aria-hidden="true"></svg>
  </div>
  <section id="intro" class="h100 f flex flexCe">
    <div class="innerTitre innerEtoiles etoilesDebut r wrap">
      <p class="titre rainbow rainbowDebut" aria-label="Charged by nature"><span class="mot">CHARGED</span><br><span class="mot">BY</span><br><span class="mot">NATURE</span></p>
      <div class="a flex flexSb sousTitre greenCoffee"><span>Green</span><span>Coffee</span></div>
    </div>
  </section>
  <div class="innerHeader f">
    <button class="bandeau off r" type="button">Free shipping across India on orders above ₹999 <u>Shop now</u>
      <svg class="closeBandeau a" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2 2 14" stroke="currentColor" stroke-width="1.6"/></svg></button>
    <div class="overlay overlayMenu f"></div>
    <header class="header flex flexSb flexCe">
      <a href="index.html" class="gauche flex logoLink" aria-label="Moonshot home"></a>
      <nav class="droite flex" aria-label="Main">
        <div class="hoverSousmenu flex">
          <a href="${h('#products')}" class="toVolet btn btn50h offMob bounce" data-menu="itemsBoutique"><span class="elBounce flex flexCe"><span>Shop</span>${chevron}</span></a>
          <button class="toVolet btn btn50h offMob bounce" data-menu="itemsApprendre" type="button"><span class="elBounce flex flexCe"><span>Learn</span>${chevron}</span></button>
          <div class="sousMenu a">
            <div class="fondM a"></div>
            <ul class="flex items itemsBoutique"></ul>
            <ul class="flex items itemsApprendre"></ul>
            <div class="innerBtnMenu flex flexJCe"><a href="${h('#products')}" class="btn btnOmbre r toAllProd"><span>All our products</span></a></div>
          </div>
        </div>
        <a class="btn btn50h offMob r bounce" href="${h('#subscribe')}"><span class="elBounce flex flexCe flexJCe">Subscription</span></a>
        <button class="btn btnRond4 flex flexCe flexJCe offMob bounce langToggle" type="button" title="हिंदी (coming soon)"><span class="elBounce flex flexCe flexJCe">हि</span></button>
        <a href="#account" class="btn btnRond4 bounce" aria-label="Account"><span class="elBounce flex flexCe flexJCe"><svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.6 19.2c1.4-2.7 3.7-4 6.4-4s5 1.3 6.4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></a>
        <button class="btn openCart btnRond4 r bounce" type="button" aria-label="Cart"><span class="elBounce flex flexCe flexJCe"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M2 3h3l2.6 11.4a1.6 1.6 0 0 0 1.6 1.2h8.6a1.6 1.6 0 0 0 1.5-1.1L21 7.5H6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor"/></svg></span><span class="pastille a flex flexCe flexJCe off">0</span></button>
        <button class="btn btnRond4 openMenu r" type="button" aria-label="Menu"><span class="innerIcon innerIcon1 flex flexCe flexJCe"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 8h18M3 16h18" stroke="currentColor" stroke-width="1.6"/></svg></span><span class="innerIcon innerIcon2 flex flexCe flexJCe">${close()}</span></button>
      </nav>
    </header>
    <section class="innerMenuMob f">
      <div class="menuMobile r">
        <div class="fondMenuMobile a"></div>
        <div class="contentMenuMob">
          <ul>
            <li><a href="${h('#products')}">Shop</a></li>
            <li><button class="flex flexSb flexCe toSaveurs" type="button"><span>Flavours</span><svg viewBox="0 0 20 20" width="20"><path d="M2 10h16" stroke="currentColor" stroke-width="1.6"/><path class="barrePlus" d="M10 2v16" stroke="currentColor" stroke-width="1.6"/></svg></button><ul class="saveurs flexSb"></ul></li>
            <li><a href="${h('#subscribe')}">Subscription</a></li>
            <li><a href="#stores">Where to buy</a></li>
            <li><a href="#green-coffee">Green coffee</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div class="flex basMenuMob"><button class="petitLien langToggle" type="button">हिंदी</button><div class="flex socials"></div></div>
        </div>
      </div>
    </section>
  </div>`;

  document.getElementById('chrome-bottom').outerHTML = `
  <footer class="c-Footer negativ">
    <div class="flex socials a"></div>
    <p class="titre" aria-hidden="true" id="boost"><span class="mot">ZAP!</span></p>
    <p class="titre" aria-hidden="true" id="ark"><span class="mot">OOF...</span></p>
    <button class="btn btnOmbre btnEspace a startGame btnEspaceDesktop" type="button"><span>Press Space to jump</span></button>
    <button class="btn btnOmbre btnEspace a startGameMobile btnEspaceMobile" type="button"><span>Tap to jump</span></button>
    <div class="flex flexSb details wrap">
      <p class="basGauche">2026 © Moonshot Beverages</p>
      <div class="basDroite flex"><ul class="flex liste"><li><a href="#terms">Terms of use</a></li><li><a href="#refunds">Refund policy</a></li></ul><button class="toCredits" type="button">Credits</button></div>
    </div>
    <div class="a nuage nuage1"></div>
    <div class="a nuage nuage2"></div>
    <div class="innerPaysage"></div>
    <div class="innerJeu"></div>
    <div class="denree"><div class="innerDenree"></div></div>
  </footer>
  <div class="overlay overlayDrawer f rose"></div>
  <button class="fondTransparent f closeCartCredits" type="button" aria-label="Close"></button>
  <aside class="oCart r" aria-label="Cart">
    <div class="fondC a"></div>
    <div class="innerCart">
      <div class="oCart__head flex flexSb flexCe"><h2 class="h5">Cart</h2><button class="closeCartCredits btnRond4 bounce" type="button" aria-label="Close cart"><span class="elBounce elBounceNoir flex flexCe flexJCe">${close("currentColor")}</span></button></div>
      <div class="oCart__shipping details"></div>
      <ul class="oCart__products"></ul>
      <div class="oCart__total flex flexSb"><p>Subtotal</p><div class="oCart__total--price">₹0</div></div>
      <p class="details">Taxes and shipping calculated at checkout</p>
      <button type="button" class="btn btnOmbre btnOmbre60 r checkout"><span>Payment</span></button>
    </div>
  </aside>
  <aside class="credits f" aria-label="Credits">
    <div class="fondC a"></div>
    <div class="innerCredits">
      <div class="oCart__head flex flexSb flexCe"><h2 class="h5">Credits</h2><button class="closeCartCredits btnRond4 bounce" type="button" aria-label="Close credits"><span class="elBounce elBounceNoir flex flexCe flexJCe">${close("currentColor")}</span></button></div>
      <h3 class="h5 marges">Brand</h3><p class="details">Moonshot is a hypothetical brand.<br>Concept, naming and identity by OneStop.</p>
      <h3 class="h5 marges">Website</h3><p class="details">Design and front-end: OneStop.<br>Layout, motion and interactions modelled closely on the MANA yerba maté website, as a study.</p>
      <h3 class="h5 marges">Illustrations and 3D</h3><p class="details">Hand-built SVG illustrations.<br>Procedural three.js can with painted labels.</p>
    </div>
  </aside>
  <div class="toast f" role="status" aria-live="polite"></div>`;
}
