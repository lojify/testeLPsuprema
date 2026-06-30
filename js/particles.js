// particles.js — Three.js: partículas sutis de fundo no hero
import { state } from './config.js';

export function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || state.isMobile || state.prefersReducedMotion || !window.THREE) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particleCount = 220;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xc9a86a,
    size: 0.025,
    transparent: true,
    opacity: 0.55,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let rafId;
  function animate() {
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Pausa o render quando o hero sai da viewport (economiza GPU)
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!rafId) animate();
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }
}
