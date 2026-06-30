// scroll.js — Lenis Scroll integrado ao GSAP ticker
import { state } from './config.js';

export let lenis = null;

export function initScroll() {
  if (state.prefersReducedMotion) return null;

  lenis = new Lenis({
    duration: state.isMobile ? 0.8 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  }

  return lenis;
}
