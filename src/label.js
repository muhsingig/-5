// Paints the wrap-around Moonshot can label onto a canvas. u = 0.5 is the front of the can.
import { C } from './data.js';
import { art, icons, sparklePath, boltPath } from './art.js';
import { LOGO_PATH, LOGO_BOX } from './logo.js';

export const LABEL_W = 2048;
export const LABEL_H = 1432;

const svgImg = (markup, w, h) =>
  new Promise((res) => {
    let s = markup;
    if (!/width=/.test(s.slice(0, 120))) s = s.replace('<svg ', `<svg width="${w}" height="${h}" `);
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  });

let fontsReady;
export function loadLabelFonts() {
  fontsReady ||= Promise.all([document.fonts.load('500 60px "Inter Tight"'), document.fonts.load('400 60px "Inter Tight"')]).catch(() => {});
  return fontsReady;
}

const heroArt = {
  mango: [art.mango, art.mangoCheek, art.leaves],
  jamun: [art.gola, art.jamun, art.moon],
  guava: [() => art.chilli(), art.guavaHalf, art.guava],
  nimbu: [() => art.mintLeaf(true), art.limeWheel, art.charm],
};

function drawLogo(ctx, cx, cy, length, fill, rot = -Math.PI / 2, shadow) {
  // the wordmark rotated to read bottom-to-top; `length` = its length along the can
  const p = new Path2D(LOGO_PATH);
  const s = length / LOGO_BOX.w;
  const paint = (dx, dy, color) => {
    ctx.save();
    ctx.translate(cx + dx, cy + dy);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.translate(-LOGO_BOX.x - LOGO_BOX.w / 2, -LOGO_BOX.y - LOGO_BOX.h / 2);
    ctx.fillStyle = color;
    ctx.fill(p);
    ctx.restore();
  };
  if (shadow) paint(12, 10, shadow);
  paint(0, 0, fill);
}

function pattern(ctx, color, seed = 1) {
  ctx.save();
  ctx.fillStyle = color;
  let r = seed * 9301;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) {
    const x = rnd() * LABEL_W, y = 140 + rnd() * (LABEL_H - 200), s = 1.2 + rnd() * 2.6;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rnd() * 6.28);
    ctx.scale(s, s);
    ctx.fill(new Path2D(i % 3 ? sparklePath : boltPath));
    ctx.restore();
  }
  ctx.restore();
}

