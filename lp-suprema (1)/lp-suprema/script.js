/* =====================================================================
   UMBRAL — LP SUPREMA — script.js
   Vanilla JS + GSAP/ScrollTrigger + Lenis + Howler (fallback sintetizado)
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     1. ENV — detecção de mobile / reduced motion
     =================================================================== */
  const env = {
    isMobile: window.innerWidth < 768,
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotionQuery.addEventListener("change", (e) => {
    env.prefersReducedMotion = e.matches;
  });
  window.addEventListener("resize", () => {
    env.isMobile = window.innerWidth < 768;
  });

  /* ===================================================================
     2. LOADER
     =================================================================== */
  function initLoader() {
    const finish = () => {
      document.body.classList.remove("is-loading");
    };
    if (document.readyState === "complete") {
      setTimeout(finish, 400);
    } else {
      window.addEventListener("load", () => setTimeout(finish, 400));
    }
    // failsafe: nunca deixar o loader preso
    setTimeout(finish, 3500);
  }

  /* ===================================================================
     3. CURSOR CUSTOMIZADO (desktop apenas)
     =================================================================== */
  function initCursor() {
    if (env.isMobile || window.matchMedia("(hover: none)").matches) return;
    const cursor = document.getElementById("cursor");
    if (!cursor) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2, cx = x, cy = y;

    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

    function loop() {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverTargets = "a, button, .btn-quero-este, .quiz-option, iframe";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.remove("is-hover");
    });
  }

  /* ===================================================================
     4. LENIS + GSAP/ScrollTrigger — motor de scroll
     =================================================================== */
  let lenis = null;

  function initSmoothScroll() {
    gsap.registerPlugin(ScrollTrigger);

    if (!env.prefersReducedMotion && typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: env.isMobile ? 0.9 : 1.2,
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.defaults({ invalidateOnRefresh: true });
  }

  /* ===================================================================
     5. SCROLL PROGRESS BAR
     =================================================================== */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
    });
  }

  /* ===================================================================
     6. REVEALS GENÉRICOS — data-animate="rise" / "fade"
     =================================================================== */
  function initReveals() {
    const dur = env.isMobile ? 0.5 : 1;

    document.querySelectorAll('[data-animate="rise"]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: dur, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    document.querySelectorAll('[data-animate="fade"]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, duration: dur, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
  }

  /* ===================================================================
     7. HERO — partículas Three.js (com fallback CSS em mobile/reduced)
     =================================================================== */
  function initHeroParticles() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    if (env.isMobile || env.prefersReducedMotion || typeof THREE === "undefined") {
      canvas.style.display = "none";
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const COUNT = 700;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x8b6cff, size: 0.035, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let rafId;
    function animate() {
      points.rotation.y += 0.0006;
      points.rotation.x += 0.0002;
      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // pausa o loop quando o hero sai do viewport (performance)
    const heroSection = document.querySelector('[data-section="hero"]');
    if (heroSection && "IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { if (!rafId) animate(); }
          else { cancelAnimationFrame(rafId); rafId = null; }
        });
      }, { threshold: 0.05 }).observe(heroSection);
    }
  }

  /* ===================================================================
     8. HERO — anel-portal sutil (parallax leve) + scroll cue
     =================================================================== */
  function initHeroPortal() {
    const portal = document.getElementById("heroPortal");
    if (portal && !env.prefersReducedMotion) {
      gsap.to(portal, {
        rotate: 360, duration: env.isMobile ? 80 : 50, repeat: -1, ease: "none",
      });
    }
    const scrollCue = document.getElementById("scrollCue");
    if (scrollCue) {
      scrollCue.addEventListener("click", () => {
        const target = document.querySelector('[data-section="mergulho"]');
        if (target) {
          if (lenis) lenis.scrollTo(target);
          else target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  /* ===================================================================
     9. MERGULHO — zoom infinito / túnel (pinado)
     =================================================================== */
  function initMergulho() {
    const section = document.querySelector('[data-section="mergulho"]');
    const portal = document.getElementById("mergulhoPortal");
    const text = document.getElementById("mergulhoText");
    if (!section || !portal) return;

    if (env.prefersReducedMotion) {
      gsap.set(portal, { opacity: 0 });
      gsap.to(text, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: section, start: "top 60%" } });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: env.isMobile ? "+=120%" : "+=180%",
        scrub: 1,
        pin: true,
        pinType: "transform",
        invalidateOnRefresh: true,
      },
    });

    tl.to(text, { opacity: 1, duration: 0.15 }, 0)
      .to(text, { opacity: 0, duration: 0.15 }, 0.35)
      .to(portal, {
        scale: env.isMobile ? 140 : 220,
        duration: 1,
        ease: "power2.in",
      }, 0.2)
      .to(portal, { opacity: 0, duration: 0.1 }, 0.95);
  }

  /* ===================================================================
     10. DEMO SECTIONS — reveal + lazy-load real dos iframes
     =================================================================== */
  function initDemoSections() {
    const wrappers = document.querySelectorAll(".iframe-wrapper");

    wrappers.forEach((wrapper) => {
      // reveal de entrada ("sensação de entrar no template")
      gsap.to(wrapper, {
        opacity: 1, scale: 1, y: 0,
        duration: env.isMobile ? 0.6 : 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapper, start: "top 80%" },
      });
    });

    // lazy-load real: só seta src do iframe quando perto do viewport
    if ("IntersectionObserver" in window) {
      const loadObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const wrapper = entry.target;
          if (wrapper.dataset.pending === "true") { obs.unobserve(wrapper); return; }
          const src = wrapper.dataset.iframeSrc;
          const iframe = wrapper.querySelector("iframe");
          if (src && iframe && !iframe.src) {
            iframe.src = src;
            iframe.addEventListener("load", () => wrapper.classList.add("is-loaded"), { once: true });
          }
          obs.unobserve(wrapper);
        });
      }, { rootMargin: "300px 0px" });

      wrappers.forEach((w) => loadObserver.observe(w));
    } else {
      // fallback sem IntersectionObserver: carrega tudo de uma vez
      wrappers.forEach((w) => {
        const iframe = w.querySelector("iframe");
        if (w.dataset.iframeSrc && iframe) iframe.src = w.dataset.iframeSrc;
      });
    }

    // libera pointer-events do iframe só quando a seção está focada no centro da tela
    if ("IntersectionObserver" in window) {
      const focusObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-focused", entry.isIntersecting);
        });
      }, { threshold: 0.55 });
      document.querySelectorAll(".demo-section").forEach((s) => focusObserver.observe(s));
    }
  }

  /* ===================================================================
     11. ÁUDIO — Howler.js com fallback sintetizado (clique de UI)
     =================================================================== */
  const SYNTH_FALLBACK = true;
  let audioCtx = null;

  function playClickSfx() {
    if (env.prefersReducedMotion) return;
    if (SYNTH_FALLBACK) {
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(720, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.13);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.14);
      } catch (e) { /* silencioso: áudio é decorativo, nunca trava a UI */ }
    }
    /* Quando tiver assets/audio/click.mp3 reais, troque por:
       new Howl({ src: ["assets/audio/click.mp3"], volume: 0.5 }).play(); */
  }

  /* ===================================================================
     12. PRICING — dados + render
     =================================================================== */
  const PRICING_TIERS = [
    {
      tier: 1,
      nome: "Seu Site, Seu Jeito",
      subtitulo: "Pronto para Lançar",
      valor: "Receba o projeto completo com suas informações, logo e SEO básico já configurados. Liberdade total para personalizar!",
      preco: "R$ 197 – R$ 297",
      inclui: ["HTML/CSS/JS puros", "Personalização de logo, fotos e textos", "SEO básico (meta tags)", "Documentação simples"],
      publico: "Empreendedores com equipe técnica ou que gerenciam a própria hospedagem.",
      featured: false,
    },
    {
      tier: 2,
      nome: "Site Pronto para Usar",
      subtitulo: "Personalizado",
      valor: "Nós cuidamos de tudo! Seu logo, suas cores, seus textos. Entregamos o site pronto pra você colocar no ar.",
      preco: "R$ 497 – R$ 897",
      inclui: ["Template + alteração de cores, logo e textos", "Entrega dos arquivos prontos"],
      publico: "Pequenos negócios e profissionais liberais que buscam agilidade.",
      featured: false,
    },
    {
      tier: 3,
      nome: "Sua Marca no Próximo Nível",
      subtitulo: "Solução Completa",
      valor: "Transforme seu template em uma máquina de vendas, com copywriting, ajustes finos e hospedagem inclusa.",
      preco: "R$ 1.500 – R$ 3.500",
      inclui: ["Template + copywriting persuasivo", "Ajustes de layout", "Integração WhatsApp/CRM", "Hospedagem (1 ano)"],
      publico: "Negócios locais estabelecidos, profissionais buscando autoridade.",
      featured: true,
    },
    {
      tier: 4,
      nome: 'Projeto "Classe Mundial"',
      subtitulo: "Exclusivo e Inovador",
      valor: "Um site único, criado do zero pra sua visão. Design exclusivo e scrollytelling sob medida.",
      preco: "Sob consulta (a partir de R$ 5.000)",
      inclui: ["Mega Prompt exclusivo", "Design único", "Animações sob medida", "Scrollytelling personalizado"],
      publico: "Grandes marcas, lançamentos de alto impacto, empresas de luxo.",
      featured: false,
    },
  ];

  const UPSELLS = [
    {
      nome: "Domínio Próprio & Hospedagem",
      texto: "Tenha seu endereço exclusivo na web. Cuidamos do registro e da configuração pra você.",
      mensagem: "Quero saber mais sobre o upsell de Domínio Próprio & Hospedagem.",
    },
    {
      nome: "E-commerce / Agendamento Avançado",
      texto: "Transforme seu site em loja virtual completa ou sistema de agendamento online.",
      mensagem: "Quero saber mais sobre o upsell de E-commerce/Agendamento Avançado.",
    },
  ];

  const WHATSAPP_NUMBER = "5541999445977";

  function buildWhatsappUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function renderPricing() {
    const grid = document.getElementById("pricingGrid");
    const upsellsEl = document.getElementById("pricingUpsells");
    if (!grid || !upsellsEl) return;

    grid.innerHTML = PRICING_TIERS.map((t) => `
      <article class="pricing-card${t.featured ? " pricing-card--featured" : ""}" data-animate="rise">
        ${t.featured ? '<span class="pricing-card__badge">Mais Popular</span>' : ""}
        <p class="pricing-card__tier">TIER ${t.tier}</p>
        <h3 class="pricing-card__name">${t.nome}</h3>
        <p class="pricing-card__value">"${t.valor}"</p>
        <p class="pricing-card__price">${t.preco}</p>
        <ul class="pricing-card__includes">
          ${t.inclui.map((i) => `<li>— ${i}</li>`).join("")}
        </ul>
        <p class="pricing-card__audience">${t.publico}</p>
        <a class="btn btn--primary" data-cta="pricing-tier" data-tier="${t.tier}" target="_blank" rel="noopener"
           href="${buildWhatsappUrl(`Olá! Tenho interesse no Tier ${t.tier} — ${t.nome} (${t.preco}). Quero entender os próximos passos!`)}">
          Quero o Tier ${t.tier}
        </a>
      </article>
    `).join("");

    upsellsEl.innerHTML = UPSELLS.map((u) => `
      <div class="upsell-chip">
        <strong>${u.nome}</strong>
        <p>${u.texto}</p>
        <a data-cta="upsell" target="_blank" rel="noopener" href="${buildWhatsappUrl(u.mensagem)}">Falar sobre isso →</a>
      </div>
    `).join("");

    // re-observa os novos elementos data-animate="rise" recém-injetados
    document.querySelectorAll('.pricing-card[data-animate="rise"]').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    grid.querySelectorAll('[data-cta="pricing-tier"]').forEach((btn) => {
      btn.addEventListener("click", playClickSfx);
    });
  }

  /* ===================================================================
     13. QUIZ DE ELITE
     =================================================================== */
  const QUIZ_QUESTIONS = [
    {
      id: "objetivo",
      texto: "Qual o seu objetivo principal com este site?",
      opcoes: [
        { label: "Ter uma presença online incrível e profissional.", tier: 1 },
        { label: "Vender mais e atrair clientes com um site de alta conversão.", tier: 2 },
        { label: "Quero algo totalmente exclusivo, que destaque minha marca.", tier: 4 },
        { label: "Já tenho um desenvolvedor e só preciso do design pronto.", tier: 1 },
      ],
    },
    {
      id: "dominio",
      texto: "Você já tem um domínio próprio ou gostaria de ter um?",
      opcoes: [
        { label: "Já tenho meu domínio.", flag: null },
        { label: "Gostaria de ter um domínio próprio.", flag: "dominio" },
      ],
    },
    {
      id: "funcionalidades",
      texto: "Você precisa de loja virtual, carrinho de compras ou agendamento online?",
      opcoes: [
        { label: "Não, um site informativo é suficiente.", flag: null },
        { label: "Sim, preciso de funcionalidades avançadas.", flag: "ecommerce" },
      ],
    },
  ];

  const TIER_INFO = {
    1: { nome: "Seu Site, Seu Jeito (Tier 1)", preco: "R$ 197 – R$ 297" },
    2: { nome: "Site Pronto para Usar (Tier 2)", preco: "R$ 497 – R$ 897" },
    3: { nome: "Sua Marca no Próximo Nível (Tier 3)", preco: "R$ 1.500 – R$ 3.500" },
    4: { nome: 'Projeto "Classe Mundial" (Tier 4)', preco: "Sob consulta (a partir de R$ 5.000)" },
  };

  const quizState = {
    open: false,
    step: 0,
    tier: 1,
    upsells: { dominio: false, ecommerce: false },
    templateName: "Não especificado",
  };

  function resetQuizState(templateName) {
    quizState.step = 0;
    quizState.tier = 1;
    quizState.upsells = { dominio: false, ecommerce: false };
    quizState.templateName = templateName || "Não especificado";
  }

  function openQuiz(templateName) {
    resetQuizState(templateName);
    const overlay = document.getElementById("quizOverlay");
    document.getElementById("quizStepResult").hidden = true;
    document.getElementById("quizStepQuestion").hidden = false;
    document.getElementById("quizTemplateContext").textContent = `Sobre: ${quizState.templateName}`;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    renderQuizQuestion();
  }

  function closeQuiz() {
    const overlay = document.getElementById("quizOverlay");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function renderQuizQuestion() {
    const q = QUIZ_QUESTIONS[quizState.step];
    const progressBar = document.getElementById("quizProgressBar");
    progressBar.style.width = `${(quizState.step / QUIZ_QUESTIONS.length) * 100}%`;

    document.getElementById("quizQuestionText").textContent = q.texto;
    const optionsEl = document.getElementById("quizOptions");
    optionsEl.innerHTML = q.opcoes.map((op, i) => `
      <button class="quiz-option" type="button" data-index="${i}">${op.label}</button>
    `).join("");

    optionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        playClickSfx();
        const opcao = q.opcoes[Number(btn.dataset.index)];
        applyAnswer(q.id, opcao);
        advanceQuiz();
      });
    });
  }

  function applyAnswer(questionId, opcao) {
    if (questionId === "objetivo") {
      quizState.tier = opcao.tier;
    }
    if (questionId === "funcionalidades" && opcao.flag === "ecommerce") {
      quizState.upsells.ecommerce = true;
      if (quizState.tier === 1 || quizState.tier === 2) quizState.tier = 3;
    }
    if (questionId === "dominio" && opcao.flag === "dominio") {
      quizState.upsells.dominio = true;
    }
  }

  function advanceQuiz() {
    quizState.step += 1;
    if (quizState.step >= QUIZ_QUESTIONS.length) {
      showQuizResult();
    } else {
      renderQuizQuestion();
    }
  }

  function showQuizResult() {
    document.getElementById("quizProgressBar").style.width = "100%";
    document.getElementById("quizStepQuestion").hidden = true;
    const resultStep = document.getElementById("quizStepResult");
    resultStep.hidden = false;

    const info = TIER_INFO[quizState.tier];
    const body = document.getElementById("quizResultBody");
    body.innerHTML = `
      <div class="quiz-result__row"><strong>Modelo</strong><span>${quizState.templateName}</span></div>
      <div class="quiz-result__row"><strong>Nível recomendado</strong><span>${info.nome}</span></div>
      <div class="quiz-result__row"><strong>Faixa de investimento</strong><span>${info.preco}</span></div>
      ${quizState.upsells.dominio ? '<div class="quiz-result__row"><strong>Upsell</strong><span>Domínio próprio</span></div>' : ""}
      ${quizState.upsells.ecommerce ? '<div class="quiz-result__row"><strong>Upsell</strong><span>E-commerce/Agendamento</span></div>' : ""}
    `;

    const lines = [
      "Olá! Fiz o Quiz de Elite na LP e meu resultado foi:",
      `🎯 Modelo de interesse: ${quizState.templateName}`,
      `📦 Nível recomendado: ${info.nome}`,
      `💰 Faixa de investimento: ${info.preco}`,
    ];
    if (quizState.upsells.dominio) lines.push("➕ Também tenho interesse em domínio próprio.");
    if (quizState.upsells.ecommerce) lines.push("➕ Também preciso de e-commerce/agendamento online.");
    lines.push("", "Quero entender os próximos passos!");

    document.getElementById("quizWhatsappBtn").href = buildWhatsappUrl(lines.join("\n"));
  }

  function initQuiz() {
    document.querySelectorAll(".btn-quero-este").forEach((btn) => {
      btn.addEventListener("click", () => {
        playClickSfx();
        openQuiz(btn.dataset.templateName);
      });
    });
    document.getElementById("quizClose").addEventListener("click", closeQuiz);
    document.getElementById("quizOverlay").addEventListener("click", (e) => {
      if (e.target.id === "quizOverlay") closeQuiz();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeQuiz();
    });
  }

  /* ===================================================================
     INIT GERAL
     =================================================================== */
  function init() {
    initLoader();
    initCursor();
    initSmoothScroll();
    initScrollProgress();
    initReveals();
    initHeroParticles();
    initHeroPortal();
    initMergulho();
    initDemoSections();
    renderPricing();
    initQuiz();

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
