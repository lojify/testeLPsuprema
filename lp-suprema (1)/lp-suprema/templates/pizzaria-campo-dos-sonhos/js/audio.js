// js/audio.js
// Trilha ambiente + efeitos sonoros via Howler.js
// Áudio só inicia após interação do usuário (autoplay policy).

let bgMusic = null;
let sfx = {};
let isMuted = true;
let started = false;
let lastSfxPlay = {};

const SFX_DEBOUNCE_MS = 350;

export function initAudio() {
  if (typeof Howl === "undefined") return null;

  bgMusic = new Howl({
    src: ["https://cdn.pixabay.com/audio/2022/03/15/audio_1e2efb2dc4.mp3"],
    loop: true,
    volume: 0.0,
    html5: true,
  });

  sfx = {
    chiado: new Howl({
      src: ["https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3"],
      volume: 0.25,
    }),
    borbulhar: new Howl({
      src: ["https://cdn.pixabay.com/audio/2022/03/10/audio_c8e3578620.mp3"],
      volume: 0.2,
    }),
    taças: new Howl({
      src: ["https://cdn.pixabay.com/audio/2021/08/09/audio_88447e769f.mp3"],
      volume: 0.25,
    }),
  };

  const toggleBtn = document.getElementById("audio-toggle");

  function startOnFirstInteraction() {
    if (started) return;
    started = true;
    bgMusic.play();
    bgMusic.fade(0, 0.18, 1200);
    setMuted(false);
    window.removeEventListener("click", startOnFirstInteraction);
    window.removeEventListener("scroll", startOnFirstInteraction);
  }
  window.addEventListener("click", startOnFirstInteraction, { once: true });
  window.addEventListener("scroll", startOnFirstInteraction, { once: true });

  function setMuted(mute) {
    isMuted = mute;
    if (mute) {
      bgMusic.fade(bgMusic.volume(), 0, 400);
    } else {
      bgMusic.fade(bgMusic.volume(), 0.18, 400);
    }
    if (toggleBtn) toggleBtn.setAttribute("aria-pressed", String(!mute));
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (!started) {
        startOnFirstInteraction();
        return;
      }
      setMuted(!isMuted);
    });
  }

  return { setMuted };
}

export function playSfx(name) {
  if (!sfx[name] || isMuted) return;
  const now = Date.now();
  if (lastSfxPlay[name] && now - lastSfxPlay[name] < SFX_DEBOUNCE_MS) return;
  lastSfxPlay[name] = now;
  sfx[name].play();
}

export function bindSfxHovers() {
  document.querySelectorAll(".prato-card.is-quente").forEach((card) => {
    card.addEventListener("mouseenter", () => playSfx("chiado"));
  });
  document.querySelectorAll('[data-categoria="bebidas"]').forEach((card) => {
    card.addEventListener("mouseenter", () => playSfx("borbulhar"));
  });
  document.querySelectorAll(".depoimento-card").forEach((card) => {
    card.addEventListener("mouseenter", () => playSfx("taças"));
  });
}
