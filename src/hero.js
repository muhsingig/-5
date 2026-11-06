// Home hero: fixed WebGL can over a rotating wheel of flavour scenes,
// scroll-scrubbed into the pinned benefits wheel (mirrors the reference's Home class).
import * as THREE from 'three';
import { createCan, environmentFor } from './can.js';
import { FLAVOURS } from './data.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const $ = (s) => document.querySelector(s);
const mod = (n, m) => ((n % m) + m) % m;

export class Hero {
  constructor(lenis) {
    this.lenis = lenis;
    this.tweens = [];
    this.currentSlide = 0;
    this.currentStep = 0;
    this.rotationHome = 0;
    this.busy = false;
    this.W = innerWidth;
    this.H = innerHeight;
    this.desktop = this.W > 600;

    const size = this.W >= 650 ? gsap.utils.clamp(650, 900, this.W / 2) : 0.9 * this.W;
    this.size = size;
    this.marge = (this.H - size) / 2;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(size, size);
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    $('.mainCanvas').prepend(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.environment = environmentFor(this.renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(5, 6, 9);
    this.scene.add(key, new THREE.AmbientLight(0xffffff, 0.3));

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    this.camera.position.z = this.W >= 650 ? 13 : 12;

    this.can = createCan(FLAVOURS[0].id);
    this.group = new THREE.Group();
    this.groupMouse = new THREE.Group();
    this.groupMouse.add(this.can.group);
    this.group.add(this.groupMouse);
    this.scene.add(this.group);

    this.animate = () => this.renderer.render(this.scene, this.camera);
    this.onMouse = this.onMouse.bind(this);
  }

  /* ---------- scroll choreography ---------- */
  setupScroll() {
    const canvas = this.renderer.domElement;
    const part1 = { trigger: '.c-HomeHero--part1', start: 'top top', end: 'bottom bottom', scrub: true };

    if (this.desktop) {
      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' }, scrollTrigger: part1 });
      tl.to(this.group.rotation, { x: 0.55, y: -Math.PI * 2, z: 0.05 }, 0)
        .to(canvas, { y: 0.56 * this.size + this.marge + 'px' }, 0)
        .to(this.group.position, { z: 2.6 }, 0)
        .to(this.camera.position, { y: 0.4 }, 0);
      this.tweens.push(tl);
      this.bindStepScroll(0);
      // the flavour pill leaves once the first screen has scrolled by, and comes back with it
      this.tweens.push(
        ScrollTrigger.create({
          trigger: '.c-HomeHero--part1',
          start: `top -${this.H}px`,
          onEnter: () => gsap.to('.slider-navigation', { y: '130%', ease: 'power4.in', duration: 0.4, overwrite: true }),
          onLeaveBack: () => gsap.to('.slider-navigation', { y: '0%', ease: 'elastic.out(1.1, 0.75)', duration: 0.6, overwrite: true }),
        })
      );
    }

    this.tweens.push(gsap.to('.arc', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.sectionCercle', start: `top bottom-=${0.06 * this.W}`, end: 'top top', scrub: true } }));

    if (this.desktop) {
      this.distCercle = 3 * this.W;
      this.tweens.push(
        gsap.to('.innerCercleCartes', {
          rotation: -130,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '.sectionCercle',
            start: 'top top',
            end: '+=' + this.distCercle,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            onEnter: () => this.openCan(true),
            onLeaveBack: () => this.openCan(false),
          },
        })
      );
      this.tweens.push(gsap.to(this.can.group.rotation, { y: Math.PI * 2, ease: 'power1.inOut', scrollTrigger: { trigger: '.sectionCercle', start: 'top top', end: '+=' + this.distCercle, scrub: true } }));
      this.tweens.push(gsap.to('.allBulles', { x: 0, xPercent: 0, ease: 'power1.out', scrollTrigger: { trigger: '.innerCercleCartes', start: `top -=${this.distCercle - 1.5 * this.W}`, end: '+=' + 1.5 * this.W, scrub: true } }));
    } else {
      document.querySelectorAll('.etapeBenefice').forEach((e) => {
        this.tweens.push(
          gsap.fromTo(e.querySelector('.data'), { y: '40%', x: 40 * Math.random() - 20, rotation: 10 * Math.random() - 5 }, {
            y: '0%', x: 40 * Math.random() - 20, rotation: 10 * Math.random() - 5,
            scrollTrigger: { trigger: e, start: 'top bottom', end: 'bottom 30%', scrub: true },
          })
        );
      });
    }

    // hand the screen back once the duo images cover the can
    this.tweens.push(ScrollTrigger.create({ trigger: '.offCanvas', start: 'top top', onEnter: () => this.sleep(true), onLeaveBack: () => this.sleep(false) }));
  }

  bindStepScroll(step) {
    if (!this.desktop) return;
    const g = `.step${step} .gauche`, d = `.step${step} .droite`;
    gsap.set([g, d], { clearProps: 'all' });
    const st = { trigger: '.c-HomeHero--part1', start: 'top top', end: 'bottom bottom', scrub: true };
    this.tweens.push(gsap.to(g, { x: '-50%', y: '-80%', rotation: -20, ease: 'none', scrollTrigger: { ...st } }));
    this.tweens.push(gsap.to(d, { x: '50%', y: '-80%', rotation: 20, ease: 'none', scrollTrigger: { ...st } }));
  }

  openCan(open) {
    const s = { t: open ? 0 : 1 };
    gsap.to(s, { t: open ? 1 : 0, duration: open ? 0.9 : 0.5, delay: 0.1, ease: open ? 'elastic.out(1, 0.6)' : 'power4.in', onUpdate: () => this.can.setOpen(s.t) });
    if (open && this.desktop) this.bubbles();
  }

  bubbles() {
    const circles = document.querySelectorAll('.mainCanvas .bulles circle');
    gsap.killTweensOf(circles);
    circles.forEach((c, i) => {
      gsap.fromTo(
        c,
        { attr: { cy: 380, cx: 70 + Math.random() * 60 }, opacity: 1, scale: 0.4, transformOrigin: 'center' },
        { attr: { cy: -40 - Math.random() * 260, cx: 10 + Math.random() * 180 }, scale: 1, opacity: 0, duration: 1.6 + Math.random() * 1.2, delay: i * 0.06, ease: 'power1.out' }
      );
    });
  }

  sleep(off) {
    $('.c-HomeHero').classList.toggle('off', off);
    if (off) {
      gsap.ticker.remove(this.animate);
      removeEventListener('mousemove', this.onMouse);
    } else {
      gsap.ticker.add(this.animate);
      addEventListener('mousemove', this.onMouse);
    }
  }

  /* ---------- entrance ---------- */
  enter() {
    gsap.ticker.add(this.animate);
    const qt = (o, p) => gsap.quickTo(o, p, { duration: 0.6, ease: 'power3' });
    this.xTo = qt(this.groupMouse.position, 'x');
    this.yTo = qt(this.groupMouse.position, 'y');
    this.rYTo = qt(this.groupMouse.rotation, 'y');
    this.rXTo = qt(this.groupMouse.rotation, 'x');
    this.rZTo = qt(this.groupMouse.rotation, 'z');
    if (matchMedia('(pointer: fine)').matches) addEventListener('mousemove', this.onMouse);

    gsap.from(this.group.rotation, { y: 2 * Math.PI, x: 0.3 * Math.PI, z: 0.2 * Math.PI, ease: 'power2.out', duration: 1.1, delay: 0.3 });
    gsap.to('.mainCanvas', { y: 0, yPercent: 0, xPercent: -50, ease: 'elastic.out(1, 0.75)', duration: 1.1, delay: 0.3, onComplete: () => this.lenis && this.lenis.start() });
    gsap.to('.introGauche, .introDroite', { x: 0, rotation: 0, ease: 'elastic.out(0.8, 0.75)', duration: 1.2, stagger: 0.1, delay: 0.8 });
    const bandeau = $('.bandeau:not(.off)');
    if (bandeau) gsap.to(bandeau, { y: 0, ease: 'power3.out', duration: 0.4, delay: 1.1 });
    gsap.to(scrollY > this.H ? '.header' : '.slider-navigation, .header', { y: '0%', ease: 'elastic.out(1.1, 0.75)', duration: 0.6, delay: 1.1 });
  }

  onMouse(e) {
    const nx = e.clientX / this.W - 0.5, ny = e.clientY / this.H - 0.5;
    this.xTo(nx * 0.7);
    this.yTo(-ny * 1.2);
    this.rYTo(nx / 2);
    this.rXTo((ny * Math.PI) / 12);
    this.rZTo(nx / 10);
  }

  /* ---------- flavour carousel ---------- */
  go(dir) {
    if (this.busy) return;
    this.busy = true;
    const btns = document.querySelectorAll('.innerBtn .btnOmbre');
    const prev = document.querySelector('.innerBtn .btnOmbre.current');
    this.currentSlide = mod(this.currentSlide + dir, 4);
    const next = btns[this.currentSlide];
    const w = prev.clientWidth, col = prev.querySelector('span').style.backgroundColor;
    prev.classList.remove('current');
    next.classList.add('current');
    gsap.from(next.querySelector('span'), { width: w + 'px', backgroundColor: col, duration: 0.5, ease: 'power4.inOut', clearProps: 'width' });
    gsap.fromTo(next.querySelector('.second'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, delay: 0.2, ease: 'power2.in' });

    const f = FLAVOURS[this.currentSlide];
    document.body.dataset.flavour = f.id;
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', f.bg);

    const r = this.can.group.rotation;
    gsap.timeline().fromTo(r, { y: 0 }, { y: 0.3 * dir * 2 * Math.PI, ease: 'power2.in', duration: 0.3 }).to(r, { y: 2 * dir * Math.PI, ease: 'elastic.out(0.34, 0.26)', duration: 1.3 });
    gsap.fromTo(this.can.group.position, { x: 0 }, { x: -1.1 * dir, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    gsap.delayedCall(0.3, () => this.can.setFlavour(f.id));
    gsap.delayedCall(1, () => (this.busy = false));

    this.rotationHome -= 45 * dir;
    const old = mod(this.currentStep, 8);
    gsap.killTweensOf(`.step${old} .gauche, .step${old} .droite`);
    this.currentStep += dir;
    const cur = mod(this.currentStep, 8);
    document.querySelectorAll('.lotties .step').forEach((s, i) => s.classList.toggle('current', i === cur));
    this.bindStepScroll(cur);
    gsap.timeline().to('.lotties', { rotation: this.rotationHome + 30 * dir, ease: 'power2.in', duration: 0.4 }).to('.lotties', { rotation: this.rotationHome, ease: 'elastic.out(0.34, 0.26)', duration: 1.2 });
  }
}
