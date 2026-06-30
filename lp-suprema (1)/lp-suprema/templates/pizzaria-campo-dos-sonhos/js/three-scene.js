// js/three-scene.js
// Cena Three.js do "Prato em Destaque": disco estilizado de pizza com
// auto-rotate + leve resposta ao mouse. Pausa via IntersectionObserver.
// Só é chamado em desktop + sem prefers-reduced-motion (ver main.js).

export function initThreeScene() {
  const canvas = document.getElementById("three-canvas");
  const fallback = document.getElementById("prato-fallback");
  const wrap = document.querySelector(".prato-canvas-wrap");
  if (!canvas || !wrap || typeof THREE === "undefined") return;

  let renderer, scene, camera, pizzaGroup;
  let rafId = null;
  let isVisible = false;
  let mouseX = 0;
  let mouseY = 0;

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 0.1, 50);
    camera.position.set(0, 2.6, 5.2);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    // Luz quente ambiente, simulando iluminação de restaurante
    const ambient = new THREE.AmbientLight(0xffd9a0, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xffb347, 1.6, 12);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xc9a227, 0.8, 10);
    rimLight.position.set(-3, 1.5, -2);
    scene.add(rimLight);

    pizzaGroup = new THREE.Group();

    // Base da pizza (disco de massa)
    const baseGeo = new THREE.CylinderGeometry(2, 2.05, 0.18, 48);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xd9a85c, roughness: 0.8, metalness: 0.05 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    pizzaGroup.add(base);

    // Camada de molho/queijo
    const topGeo = new THREE.CylinderGeometry(1.78, 1.78, 0.05, 48);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xe6b860, roughness: 0.55, metalness: 0.05 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.12;
    pizzaGroup.add(top);

    // Borda dourada
    const edgeGeo = new THREE.TorusGeometry(2, 0.16, 16, 48);
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xc9893b, roughness: 0.6 });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0.02;
    pizzaGroup.add(edge);

    // "Manjericão" — pequenas esferas verdes espalhadas
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x1f3326, roughness: 0.7 });
    for (let i = 0; i < 14; i++) {
      const r = 0.5 + Math.random() * 1.1;
      const angle = Math.random() * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), leafMat);
      leaf.position.set(Math.cos(angle) * r, 0.18, Math.sin(angle) * r);
      leaf.scale.set(1, 0.4, 1.4);
      pizzaGroup.add(leaf);
    }

    // "Queijo" — esferas creme menores
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xf5eee0, roughness: 0.4 });
    for (let i = 0; i < 18; i++) {
      const r = 0.3 + Math.random() * 1.3;
      const angle = Math.random() * Math.PI * 2;
      const blob = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), cheeseMat);
      blob.position.set(Math.cos(angle) * r, 0.16, Math.sin(angle) * r);
      blob.scale.set(1, 0.3, 1);
      pizzaGroup.add(blob);
    }

    pizzaGroup.rotation.x = -0.15;
    scene.add(pizzaGroup);

    window.addEventListener("resize", onResize);
    wrap.addEventListener("mousemove", onMouseMove);
  }

  function onResize() {
    if (!renderer || !camera) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function onMouseMove(e) {
    const rect = wrap.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  function animate() {
    if (!isVisible) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(animate);

    pizzaGroup.rotation.y += 0.0028;
    pizzaGroup.rotation.y += (mouseX * 0.25 - (pizzaGroup.rotation.y % (Math.PI * 2)) * 0) * 0.002;
    pizzaGroup.rotation.x += ((-0.15 + mouseY * 0.15) - pizzaGroup.rotation.x) * 0.04;

    renderer.render(scene, camera);
  }

  function start() {
    if (!renderer) {
      init();
    }
    if (!rafId) {
      isVisible = true;
      animate();
    }
  }

  function stop() {
    isVisible = false;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(wrap);
}
