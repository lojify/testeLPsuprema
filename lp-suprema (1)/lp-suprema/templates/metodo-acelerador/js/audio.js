// audio.js — Howler.js: trilha de fundo, clique e sucesso
import { state } from './env.js';

let bgMusic, clickSound, successSound;
let hasInteracted = false;
let isMuted = true;

function buildSounds() {
  bgMusic = new Howl({
    src: ['assets/audio/bg-loop.mp3'],
    loop: true,
    volume: 0.35,
  });
  clickSound = new Howl({ src: ['assets/audio/click.mp3'], volume: 0.6 });
  successSound = new Howl({ src: ['assets/audio/success.mp3'], volume: 0.8 });
}

export function initAudio() {
  buildSounds();

  const toggle = document.querySelector('[data-audio-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      isMuted = !isMuted;
      toggle.setAttribute('aria-pressed', String(!isMuted));
      if (!isMuted) {
        // Primeira interação do usuário: respeita autoplay policy do navegador
        hasInteracted = true;
        bgMusic.play();
      } else {
        bgMusic.pause();
      }
    });
  }

  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      if (!state.prefersReducedMotion) clickSound.play();
    });
  });

  const form = document.querySelector('form[data-signup-form]');
  if (form) {
    form.addEventListener('submit', () => {
      if (!state.prefersReducedMotion) successSound.play();
    });
  }
}
