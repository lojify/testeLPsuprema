// lenis-init.js — Inicialização do Lenis Scroll integrado ao GSAP/ScrollTrigger
import { state } from './env.js';

export function initLenis() {
  if (state.prefersReducedMotion) {
    // Não instancia Lenis: mantém o scroll nativo do navegador.
    return null;
  }

  const lenis = new Lenis({
    duration: state.isMobile ? 0.8 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // Evita "smooth" pesado em touch, preserva fluidez nativa no mobile
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
