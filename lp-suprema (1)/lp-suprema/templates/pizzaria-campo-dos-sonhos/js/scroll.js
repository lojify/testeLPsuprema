// js/scroll.js
// Lenis smooth scroll + GSAP ScrollTrigger: header state, reveals,
// smoke transition, parallax leve e carrossel de depoimentos.

export function initScrollEngine({ isMobile, prefersReducedMotion }) {
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger) return null;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  let lenis = null;

  if (Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.15,
      smoothWheel: true,
      smoothTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.defaults({ invalidateOnRefresh: true });

  return { lenis };
}

export function initHeaderState() {
  const header = document.getElementById("site-header");
  if (!header || !window.ScrollTrigger) return;

  window.ScrollTrigger.create({
    start: 80,
    end: 99999,
    onUpdate: (self) => {
      header.classList.toggle("scrolled", self.scroll() > 80);
    },
  });
}

export function initScrollIndicator() {
  const btn = document.getElementById("scroll-indicator");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = document.getElementById("smoke-transition") || document.getElementById("historia");
    if (next) {
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(next, { duration: 1.2 });
      } else {
        next.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

export function initReveals({ isMobile, prefersReducedMotion }) {
  const { gsap, ScrollTrigger } = window;
  if (!gsap) return;

  const dur = prefersReducedMotion ? 0.01 : isMobile ? 0.6 : 1.1;

  // Hero entrance (sem scroll, dispara no load)
  gsap.set("[data-reveal]", { opacity: 0, y: prefersReducedMotion ? 0 : 24, willChange: "transform, opacity" });
  gsap.to("[data-reveal]", {
    opacity: 1,
    y: 0,
    duration: dur,
    stagger: prefersReducedMotion ? 0 : 0.12,
    ease: "power3.out",
    delay: 0.2,
    onComplete: () => gsap.set("[data-reveal]", { willChange: "auto" }),
  });

  if (!ScrollTrigger) return;

  // Reveal genérico para títulos de seção e textos
  document.querySelectorAll(".section-eyebrow, .section-title, .historia-paragraph, .prato-paragraph").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
      {
        opacity: 1,
        y: 0,
        duration: dur,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", invalidateOnRefresh: true },
      }
    );
  });

  // Reveal das imagens de história (clip-path via transform/opacity)
  document.querySelectorAll(".reveal-img").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: prefersReducedMotion ? 0 : 36, scale: prefersReducedMotion ? 1 : 1.04 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: dur * 1.1,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", invalidateOnRefresh: true },
      }
    );
  });

  // Cards do cardápio
  gsap.utils.toArray(".prato-card").forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
      {
        opacity: 1,
        y: 0,
        duration: dur,
        delay: (i % 4) * 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 92%", invalidateOnRefresh: true },
      }
    );
  });

  // Itens da galeria
  gsap.utils.toArray(".galeria-item").forEach((item, i) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
      {
        opacity: 1,
        y: 0,
        duration: dur,
        delay: i * 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 90%", invalidateOnRefresh: true },
      }
    );
  });

  // Bloco de reservas e contato
  ["#reserva-form", ".contato-mapa", ".contato-info"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
      {
        opacity: 1,
        y: 0,
        duration: dur,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", invalidateOnRefresh: true },
      }
    );
  });
}

export function initSmokeTransition({ isMobile, prefersReducedMotion }) {
  const section = document.getElementById("smoke-transition");
  const canvas = document.getElementById("smoke-canvas");
  if (!section || !canvas) return;

  // Em mobile / reduced motion usamos só a imagem de fallback com fade simples via CSS.
  if (isMobile || prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
    document.body.classList.add("no-canvas");
    return;
  }

  const ctx = canvas.getContext("2d");
  let w, h;
  const particles = [];
  const COUNT = 26;

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1,
      y: 0.4 + Math.random() * 0.6,
      r: 60 + Math.random() * 120,
      speed: 0.2 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.3,
    });
  }

  function draw(progress) {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      const localProgress = Math.min(1, Math.max(0, progress * 1.4 - i * 0.01));
      const px = (p.x + p.drift * localProgress) * w;
      const py = p.y * h - localProgress * h * p.speed;
      const radius = p.r * (0.6 + localProgress * 0.8);
      const alpha = Math.sin(Math.PI * localProgress) * 0.35;

      const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
      gradient.addColorStop(0, `rgba(245,238,224,${alpha})`);
      gradient.addColorStop(1, "rgba(245,238,224,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const tween = { progress: 0 };
  window.ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      tween.progress = self.progress;
      draw(self.progress);
    },
  });

  draw(0);
}

export function initDepoimentosCarrossel() {
  const track = document.getElementById("depoimento-track");
  const prevBtn = document.getElementById("depo-prev");
  const nextBtn = document.getElementById("depo-next");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  let index = 0;

  function getStep() {
    const card = cards[0];
    if (!card) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap || style.columnGap || "0") || 0;
    return card.offsetWidth + gap;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    const step = getStep();
    const x = -index * step;
    if (window.gsap) {
      window.gsap.to(track, { x, duration: 0.65, ease: "power3.out" });
    } else {
      track.style.transform = `translateX(${x}px)`;
    }
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  window.addEventListener("resize", () => goTo(index));
}

export function initFooterYear() {
  const el = document.getElementById("ano-atual");
  if (el) el.textContent = new Date().getFullYear();
}
