# Template "Estética/Clínica Clean Luxury" — Elegante/Suave

Template standalone, sem build step, pronto para zipar e entregar ao cliente.

## Como usar
Abra `index.html` em um navegador, ou suba os arquivos para qualquer hospedagem estática (Netlify, etc). Todas as bibliotecas (GSAP, ScrollTrigger, Lenis, Howler) vêm via CDN — não há instalação nem build.

## Estrutura de arquivos
```
index.html
style.css
js/
  config.js       → detecção de mobile e prefers-reduced-motion (roda primeiro, sempre)
  cursor.js       → ponto de luz sutil que vira "folha dourada" sobre clicáveis
  scroll.js       → Lenis Scroll integrado ao GSAP (easing mais lento, condizente com a marca)
  animations.js   → fade-ins lentos, névoa suave no hero, stagger sutil nos grids
  audio.js        → Howler.js (música ambiente + sino de vento ao entrar em seções-chave)
  particles.js    → Canvas 2D leve (partículas de brilho douradas/brancas, sem Three.js)
  main.js         → orquestra a ordem de inicialização de tudo acima
```

## O que customizar para cada cliente
1. **Nome e textos**: trocar "Âmbar Estética" e toda a copy nas seções do `index.html`.
2. **Fotos**: substituir as URLs do Unsplash por fotos reais do espaço/equipe, idealmente já em WebP/AVIF e hospedadas no domínio final.
3. **Preço de entrada**: `R$ 99,90` já fixo na seção `#oferta`, classe `.plano-card--entrada`. Demais pacotes ficam como "Solicitar orçamento" propositalmente.
4. **WhatsApp**: o botão `.btn-whatsapp` tem `href="#"` — trocar pelo link real `https://wa.me/55XXXXXXXXXXX`.
5. **Trilha e sino de vento**: os áudios em `audio.js` são placeholders livres do Pixabay — trocar por trilhas licenciadas antes da entrega final.
6. **Cores**: tudo controlado pelas variáveis CSS no `:root` do `style.css` (paleta pastel/dourado/azul serenity).

## Garantias de performance já implementadas
- Todas as animações usam exclusivamente `transform`/`opacity` (regra de ouro GPU)
- `will-change` nos elementos animados
- Detecção de `isMobile` e `prefers-reduced-motion` desativando: partículas de brilho, névoa, cursor customizado
- `ScrollTrigger` com `invalidateOnRefresh: true` em todas as instâncias
- `loading="lazy"` em imagens fora do viewport inicial
- Fontes com preload + `font-display: swap`
- Glassmorphism com `backdrop-filter` aplicado uma única vez por elemento (nunca animado por frame)
- Partículas via Canvas 2D leve em vez de Three.js — mais leve e alinhado ao tom "spa"

## Antes de entregar ao cliente final
- Comprimir/converter as imagens reais para WebP ou AVIF
- Minificar `style.css` e os módulos `.js`
- Confirmar licenciamento de qualquer áudio definitivo usado
