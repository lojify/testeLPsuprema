// cursor.js — Cursor customizado (seta CTA -> foguete)
import { state } from './env.js';

export function initCursor() {
  if (state.isMobile) return; // Desativado completamente em mobile

  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Usa transform: translate3d (GPU) em vez de top/left
  gsap.ticker.add(() => {
    gsap.set(cursor, { transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` });
  });

  document.querySelectorAll('[data-cta], .btn, button, a').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-cta'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-cta'));
  });
}
