// particles.js — Canvas 2D leve: partículas de brilho dourado/branco com opacidade pulsante
import { state } from './config.js';

export function initParticles() {
  const canvas = document.getElementById('glowCanvas');
  if (!canvas || state.isMobile || state.prefersReducedMotion) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height, particles, rafId;
  const PARTICLE_COUNT = 36;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: 0.8 + Math.random() * 1.8,
      speed: 0.12 + Math.random() * 0.25,
      baseOpacity: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? '185,152,106' : '255,255,255',
    };
  }

  particles = Array.from({ length: PARTICLE_COUNT }, createParticle);

  let time = 0;
  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speed; // deriva lenta ascendente
      if (p.y < -20) {
        Object.assign(p, createParticle());
        p.y = height + 20;
      }
      const pulsedOpacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(time * 1.2 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${pulsedOpacity})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(animate);
  }
  animate();

  // Pausa quando a aba não está visível, economizando recursos
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });
}
