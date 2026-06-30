// animations.js — GSAP + ScrollTrigger: reveals, parallax, contadores, timeline, mask reveal
import { state } from './config.js';

export function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = state.prefersReducedMotion;
  const mobile = state.isMobile;

  // --------------------------------------------
  // 1. REVEALS GENÉRICOS — [data-reveal]
  // --------------------------------------------
  const revealEls = gsap.utils.toArray('[data-reveal]');

  if (reduceMotion) {
    // Sem animação complexa: apenas garante visibilidade (CSS já cobre via classe reduced-motion)
    revealEls.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
  } else {
    revealEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: mobile ? 14 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: mobile ? 0.5 : 0.9,
          ease: 'power3.out',
          scrollTrigger: {
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
  // 2. STAGGER EM GRIDS DE CARDS (pilares, depoimentos, planos)
  // --------------------------------------------
  if (!reduceMotion) {
    ['.pilares-grid', '.depoimentos-grid', '.planos-grid'].forEach((selector) => {
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
  // 3. PARALLAX SUTIL NO HERO (apenas transform, desativado em mobile/reduced-motion)
  // --------------------------------------------
  if (!reduceMotion && !mobile) {
    gsap.to('.hero__parallax-layer--1', {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    gsap.to('.hero__parallax-layer--2', {
      y: -120,
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
  // 4. SCROLL CUE (linha que "preenche" no hero)
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
  // 5. CONTADORES ANIMADOS (Credenciais)
  // --------------------------------------------
  gsap.utils.toArray('[data-count-to]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count-to'));
    const isDecimal = String(target).includes('.');

    if (reduceMotion) {
      el.textContent = isDecimal ? target.toFixed(1) : target;
      return;
    }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.6,
            ease: 'power2.out',
            snap: { textContent: isDecimal ? 0.1 : 1 },
            onUpdate() {
              const val = parseFloat(el.textContent);
              el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
            },
          }
        );
      },
      once: true,
    });
  });

  // --------------------------------------------
  // 6. TIMELINE — linha conectora via stroke-dashoffset
  // --------------------------------------------
  const timelinePath = document.querySelector('.timeline__line line');
  const timelineWrap = document.getElementById('timeline');
  if (timelinePath && timelineWrap) {
    if (reduceMotion) {
      gsap.set(timelinePath, { strokeDashoffset: 0 });
    } else {
      gsap.set(timelinePath, { strokeDashoffset: 1000 });
      gsap.to(timelinePath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineWrap,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  // --------------------------------------------
  // 7. REVELAÇÃO DE TEXTO NO RETRATO (clip-path via custom properties)
  // --------------------------------------------
  const portrait = document.getElementById('heroPortrait');
  if (portrait && !mobile) {
    portrait.addEventListener('mousemove', (e) => {
      const rect = portrait.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      portrait.style.setProperty('--mask-x', `${x}%`);
      portrait.style.setProperty('--mask-y', `${y}%`);
    });
    portrait.addEventListener('mouseleave', () => {
      portrait.style.setProperty('--mask-x', '50%');
      portrait.style.setProperty('--mask-y', '50%');
    });
  }

  // --------------------------------------------
  // Configuração global do ScrollTrigger
  // --------------------------------------------
  ScrollTrigger.config({ ignoreMobileResize: true });
}
