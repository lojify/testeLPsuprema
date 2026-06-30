// particles.js — Three.js: partículas de poeira urbana no hero
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

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    speeds[i] = 0.0008 + Math.random() * 0.0015;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xcccccc,
    size: 0.022,
    transparent: true,
    opacity: 0.35,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let rafId;
  function animate() {
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      posAttr.array[i * 3 + 1] += speeds[i]; // deriva lenta para cima (poeira subindo)
      if (posAttr.array[i * 3 + 1] > 4) posAttr.array[i * 3 + 1] = -4;
    }
    posAttr.needsUpdate = true;
    points.rotation.y += 0.0003;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

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
