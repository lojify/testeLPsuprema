// cursor.js — Cursor customizado: ponto de luz sutil, vira "folha dourada" sobre elementos clicáveis
import { state } from './config.js';

const glow = document.getElementById('cursorGlow');
const leaf = document.getElementById('cursorLeaf');
const isTouch = matchMedia('(pointer: coarse)').matches;

if (state.isMobile || state.prefersReducedMotion || isTouch || !glow || !leaf) {
  document.body.classList.add('cursor-disabled');
} else {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let leafX = 0, leafY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.remove('cursor-hidden');
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });

  // Lerp suave — movimento "lento" condizente com a identidade calma da marca
  function animateCursor() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    leafX += (mouseX - leafX) * 0.14;
    leafY += (mouseY - leafY) * 0.14;

    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    leaf.style.transform = `translate(${leafX}px, ${leafY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  document.querySelectorAll('a, button, [data-cursor-leaf], input, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      leaf.classList.add('is-active');
      glow.classList.add('is-hidden-by-leaf');
    });
    el.addEventListener('mouseleave', () => {
      leaf.classList.remove('is-active');
      glow.classList.remove('is-hidden-by-leaf');
    });
  });
}
