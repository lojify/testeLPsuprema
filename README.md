# Método Acelerador — Template de Lançamento de Infoproduto

Template autônomo (HTML/CSS/JS) pronto para revenda, focado em urgência extrema e conversão.

## Estrutura

```
index.html
style.css
js/
  env.js              -> detecção de isMobile / prefersReducedMotion
  lenis-init.js        -> smooth scroll integrado ao GSAP
  countdown.js         -> contadores regressivos (data-deadline)
  gsap-animations.js   -> reveals, "explosão", contagem crescente
  cursor.js            -> cursor customizado (seta -> foguete)
  audio.js             -> Howler.js (trilha, clique, sucesso)
  lazy-load.js         -> Intersection Observer para vídeo pesado
  ui.js                -> acordeão FAQ, barra de escassez, progress bar
  main.js              -> ponto de entrada que orquestra tudo
assets/                -> imagens, vídeos e áudios (adicionar os arquivos reais)
```

## Antes de publicar

1. Substitua os arquivos em `assets/` pelos ativos reais (em WebP/AVIF para imagens, MP4/WebM para vídeo, MP3 para áudio), mantendo os mesmos nomes ou atualizando os caminhos no HTML/JS.
2. Ajuste `data-deadline` (em `index.html`) para a data real do seu lançamento, no formato ISO com timezone, ex: `2026-07-07T23:59:59-03:00`.
3. Atualize `data-total` / `data-filled` na barra de escassez (`.scarcity-bar`) com os números reais de vagas.
4. Troque os textos de prova social, oferta e FAQ pelo conteúdo real do seu produto.
5. Minifique `style.css` e os arquivos em `js/` antes de subir para produção (ex: via `esbuild`, `terser` ou seu bundler preferido), e sirva com Gzip/Brotli.
6. Conecte o link do botão de oferta (`data-cta="offer"`) ao seu checkout real.

## Comportamento responsivo e de acessibilidade

- Com `prefers-reduced-motion: reduce` ativado no sistema, todas as animações complexas (explosão, pulso, salto, cursor customizado) são desativadas automaticamente, mantendo apenas fades simples.
- Em telas menores que 768px, o cursor customizado é desativado, a duração das animações GSAP é reduzida em 50%, e o contador do header é ocultado para economizar espaço.
