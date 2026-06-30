// animations.js — GSAP + ScrollTrigger: fade-ins lentos e elegantes, névoa, stagger suave
import { state } from './config.js';

export function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = state.prefersReducedMotion;
  const mobile = state.isMobile;

  // --------------------------------------------
  // 1. REVEALS GENÉRICOS — [data-reveal], sempre lentos e sutis (8-16px)
  // --------------------------------------------
  const revealEls = gsap.utils.toArray('[data-reveal]');

  if (reduceMotion) {
    revealEls.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
  } else {
    revealEls.forEach((el) => {
      const inHero = el.closest('.hero');
      gsap.fromTo(
        el,
        { opacity: 0, y: mobile ? 8 : 14 },
        {
          opacity: 1,
          y: 0,
          duration: mobile ? 0.6 : 1.1,
          ease: 'sine.out',
          delay: inHero ? 0.15 : 0,
          scrollTrigger: inHero ? undefined : {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }

  // --------------------------------------------
  // 2. STAGGER SUAVE EM GRIDS (tratamentos, galeria, depoimentos, equipe, planos)
  // --------------------------------------------
  if (!reduceMotion) {
    ['.tratamentos-grid', '.galeria-grid', '.depoimentos-grid', '.equipe-grid', '.planos-grid'].forEach((selector) => {
      const grid = document.querySelector(selector);
      if (!grid) return;
      const cards = grid.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: mobile ? 8 : 16 },
        {
          opacity: 1,
          y: 0,
          duration: mobile ? 0.6 : 1,
          ease: 'sine.out',
          stagger: mobile ? 0.1 : 0.18,
          scrollTrigger: {
            trigger: grid,
            start: 'top 88%',
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }

  // --------------------------------------------
  // 3. NÉVOA SUAVE NO HERO — deslocamento lento via transform (desativado em mobile/reduced-motion)
  // --------------------------------------------
  if (!reduceMotion && !mobile) {
    gsap.to('.hero__mist--1', {
      x: 40,
      y: -20,
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to('.hero__mist--2', {
      x: -50,
      y: 30,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Parallax sutil ao rolar
    gsap.to('.hero__mist--1', {
      y: '+=60',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }

  // --------------------------------------------
  // 4. SCROLL CUE
  // --------------------------------------------
  if (!reduceMotion) {
    gsap.to('.hero__scroll-cue span', {
      top: '0%',
      duration: 2,
      repeat: -1,
      ease: 'power1.inOut',
    });
  }

  // --------------------------------------------
  // Configuração global do ScrollTrigger
  // --------------------------------------------
  ScrollTrigger.config({ ignoreMobileResize: true });
}
