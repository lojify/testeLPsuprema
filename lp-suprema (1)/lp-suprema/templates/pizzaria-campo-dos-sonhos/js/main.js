// js/main.js
// Ponto de entrada: detecta isMobile/prefersReducedMotion e carrega
// somente os módulos adequados. Three.js e cursor customizado só em
// desktop + sem reduced motion (conforme diretrizes do projeto).

import { initCursor } from "./cursor.js";
import { initAudio, bindSfxHovers } from "./audio.js";
import {
  initScrollEngine,
  initHeaderState,
  initScrollIndicator,
  initReveals,
  initSmokeTransition,
  initDepoimentosCarrossel,
  initFooterYear,
} from "./scroll.js";
import { initMenuFilter } from "./menu-filter.js";
import { initReservaForm } from "./reserva-form.js";

function boot() {
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Controla via CSS qual versão do prato (Three.js vs imagem) é exibida.
  if (isMobile || prefersReducedMotion) {
    document.body.classList.add("modo-fallback-3d");
  }

  // -------- Sempre ativos (graceful degradation) --------
  initFooterYear();
  initMenuFilter();
  initReservaForm();

  // -------- Áudio (Howler) --------
  const audioApi = initAudio();
  bindSfxHovers();
  if (audioApi) window.audioApi = audioApi;

  // -------- Scroll engine (Lenis + GSAP ScrollTrigger) --------
  const engine = initScrollEngine({ isMobile, prefersReducedMotion });
  if (engine && engine.lenis) window.lenisInstance = engine.lenis;

  initHeaderState();
  initScrollIndicator();
  initReveals({ isMobile, prefersReducedMotion });
  initSmokeTransition({ isMobile, prefersReducedMotion });
  initDepoimentosCarrossel();

  // -------- Cursor customizado (desktop + motion completo apenas) --------
  initCursor({ isMobile, prefersReducedMotion });

  // -------- Three.js (desktop + motion completo apenas) --------
  if (!isMobile && !prefersReducedMotion) {
    import("./three-scene.js")
      .then(({ initThreeScene }) => initThreeScene())
      .catch((err) => {
        console.warn("Three.js não pôde ser carregado, usando fallback estático.", err);
        document.body.classList.add("modo-fallback-3d");
      });
  }

  // Refresh do ScrollTrigger após fontes/imagens carregarem, evitando
  // medições incorretas de pin/scrub.
  window.addEventListener("load", () => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
