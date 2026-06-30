// animations.js — GSAP + ScrollTrigger: neon flicker, reveals, stagger, revelação de grafite
import { state } from './config.js';

export function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = state.prefersReducedMotion;
  const mobile = state.isMobile;

  // --------------------------------------------
  // 1. NEON FLICKER NO LOGO — apenas no carregamento, opacity-only
  // --------------------------------------------
  const logo = document.getElementById('heroLogo');
  if (logo) {
    if (reduceMotion) {
      gsap.set(logo, { opacity: 1 });
    } else {
      const flickerTl = gsap.timeline();
      // Sequência de "piscadas" irregulares até estabilizar aceso (apenas opacity)
      const flickerSteps = [0, 1, 0.2, 1, 0, 0.6, 1, 0.3, 1, 1];
      let cursor = 0;
      flickerSteps.forEach((val, i) => {
        const dur = i === 0 ? 0.05 : 0.04 + Math.random() * 0.12;
        flickerTl.to(logo, { opacity: val, duration: dur, ease: 'none' }, cursor);
        cursor += dur;
      });
      flickerTl.set(logo, { opacity: 1 });
    }
  }

  // --------------------------------------------
  // 2. REVEALS GENÉRICOS — [data-reveal]
  // --------------------------------------------
  const revealEls = gsap.utils.toArray('[data-reveal]');

  if (reduceMotion) {
    revealEls.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
  } else {
    revealEls.forEach((el) => {
      // Hero usa o flicker do logo como entrada própria; demais reveals usam ScrollTrigger
      const inHero = el.closest('.hero');
      gsap.fromTo(
        el,
        { opacity: 0, y: mobile ? 14 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: mobile ? 0.5 : 0.85,
          ease: 'power3.out',
          delay: inHero ? 0.3 : 0,
          scrollTrigger: inHero ? undefined : {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }

  // --------------------------------------------
  // 3. STAGGER EM GRIDS (serviços, galeria, depoimentos, equipe, planos)
  // --------------------------------------------
  if (!reduceMotion) {
    ['.servicos-grid', '.galeria-grid', '.depoimentos-grid', '.equipe-grid', '.planos-grid'].forEach((selector) => {
      const grid = document.querySelector(selector);
      if (!grid) return;
      const cards = grid.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: mobile ? 14 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: mobile ? 0.5 : 0.8,
          ease: 'power3.out',
          stagger: mobile ? 0.08 : 0.14,
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }

  // --------------------------------------------
  // 4. SCROLL CUE
  // --------------------------------------------
  if (!reduceMotion) {
    gsap.to('.hero__scroll-cue span', {
      top: '0%',
      duration: 1.6,
      repeat: -1,
      ease: 'power2.inOut',
    });
  }

  // --------------------------------------------
  // 5. REVELAÇÃO DE GRAFITE — fotos com máscara que dissolve ao entrar na viewport
  // --------------------------------------------
  gsap.utils.toArray('[data-reveal-photo]').forEach((wrap) => {
    if (reduceMotion) {
      wrap.classList.add('is-revealed');
      return;
    }
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top 80%',
      invalidateOnRefresh: true,
      once: true,
      onEnter: () => wrap.classList.add('is-revealed'),
    });
  });

  // --------------------------------------------
  // Configuração global do ScrollTrigger
  // --------------------------------------------
  ScrollTrigger.config({ ignoreMobileResize: true });
}
