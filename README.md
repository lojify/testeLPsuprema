# Template "O Gerente/Autoridade" — Corporativo Dark Mode

Template standalone, sem build step, pronto para zipar e entregar ao cliente.

## Como usar
Basta abrir `index.html` em um navegador, ou subir os arquivos para qualquer hospedagem estática (Netlify, etc). Todas as bibliotecas (GSAP, ScrollTrigger, Lenis, Howler, Three.js) são carregadas via CDN — não há instalação nem build.

## Estrutura de arquivos
```
index.html
style.css
js/
  config.js       → detecção de mobile e prefers-reduced-motion (roda primeiro, sempre)
  cursor.js       → cursor customizado "ponto de foco"
  scroll.js       → Lenis Scroll integrado ao GSAP
  animations.js   → todos os ScrollTrigger: reveals, parallax, contadores, timeline, máscara de revelação
  audio.js        → Howler.js (trilha ambiente + clique)
  particles.js    → Three.js (partículas do hero, desativado em mobile/reduced-motion)
  main.js         → orquestra a ordem de inicialização de tudo acima
```

## O que customizar para cada cliente
1. **Textos e nome**: trocar "Marcus Veron" e toda a copy nas seções do `index.html`.
2. **Fotos**: substituir as URLs do Unsplash por imagens reais do cliente, idealmente já em WebP/AVIF e hospedadas no domínio final (atualmente usa URLs externas só para demonstração).
3. **Preço de entrada**: campo `R$ 99,90` já vem fixo na seção `#oferta`, classe `.plano-card--entrada`. Os demais planos estão como "Solicitar orçamento" propositalmente.
4. **WhatsApp**: o botão `.btn-whatsapp` tem `href="#"` — trocar pelo link real `https://wa.me/55XXXXXXXXXXX` quando definido.
5. **Trilha sonora e som de clique**: os arquivos de áudio em `audio.js` são placeholders livres do Pixabay — troque por trilhas licenciadas/próprias antes da entrega final ao cliente.
6. **Cores**: tudo é controlado pelas variáveis CSS no topo do `style.css` (`:root`), incluindo a paleta dourado/navy/charcoal.

## Garantias de performance já implementadas
- Todas as animações usam exclusivamente `transform`/`opacity` (regra de ouro GPU)
- `will-change` aplicado nos elementos animados
- Detecção de `isMobile` e `prefers-reduced-motion` desativando/simplificando efeitos pesados
- `ScrollTrigger` com `invalidateOnRefresh: true` em todas as instâncias
- `loading="lazy"` em imagens fora do viewport inicial; hero com `loading="eager"`
- Fontes com preload + `font-display: swap`
- Cursor customizado e partículas Three.js desativados automaticamente em mobile/touch

## Antes de entregar ao cliente final
- Comprimir/converter as imagens reais para WebP ou AVIF
- Minificar `style.css` e os módulos `.js` (ferramentas como esbuild, terser ou cssnano)
- Validar licenciamento de qualquer áudio definitivo usado
