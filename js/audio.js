// audio.js — Howler.js: trilha ambiente + clique discreto
import { state } from './config.js';

let ambientTrack = null;
let clickSound = null;
let isPlaying = false;

const toggleBtn = document.getElementById('audioToggle');

export function initAudio() {
  if (!window.Howl) return;

  ambientTrack = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/10/audio_d1718ab41b.mp3'],
    loop: true,
    volume: 0.15,
    html5: true,
  });

  clickSound = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/15/audio_942d1f4cba.mp3'],
    volume: 0.25,
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        ambientTrack.pause();
        toggleBtn.setAttribute('aria-pressed', 'false');
      } else {
        ambientTrack.play();
        toggleBtn.setAttribute('aria-pressed', 'true');
      }
      isPlaying = !isPlaying;
    });
  }

  // Som de clique discreto em CTAs — não dispara em mobile para evitar travamento de áudio
  if (!state.isMobile) {
    document.querySelectorAll('.btn, .btn-whatsapp, .nav__cta').forEach((el) => {
      el.addEventListener('click', () => {
        if (clickSound) clickSound.play();
      });
    });
  }
}
