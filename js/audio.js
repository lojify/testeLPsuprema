// audio.js — Howler.js: música ambiente relaxante + água/sinos de vento discretos
import { state } from './config.js';

let ambientTrack = null;
let chimeSound = null;
let isPlaying = false;
const visitedSections = new Set();

const toggleBtn = document.getElementById('audioToggle');

export function initAudio() {
  if (!window.Howl) return;

  ambientTrack = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201f.mp3'],
    loop: true,
    volume: 0.12,
    html5: true,
  });

  chimeSound = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2021/10/15/audio_56cd87f9c6.mp3'],
    volume: 0.15,
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

  // Sino de vento discreto ao entrar em seções-chave (apenas uma vez por seção, apenas desktop)
  if (!state.isMobile && 'IntersectionObserver' in window) {
    const chimeSections = document.querySelectorAll('#tratamentos, #oferta');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isPlaying && !visitedSections.has(entry.target.id)) {
            visitedSections.add(entry.target.id);
            if (chimeSound) chimeSound.play();
          }
        });
      },
      { threshold: 0.4 }
    );
    chimeSections.forEach((s) => observer.observe(s));
  }
}
