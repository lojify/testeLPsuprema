// cursor.js — Cursor customizado "ponto de foco" com lerp/easing
import { state } from './config.js';

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

// Desativa completamente em mobile/touch ou reduced motion
const isTouch = matchMedia('(pointer: coarse)').matches;

if (state.isMobile || state.prefersReducedMotion || isTouch || !dot || !ring) {
  document.body.classList.add('cursor-disabled');
} else {
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.remove('cursor-hidden');
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });

  // Lerp manual via rAF — apenas transform, sem layout thrashing
  function animateCursor() {
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Estado "ativo" em elementos clicáveis
  const interactiveSelectors = 'a, button, [data-magnetic], input, textarea';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });

  // Efeito magnético sutil em CTAs (apenas transform)
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) * 0.18;
      const relY = (e.clientY - rect.top - rect.height / 2) * 0.18;
      el.style.transform = `translate(${relX}px, ${relY}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}
