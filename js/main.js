// main.js — Orquestra a inicialização de todos os módulos.
// A ordem importa: config (detecção) sempre primeiro, depois scroll, depois animações.
import { initScroll } from './scroll.js';
import { initAnimations } from './animations.js';
import { initAudio } from './audio.js';
import { initParticles } from './particles.js';

function bootstrap() {
  initScroll();
  initAnimations();
  initAudio();
  initParticles();

  // Garante que o ScrollTrigger recalcule depois de fontes/imagens carregarem
  window.addEventListener('load', () => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
}

// GSAP/ScrollTrigger/Howler/Three vêm de scripts com defer no <head>/antes do main.js;
// como main.js também é defer e carregado depois deles no HTML, a ordem de execução é garantida.
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
