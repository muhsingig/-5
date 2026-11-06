// Procedural 250 ml sleek can: printed body, metal shoulders/lid/base, rivet + pull-tab that opens.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { FLAVOURS } from './data.js';
import { paintLabel } from './label.js';

export const R = 1;
export const BODY_H = 4.4;
const HALF = BODY_H / 2;

let envTex = null;
export function environmentFor(renderer) {
  if (envTex) return envTex;
  const pmrem = new THREE.PMREMGenerator(renderer);
  envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return envTex;
}

const textures = {};
let texturesReady;
export function loadLabels(maxAniso = 8) {
  texturesReady ||= Promise.all(
    FLAVOURS.map(async (f) => {
      const cv = await paintLabel(f);
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      textures[f.id] = t;
    })
  ).then(() => textures);
  return texturesReady;
}
export const labelTexture = (id) => textures[id];

// Personalised label (name + message) → new texture; previous custom texture is disposed by caller
export async function customTexture(f, opts, maxAniso = 8) {
  const cv = await paintLabel(f, opts);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

const metal = () =>
  new THREE.MeshStandardMaterial({ color: 0xd9dce2, metalness: 1, roughness: 0.24, side: THREE.DoubleSide });

function lathe(points, mat, segs = 128) {
  return new THREE.Mesh(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segs), mat);
}

export function createCan(flavourId = FLAVOURS[0].id) {
  const group = new THREE.Group();

  // printed body. thetaStart = PI puts u = 0.5 (label centre) at +Z, facing the camera.
  const bodyMat = new THREE.MeshPhysicalMaterial({
    map: textures[flavourId] || null,
    metalness: 0.12,
    roughness: 0.38,
    clearcoat: 0.45,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.85,
  });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, BODY_H, 160, 1, true, Math.PI, Math.PI * 2), bodyMat);
  group.add(body);

  const m = metal();
  // shoulder → neck → rim → lid (top)
  const top = lathe(
    [
      [1.0, HALF - 0.002], [1.0, HALF + 0.05], [0.985, HALF + 0.11], [0.95, HALF + 0.18], [0.9, HALF + 0.24], [0.865, HALF + 0.28],
      [0.86, HALF + 0.31], [0.875, HALF + 0.325], [0.888, HALF + 0.345], [0.882, HALF + 0.365], [0.862, HALF + 0.372],
      [0.845, HALF + 0.36], [0.84, HALF + 0.33], [0.8, HALF + 0.318], [0.6, HALF + 0.322], [0.0, HALF + 0.322],
    ],
    m
  );
  group.add(top);
  // base
  const base = lathe(
    [
      [0.0, -HALF - 0.1], [0.5, -HALF - 0.12], [0.72, -HALF - 0.17], [0.8, -HALF - 0.2], [0.86, -HALF - 0.19],
      [0.93, -HALF - 0.13], [0.98, -HALF - 0.06], [1.0, -HALF + 0.002],
    ],
    m
  );
  group.add(base);

  // score + mouth on the lid (front side)
  const lidY = HALF + 0.323;
  const score = new THREE.Mesh(
    new THREE.CircleGeometry(0.26, 48),
    new THREE.MeshStandardMaterial({ color: 0xb9bcc3, metalness: 1, roughness: 0.35 })
  );
  score.rotation.x = -Math.PI / 2;
  score.scale.set(1.15, 0.8, 1);
  score.position.set(0, lidY + 0.002, 0.42);
  group.add(score);
  const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.24, 48), new THREE.MeshBasicMaterial({ color: 0x0b0a0c }));
  mouth.rotation.x = -Math.PI / 2;
  mouth.scale.set(1.12, 0.78, 1);
  mouth.position.set(0, lidY + 0.004, 0.42);
  mouth.visible = false;
  group.add(mouth);

  // rivet
  const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.04, 24), m);
  rivet.position.set(0, lidY + 0.02, 0.08);
  group.add(rivet);

  // pull tab (pivot at rivet, ring points to the back)
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, 0.27, 0.36, 0, Math.PI * 2, false, 0);
  const hole = new THREE.Path();
  hole.absellipse(0, -0.1, 0.15, 0.16, 0, Math.PI * 2, true, 0);
  shape.holes.push(hole);
  const tabGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 32 });
  tabGeo.rotateX(Math.PI / 2);
  tabGeo.translate(0, 0, -0.05);
  const tab = new THREE.Mesh(tabGeo, new THREE.MeshStandardMaterial({ color: 0xc9ccd4, metalness: 1, roughness: 0.2 }));
  const tabPivot = new THREE.Group();
  tabPivot.position.set(0, lidY + 0.035, 0.08);
  tab.position.z = -0.18;
  tabPivot.add(tab);
  group.add(tabPivot);

  // centre the can vertically on its full height
  group.children.forEach((c) => (c.position.y -= 0.085));

  const api = {
    group,
    body,
    setFlavour(id) {
      bodyMat.map = textures[id];
      bodyMat.needsUpdate = true;
    },
    setTexture(t) {
      bodyMat.map = t;
      bodyMat.needsUpdate = true;
    },
    // 0 = closed, 1 = fully open (tab vertical, mouth punched)
    setOpen(t) {
      tabPivot.rotation.x = t * 1.45;
      mouth.visible = t > 0.35;
      score.visible = !mouth.visible;
    },
  };
  return api;
}

/* ---------- studio: renders still product shots to data URLs ---------- */
let studio;
export function getStudio() {
  if (studio) return studio;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.environment = environmentFor(renderer);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 8);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const cans = [0, 1, 2, 3].map(() => {
    const c = createCan();
    scene.add(c.group);
    return c;
  });

  studio = {
    /**
     * shot({ flavours: ['mango'], w, h, poses: [{x,y,z,rx,ry,rz,s}], cam: {z, y, fov}, open })
     */
    shot({ flavours, w = 600, h = 760, poses = [], cam = {}, open = 0 }) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = cam.fov || 26;
      camera.position.set(cam.x || 0, cam.y || 0, cam.z || 14);
      camera.lookAt(cam.lx || 0, cam.ly || 0, 0);
      camera.updateProjectionMatrix();
      cans.forEach((c, i) => {
        const f = flavours[i];
        c.group.visible = !!f;
        if (!f) return;
        const p = poses[i] || {};
        c.setFlavour(f);
        c.setOpen(p.open ?? open);
        c.group.position.set(p.x || 0, p.y || 0, p.z || 0);
        c.group.rotation.set(p.rx || 0, p.ry || 0, p.rz || 0);
        c.group.scale.setScalar(p.s || 1);
      });
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    },
  };
  return studio;
}
