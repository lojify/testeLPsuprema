// main.js — Ponto de entrada: orquestra todos os módulos
import { state } from './env.js';
import { initLenis } from './lenis-init.js';
import { initCountdowns } from './countdown.js';
import { initCursor } from './cursor.js';
import { initAudio } from './audio.js';
import { initLazyMedia } from './lazy-load.js';
import { initAccordion, initScarcityBar, initScrollProgress } from './ui.js';
import { initScrollAnimations } from './gsap-animations.js';

function boot() {
  // GSAP e ScrollTrigger são carregados via <script defer> no HTML (escopo global)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLenis();
  initCountdowns();
  initLazyMedia();
  initAccordion();
  initScarcityBar();
  initScrollProgress();
  initScrollAnimations();

  if (!state.isMobile) {
    initCursor();
  }

  // Áudio só inicializa interações após o primeiro toque do usuário (autoplay policy)
  initAudio();

  // Reage a mudanças de ambiente (ex: rotação de tela cruzando o breakpoint mobile)
  window.addEventListener('env:change', () => {
    ScrollTrigger.refresh();
  });
}

// Espera os scripts defer (GSAP, ScrollTrigger, Lenis, Howler) estarem prontos
window.addEventListener('DOMContentLoaded', () => {
  // Pequeno polling para garantir que os scripts defer externos já carregaram
  const tryBoot = () => {
    if (window.gsap && window.ScrollTrigger && window.Lenis && window.Howl) {
      boot();
    } else {
      requestAnimationFrame(tryBoot);
    }
  };
  tryBoot();
});
