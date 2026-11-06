# Moonshot: plant-powered sparkling energy (concept site)

A hypothetical energy drink from Pune. Its site reproduces the structure, motion and interactions of
[manayerbamate.com](https://en.manayerbamate.com/) closely, with Moonshot's own name, palette,
illustrations, 3D can and copy. Brand notes are in [BRAND.md](BRAND.md).

## Run it

```bash
node server.mjs
```

Open http://127.0.0.1:5180. There's no build step. three.js, GSAP + ScrollTrigger and Lenis are vendored in
`vendor/`, and the font is Inter Tight (standing in for the reference's Neue Montreal).

## Homepage (same order and motion as the reference)

1. **Intro (every load, like the reference):** on a starry night sky, "CHARGED BY NATURE" types in letter
   by letter, each letter flicking through the palette before settling in moonlight. Stars pop up from below with an elastic ease, then "GREEN / COFFEE" rises in
   at the sides.
2. **Circle burst:** seven circles burst open from the reference's own positions and timings until the hero
   colour fills the screen, then the 3D can flies up with an elastic ease while spinning in,
   the scene's illustrations swing in from both sides, and the header and flavour pill drop in.
3. **Hero:** a 450vw wheel of eight illustrated flavour scenes. The arrows (or a swipe) rotate it 45° with
   an elastic settle. The can spins, swaps its label and slides sideways, and the background and pill
   recolour. The can follows the mouse.
4. **Scroll:** the scene flies off to the corners, and the can tilts and sinks to the bottom of the screen.
   A night-coloured arc rises.
5. **Pinned benefits wheel:** the heading plus four cards on a giant wheel turned by the scroll. The
   can's pull-tab pops open and bubbles rise, ending on a curved "ONLY THE GOOD STUFF".
6. Two-up campaign images with parallax, a giant rainbow "FLAVOURS" with popping stars, and a looping
   product slider where three circles grow from random points on hover to reveal a second image.
7. Subscription block (outlined text drifting along a curve, a spinning badge, a parallax rocket), then
   floating Instagram tiles on an arc-topped panel.
8. **Footer runner game:** press Space to jump. Catch a can for "ZAP!"; hit an alarm clock, sugar crash,
   Monday, 1% phone or deadline for "OOF...". Socials, credits drawer.

Also: the mega-menu (Shop / Learn) with an overlay and staggered cards, the cart and credits drawers, the
mobile menu, the dismissable bandeau, the header logo that hides on scroll down, and the page transition: a circle
grows from the click point and the seven bursts cover the screen. On the next page the bursts punch holes
that reveal it (the intro is skipped when you arrive this way).

## Product page (`product.html?f=mango|jamun|guava|nimbu|pack`)

Same layout as the reference's product page:

- A framed photo slider where each new image is revealed by three growing circles, with a badge that
  rotates as you scroll.
- Centred title and price, a pill row for pack and quantity, Single / Subscribe radios with delivery
  options, and Add to cart.
- The long description and an ingredient list with round icons, then the back of the can beside a
  "Daily value" table.
- A "good stuff" bubbles strip, then a 12-card wheel turned by its arrows, with the 3D can at the
  bottom following the mouse.
- Recommended products, then the footer game.

## Edit

Flavours, palette, copy, prices, ingredients and nutrition are in `src/data.js`, the illustrations in
`src/art.js`, the can label in `src/label.js` and the styles in `src/styles.css`. The cart is
client-side only, so "Payment" shows a notice.
