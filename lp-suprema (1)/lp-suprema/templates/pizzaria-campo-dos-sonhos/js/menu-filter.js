// js/menu-filter.js
// Filtragem do cardápio sem reload, com animação de entrada/saída
// (opacity + transform). Funciona mesmo sem GSAP (fallback CSS).

export function initMenuFilter() {
  const grid = document.getElementById("cardapio-grid");
  const buttons = document.querySelectorAll(".filtro-btn");
  if (!grid || !buttons.length) return;

  const cards = Array.from(grid.querySelectorAll(".prato-card"));
  const gsap = window.gsap;

  function applyFilter(categoria) {
    const toHide = [];
    const toShow = [];

    cards.forEach((card) => {
      const matches = categoria === "todos" || card.dataset.categoria === categoria;
      if (matches) {
        toShow.push(card);
      } else {
        toHide.push(card);
      }
    });

    if (gsap) {
      if (toHide.length) {
        gsap.to(toHide, {
          opacity: 0,
          y: 12,
          scale: 0.97,
          duration: 0.28,
          ease: "power2.in",
          stagger: 0.02,
          onComplete: () => {
            toHide.forEach((card) => {
              card.style.display = "none";
            });
          },
        });
      }

      toShow.forEach((card) => {
        card.style.display = "";
      });

      gsap.fromTo(
        toShow,
        { opacity: 0, y: 14, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.04,
          delay: toHide.length ? 0.16 : 0,
        }
      );
    } else {
      // Fallback sem GSAP: apenas classes CSS
      toHide.forEach((card) => card.classList.add("filtro-oculto"));
      toShow.forEach((card) => card.classList.remove("filtro-oculto"));
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      applyFilter(btn.dataset.filtro);
    });
  });
}
