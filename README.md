# Campo dos Sonhos — Template Cinematográfico

Projeto pronto para deploy, gerado a partir do MEGA PROMPT (gastronomia de elite).

## Estrutura

```
index.html
style.css
js/
  main.js          → orquestrador: detecta isMobile/prefersReducedMotion e inicializa os módulos
  scroll.js         → Lenis + GSAP ScrollTrigger (header, reveals, transição de fumaça, carrossel)
  cursor.js         → cursor customizado (faca / folha / luz) — desktop + motion completo
  audio.js          → Howler.js: trilha ambiente + efeitos sonoros, com mute persistente
  three-scene.js    → cena 3D do prato em destaque (carregado via import() dinâmico, só em desktop)
  menu-filter.js    → filtro do cardápio sem reload, com transições opacity/transform
  reserva-form.js   → validação e feedback do formulário de reservas (sem reload de página)
```

## Como usar

Abra `index.html` em um navegador (ou sirva via qualquer servidor estático —
recomendado para evitar bloqueios de CORS/module em `file://` em alguns navegadores).

```bash
# opção rápida com Python
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

## Decisões técnicas

- **Three.js** só é carregado dinamicamente (`import()`) em desktop sem
  `prefers-reduced-motion`. Em mobile/reduced motion, o body recebe a classe
  `modo-fallback-3d`, que o CSS já usa para esconder o canvas e mostrar a
  imagem estática do prato (`#prato-fallback`).
- **Cursor customizado** segue a mesma regra: desativado em mobile/reduced
  motion via checagem no próprio `cursor.js`.
- **Áudio** nunca inicia sozinho — dispara no primeiro clique/scroll, com
  fade suave e botão mute/unmute persistente no header.
- **Animações** usam apenas `transform`/`opacity` (GSAP), com
  `invalidateOnRefresh: true` em todos os ScrollTriggers.
- **Formulário de reservas** funciona com graceful degradation: a validação
  HTML nativa (`required`, `type="date"`, etc.) garante uso básico mesmo se o
  JS falhar ao carregar; o `reserva-form.js` adiciona validação refinada e
  feedback visual sem reload.
- **Filtro do cardápio** tem fallback sem GSAP via classe CSS `.filtro-oculto`
  (já definida em `style.css`), caso o GSAP não carregue.
- Os links de mídia (vídeos/imagens) usados são placeholders de bancos
  públicos (Unsplash/Coverr) — troque pelos ativos reais do cliente antes do
  lançamento, idealmente convertendo para WebP/AVIF e MP4/WebM otimizados
  conforme as diretrizes do Mega Prompt.

## Próximos passos sugeridos para produção

1. Substituir vídeos/imagens de placeholder pelos ativos finais do cliente.
2. Conectar o formulário de reservas a um backend real (atualmente simula
   envio com `setTimeout`).
3. Hospedar os áudios (trilha + efeitos) em CDN própria, já que os links
   atuais são de demonstração.
4. Rodar Lighthouse/PageSpeed para validar performance final e ajustar
   tamanhos de vídeo/imagem conforme necessário.
