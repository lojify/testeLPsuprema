// ui.js — Acordeão de FAQ, barra de escassez e progresso de scroll

export function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    gsap.set(panel, { height: 0 });

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.accordion-trigger').forEach((t) => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          gsap.to(t.nextElementSibling, { height: 0, duration: 0.3, ease: 'power2.out' });
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      gsap.to(panel, {
        height: isOpen ? 0 : panel.scrollHeight,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  });
}

export function initScarcityBar() {
  const fill = document.querySelector('[data-scarcity-fill]');
  if (fill) {
    const percent = Number(fill.dataset.percent || 0);
    ScrollTrigger.create({
      trigger: fill,
      start: 'top 85%',
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.to(fill, { scaleX: percent / 100, duration: 1, ease: 'power3.out' });
      },
    });
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
  }
}

export function initScrollProgress() {
  const bar = document.querySelector('[data-scroll-progress]');
  if (!bar) return;

  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      gsap.set(bar, { scaleX: self.progress });
    },
  });
}
