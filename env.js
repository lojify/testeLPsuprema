// env.js — Detecção de ambiente (mobile / reduced motion)

export const state = {
  isMobile: window.innerWidth < 768,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', (e) => {
  state.prefersReducedMotion = e.matches;
  window.dispatchEvent(new CustomEvent('env:change', { detail: { ...state } }));
});

window.addEventListener('resize', () => {
  const wasMobile = state.isMobile;
  state.isMobile = window.innerWidth < 768;
  if (wasMobile !== state.isMobile) {
    window.dispatchEvent(new CustomEvent('env:change', { detail: { ...state } }));
  }
});
