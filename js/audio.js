// audio.js — Howler.js: trilha hip-hop lo-fi + efeitos urbanos contextuais
import { state } from './config.js';

let ambientTrack = null;
let cutSound = null;
let razorSound = null;
let isPlaying = false;

const toggleBtn = document.getElementById('audioToggle');

export function initAudio() {
  if (!window.Howl) return;

  ambientTrack = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'],
    loop: true,
    volume: 0.15,
    html5: true,
  });

  cutSound = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3'],
    volume: 0.2,
  });

  razorSound = new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/15/audio_942d1f4cba.mp3'],
    volume: 0.2,
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

  // Sons contextuais nos cards de serviço, desativados em mobile (evita travar áudio em touch)
  if (!state.isMobile) {
    document.querySelectorAll('[data-sound]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-sound');
        if (type === 'razor' && razorSound) razorSound.play();
        else if (cutSound) cutSound.play();
      });
    });
  }
}
