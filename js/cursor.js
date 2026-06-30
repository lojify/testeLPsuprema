// js/cursor.js
// Cursor customizado: faca de chef / folha de manjericão / luz âmbar
// Desativado em mobile e prefers-reduced-motion.

export function initCursor({ isMobile, prefersReducedMotion }) {
  if (isMobile || prefersReducedMotion) return;

  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  document.body.classList.add("cursor-ativo");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    // leve suavização (lerp) sem reflow — apenas transform
    curX += (mouseX - curX) * 0.35;
    curY += (mouseY - curY) * 0.35;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // troca de estado via data-cursor
  const estados = ["faca", "folha", "luz"];

  function setEstado(estado) {
    estados.forEach((e) => cursor.classList.remove(`estado-${e}`));
    cursor.classList.add(`estado-${estado}`);
  }

  setEstado("luz");

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => setEstado(el.dataset.cursor));
    el.addEventListener("mouseleave", () => setEstado("luz"));
  });

  // pratos / imagens usam a faca por padrão
  document.querySelectorAll(".prato-card-img, .historia-media img, .prato-canvas-wrap").forEach((el) => {
    el.addEventListener("mouseenter", () => setEstado("faca"));
    el.addEventListener("mouseleave", () => setEstado("luz"));
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });
}
