// main.js — Orquestra a inicialização de todos os módulos.
// Ordem importa: config (detecção) sempre primeiro, depois scroll, depois animações.
import { initScroll } from './scroll.js';
import { initAnimations } from './animations.js';
import { initAudio } from './audio.js';
import { initParticles } from './particles.js';

function bootstrap() {
  initScroll();
  initAnimations();
  initAudio();
  initParticles();

  window.addEventListener('load', () => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
