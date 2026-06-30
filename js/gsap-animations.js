// gsap-animations.js — Animações de scroll, "explosão" e contagem crescente
import { state } from './env.js';

function durationFor(base) {
  return state.isMobile ? base * 0.5 : base;
}

function animateRise() {
  document.querySelectorAll('[data-animate="rise"]').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 24, willChange: 'transform, opacity' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      invalidateOnRefresh: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: durationFor(0.6), ease: 'power3.out' }),
    });
  });
}

function animateExplode() {
  document.querySelectorAll('[data-animate="explode"]').forEach((el) => {
    gsap.set(el, { opacity: 0, scale: 0.3, willChange: 'transform, opacity' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      invalidateOnRefresh: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: durationFor(0.7),
          ease: state.isMobile ? 'power3.out' : 'elastic.out(1, 0.6)',
        }),
    });
  });
}

function animateStagger() {
  const groups = new Map();
  document.querySelectorAll('[data-animate="stagger"]').forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  groups.forEach((items, parent) => {
    gsap.set(items, { opacity: 0, x: -20, willChange: 'transform, opacity' });
    ScrollTrigger.create({
      trigger: parent,
      start: 'top 80%',
      invalidateOnRefresh: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          x: 0,
          duration: durationFor(0.5),
          stagger: state.isMobile ? 0.06 : 0.12,
          ease: 'power3.out',
        }),
    });
  });

  document.querySelectorAll('[data-animate="stagger-group"]').forEach((group) => {
    const items = Array.from(group.children);
    gsap.set(items, { opacity: 0, y: 16, willChange: 'transform, opacity' });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 80%',
      invalidateOnRefresh: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: durationFor(0.5),
          stagger: state.isMobile ? 0.05 : 0.1,
          ease: 'power3.out',
        }),
    });
  });
}

function animateFade() {
  document.querySelectorAll('[data-animate="fade"]').forEach((el) => {
    gsap.set(el, { opacity: 0 });
    gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power1.out' });
  });
}

function animateCounters() {
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.to(el, {
          textContent: target,
          duration: durationFor(1.4),
          ease: 'power2.out',
          snap: { textContent: 1 },
        });
      },
    });
  });
}

export function initScrollAnimations() {
  // Em prefersReducedMotion, aplica apenas fade simples e sai (sem ScrollTrigger complexo)
  if (state.prefersReducedMotion) {
    document
      .querySelectorAll('[data-animate]')
      .forEach((el) => gsap.set(el, { opacity: 1, scale: 1, x: 0, y: 0 }));
    animateCounters();
    return;
  }

  animateFade();
  animateRise();
  animateExplode();
  animateStagger();
  animateCounters();

  ScrollTrigger.config({ ignoreMobileResize: true });
}
