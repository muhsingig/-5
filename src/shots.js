// Renders every product still on the site from the same 3D can (no photo assets needed).
import { getStudio } from './can.js';
import { FLAVOURS } from './data.js';

const ids = FLAVOURS.map((f) => f.id);
const cache = {};

const recipes = {
  ...Object.fromEntries(ids.map((id) => [`prod-${id}`, { flavours: [id], w: 520, h: 720, poses: [{ ry: -0.32 }], cam: { z: 14.5 } }])),
  ...Object.fromEntries(ids.map((id, i) => [`prodh-${id}`, { flavours: [id], w: 520, h: 720, poses: [{ ry: 0.5 + i * 0.2, rx: 0.32, open: 1 }], cam: { z: 14.5 } }])),
  ...Object.fromEntries(ids.map((id) => [`back-${id}`, { flavours: [id], w: 520, h: 720, poses: [{ ry: Math.PI - 0.5 }], cam: { z: 14.5 } }])),
  ...Object.fromEntries(ids.map((id) => [`top-${id}`, { flavours: [id], w: 720, h: 720, poses: [{ rx: 0.7, ry: 0.1, open: 1 }], cam: { z: 8, y: 1.6, ly: 1.6 } }])),
  ...Object.fromEntries(ids.map((id) => [`lie-${id}`, { flavours: [id], w: 720, h: 720, poses: [{ rz: 1.3, ry: 0.3 }], cam: { z: 12 } }])),
  ...Object.fromEntries(ids.map((id) => [`duoof-${id}`, { flavours: [id, id], w: 720, h: 720, poses: [{ x: -1.1, rz: 0.22 }, { x: 1.1, rz: -0.22, ry: 1.2 }], cam: { z: 13 } }])),
  'prod-pack': {
    flavours: ids,
    w: 720,
    h: 720,
    poses: [{ x: -2.6, z: -1.2, ry: -0.4, rz: 0.06 }, { x: 2.6, z: -1.2, ry: 0.4, rz: -0.06 }, { x: -0.95, z: 0.6, ry: -0.2 }, { x: 0.95, z: 0.6, ry: 0.2 }],
    cam: { z: 16.5, y: 0.6 },
  },
  'prodh-pack': {
    flavours: ids,
    w: 720,
    h: 720,
    poses: [{ x: -2.4, rz: 0.35, ry: 0.4 }, { x: -0.8, rz: 0.12, ry: 0.9 }, { x: 0.8, rz: -0.12, ry: 1.5 }, { x: 2.4, rz: -0.35, ry: 2.1, open: 1 }],
    cam: { z: 16 },
  },
  duo1: { flavours: ['mango', 'guava'], w: 700, h: 900, poses: [{ x: -0.9, z: 0.8, rz: 0.12, ry: -0.3 }, { x: 1.1, z: -1, rz: -0.2, ry: 0.5 }], cam: { z: 13.5 } },
  duo2: { flavours: ['jamun'], w: 700, h: 900, poses: [{ rx: 0.42, ry: -0.5, rz: -0.12, open: 1 }], cam: { z: 12 } },
  insta0: { flavours: ['mango'], w: 600, h: 600, poses: [{ rz: -0.5, ry: 0.4 }], cam: { z: 12 } },
  insta1: { flavours: ['nimbu'], w: 600, h: 600, poses: [{ rx: 0.5, ry: 0.2, open: 1 }], cam: { z: 11 } },
  insta2: { flavours: ['guava', 'guava'], w: 600, h: 600, poses: [{ x: -1.1, rz: 0.25 }, { x: 1.1, rz: -0.25, ry: 1.2 }], cam: { z: 13 } },
  insta3: { flavours: ['jamun'], w: 600, h: 600, poses: [{ rz: 1.35, ry: 0.2, x: 0.1 }], cam: { z: 11.5 } },
  'game-can': { flavours: ['mango'], w: 260, h: 420, poses: [{ ry: -0.3 }], cam: { z: 13 } },
};
const alias = (n) => n.replace(/^(menu|cart)-/, 'prod-');

export function shot(name) {
  if (cache[name]) return cache[name];
  const r = recipes[alias(name)];
  if (!r) return '';
  return (cache[name] = getStudio().shot(r));
}

const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 300 }) : setTimeout(fn, 16));

// Fill every <img data-shot> progressively so the main thread never stalls for long.
export function fillShots(root = document) {
  const imgs = [...root.querySelectorAll('img[data-shot]')].filter((i) => !i.getAttribute('src'));
  return new Promise((resolve) => {
    const step = () => {
      const t = performance.now();
      while (imgs.length && performance.now() - t < 24) {
        const img = imgs.shift();
        img.src = shot(img.dataset.shot);
      }
      imgs.length ? idle(step) : resolve();
    };
    step();
  });
}
