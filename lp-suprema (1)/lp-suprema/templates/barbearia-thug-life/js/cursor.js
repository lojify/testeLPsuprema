// cursor.js — Cursor customizado: navalha estilizada, troca para spray sobre botões com efeito spray
import { state } from './config.js';

const cursor = document.getElementById('cursorIcon');
const isTouch = matchMedia('(pointer: coarse)').matches;

if (state.isMobile || state.prefersReducedMotion || isTouch || !cursor) {
  document.body.classList.add('cursor-disabled');
} else {
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let lastX = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.remove('cursor-hidden');
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });

  function animateCursor() {
    const dx = mouseX - curX;
    curX += dx * 0.5;
    curY += (mouseY - curY) * 0.5;

    // leve rotação baseada na direção do movimento (apenas transform)
    const rotation = Math.max(-25, Math.min(25, dx * 1.5));

    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) rotate(${rotation}deg)`;
    lastX = mouseX;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Troca para ícone de spray sobre elementos com efeito spray
  document.querySelectorAll('[data-spray]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-spray'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-spray'));
  });

  // Atualiza a posição do "spray" (variáveis CSS) relativa a cada botão no hover
  document.querySelectorAll('[data-spray]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--spray-x', `${x}%`);
      el.style.setProperty('--spray-y', `${y}%`);
    });
  });
}
