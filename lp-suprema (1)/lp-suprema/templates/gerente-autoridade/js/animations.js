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
  // 7. SPOTLIGHT NO RETRATO — clip-path circular com lerp, glow e stagger de texto
  // --------------------------------------------
  const portrait = document.getElementById('heroPortrait');
  if (portrait) {
    const words = portrait.querySelectorAll('.hero__portrait-reveal-word');
    const rules = portrait.querySelectorAll('.hero__portrait-reveal-rule');
    const maxRadius = mobile ? 105 : 150;
    const maskState = { r: 0 };

    let targetX = 50, targetY = 50, currentX = 50, currentY = 50;
    let rafId = null;

    function followLoop() {
      // lerp manual — só transform/custom property, sem layout thrashing
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      portrait.style.setProperty('--mask-x', `${currentX}%`);
      portrait.style.setProperty('--mask-y', `${currentY}%`);
      rafId = requestAnimationFrame(followLoop);
    }

    function openSpotlight() {
      portrait.classList.add('is-active');
      if (!rafId) followLoop();

      if (reduceMotion) {
        portrait.style.setProperty('--mask-r', `${maxRadius}px`);
        gsap.set(words, { opacity: 1 });
        gsap.set(rules, { opacity: 1 });
        return;
      }
      gsap.killTweensOf([maskState, words, rules]);
      gsap.to(maskState, {
        r: maxRadius,
        duration: 0.7,
        ease: 'power3.out',
        onUpdate: () => portrait.style.setProperty('--mask-r', `${maskState.r}px`),
      });
      gsap.fromTo(words, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.16, ease: 'power2.out' });
      gsap.fromTo(rules, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.2 });
    }

    function closeSpotlight() {
      portrait.classList.remove('is-active');
      targetX = 50; targetY = 50;

      if (reduceMotion) {
        portrait.style.setProperty('--mask-r', '0px');
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        return;
      }
      gsap.killTweensOf([maskState, words, rules]);
      gsap.to(maskState, {
        r: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => portrait.style.setProperty('--mask-r', `${maskState.r}px`),
        onComplete: () => {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          portrait.style.setProperty('--mask-x', '50%');
          portrait.style.setProperty('--mask-y', '50%');
        },
      });
      gsap.to(words, { opacity: 0, duration: 0.3 });
      gsap.to(rules, { opacity: 0, duration: 0.3 });
    }

    if (!mobile) {
      portrait.addEventListener('mouseenter', openSpotlight);
      portrait.addEventListener('mousemove', (e) => {
        const rect = portrait.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
      });
      portrait.addEventListener('mouseleave', closeSpotlight);
    } else if (!reduceMotion) {
      // sem hover no touch: o spotlight varre o retrato sozinho, em loop espaçado,
      // pra revelação não passar batido em quem visita pelo celular
      const sweepPoints = [[32, 34], [68, 30], [50, 68]];
      let i = 0;
      const runSweep = () => {
        targetX = sweepPoints[i][0];
        targetY = sweepPoints[i][1];
        openSpotlight();
        gsap.delayedCall(1.6, closeSpotlight);
        i = (i + 1) % sweepPoints.length;
      };
      ScrollTrigger.create({
        trigger: portrait,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          runSweep();
          setInterval(runSweep, 5200);
        },
      });
    }
  }

  // --------------------------------------------
  // Configuração global do ScrollTrigger
  // --------------------------------------------
  ScrollTrigger.config({ ignoreMobileResize: true });
}