export async function paintLabel(f) {
  await loadLabelFonts();
  const cv = document.createElement('canvas');
  cv.width = LABEL_W;
  cv.height = LABEL_H;
  const ctx = cv.getContext('2d');
  const L = f.label;
  const cx = LABEL_W / 2;

  ctx.fillStyle = f.bg;
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);
  ctx.globalAlpha = 0.55;
  pattern(ctx, L.tint, f.id.length + 3);
  ctx.globalAlpha = 1;

  // top band with running text
  const bandH = 118;
  ctx.fillStyle = L.band;
  ctx.fillRect(0, 0, LABEL_W, bandH);
  ctx.fillStyle = C.night;
  ctx.font = '500 54px "Inter Tight"';
  ctx.textBaseline = 'middle';
  const run = 'PLANT-POWERED SPARKLING ENERGY  ✦  ';
  const rw = ctx.measureText(run).width;
  for (let x = -rw / 2; x < LABEL_W; x += rw) ctx.fillText(run, x, bandH / 2 + 3);
  ctx.fillStyle = L.band;
  ctx.fillRect(0, LABEL_H - 26, LABEL_W, 26);

  // illustrations around the wordmark
  const [a1, a2, a3] = heroArt[f.id];
  const [i1, i2, i3] = await Promise.all([svgImg(a1(), 520, 560), svgImg(a2(), 520, 520), svgImg(a3(), 480, 480)]);
  if (i2) ctx.drawImage(i2, cx + 150, 170, 440, 440 * (i2.height / i2.width));
  if (i3) ctx.drawImage(i3, cx - 600, 800, 400, 400 * (i3.height / i3.width));
  if (i1) ctx.drawImage(i1, cx - 580, 190, 420, 420 * (i1.height / i1.width));

  // vertical wordmark (front centre)
  drawLogo(ctx, cx + 10, 680, 1080, L.word, -Math.PI / 2, f.accent);

  // front info block
  ctx.textAlign = 'center';
  const pillW = 340, pillH = 52, py = 1250;
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.roundRect(cx + 240 - pillW / 2, py - pillH / 2, pillW, pillH, 26);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.ink;
  ctx.stroke();
  ctx.fillStyle = C.ink;
  ctx.font = '500 30px "Inter Tight"';
  ctx.fillText('GREEN COFFEE + TEA', cx + 240, py + 2);
  ctx.fillStyle = L.word;
  ctx.font = '500 48px "Inter Tight"';
  ctx.fillText(f.name.toUpperCase(), cx + 240, 1318);
  ctx.font = '400 32px "Inter Tight"';
  ctx.fillText(f.fruitLine.toUpperCase(), cx + 240, 1372);
  ctx.fillText('250 ml · 80 mg caffeine', cx - 330, 1372);

  // back: benefits column
  const bx = 1640;
  const iconList = [['wave', 'NO CRASH', 'LANDING'], ['bean', 'PLANT', 'CAFFEINE'], ['drop', 'ELECTRO-', 'LYTES'], ['cube', 'BARELY', 'SWEET']];
  const iconImgs = await Promise.all(iconList.map(([k]) => svgImg(icons[k]().replace(/currentColor/g, C.cream), 120, 120)));
  ctx.textAlign = 'left';
  iconList.forEach(([, t1, t2], i) => {
    const y = 210 + i * 285;
    if (iconImgs[i]) ctx.drawImage(iconImgs[i], bx, y, 110, 110);
    ctx.fillStyle = C.cream;
    ctx.font = '500 36px "Inter Tight"';
    ctx.fillText(t1, bx, y + 150);
    ctx.fillText(t2, bx, y + 190);
  });

  // back: nutrition panel
  const nx = 150, ny = 210, nw = 380, nh = 940;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(nx, ny, nw, nh, 26);
  ctx.fill();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = C.ink;
  ctx.font = '500 40px "Inter Tight"';
  ctx.fillText('Nutrition', nx + 26, ny + 60);
  ctx.font = '400 26px "Inter Tight"';
  ctx.fillText('per 250 ml can', nx + 26, ny + 98);
  const rows = [['Energy', '28 kcal'], ['Sugar', '5 g'], ['Carbs', '6.4 g'], ['Sodium', '38 mg'], ['Potassium', '90 mg'], ['Caffeine', '80 mg'], ['Protein', '0 g'], ['Fat', '0 g']];
  rows.forEach(([k, v], i) => {
    const y = ny + 180 + i * 84;
    ctx.fillRect(nx + 26, y - 40, nw - 52, 2);
    ctx.font = '400 30px "Inter Tight"';
    ctx.textAlign = 'left';
    ctx.fillText(k, nx + 26, y);
    ctx.textAlign = 'right';
    ctx.fillText(v, nx + nw - 26, y);
  });
  ctx.textAlign = 'left';
  ctx.font = '400 22px "Inter Tight"';
  ctx.fillText('High caffeine. Not for children', nx + 26, ny + nh - 64);
  ctx.fillText('or pregnant women.', nx + 26, ny + nh - 36);

  // seam strip: barcode + small print
  ctx.fillStyle = '#fff';
  ctx.fillRect(1960, 980, 78, 300);
  ctx.fillStyle = C.ink;
  for (let i = 0; i < 34; i++) ctx.fillRect(1970, 990 + i * 8, 58, [2, 4, 3, 6][(i * 7) % 4]);
  ctx.save();
  ctx.fillStyle = L.word;
  ctx.translate(40, 716);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = '500 26px "Inter Tight"';
  ctx.fillText('MADE IN INDIA · DRINK COLD · MOONSHOT BEVERAGES PVT. LTD., PUNE', 0, 0);
  ctx.restore();
  return cv;
}
