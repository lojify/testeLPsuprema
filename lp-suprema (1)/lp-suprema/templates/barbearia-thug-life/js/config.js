// config.js — Detecção de ambiente, deve rodar ANTES de qualquer animação ser instanciada

export const isMobile = window.innerWidth < 768;
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.body.classList.remove('no-js');
if (isMobile) document.body.classList.add('is-mobile');
if (prefersReducedMotion) document.body.classList.add('reduced-motion');

export const state = { isMobile, prefersReducedMotion };

window.addEventListener('resize', () => {
  state.isMobile = window.innerWidth < 768;
  document.body.classList.toggle('is-mobile', state.isMobile);
});
