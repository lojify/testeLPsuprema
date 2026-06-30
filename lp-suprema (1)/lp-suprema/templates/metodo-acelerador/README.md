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

## ⚠️ Placeholders temporários (gerados automaticamente)

Os arquivos abaixo foram criados como placeholders só para o site não ficar quebrado/com card de imagem ausente. Substitua antes de divulgar:

- `assets/mockup-produto.webp` — tem uma tag "EXEMPLO — SUBSTITUA" no canto.
- `assets/hero-poster.webp` — fundo do hero, tem tag "IMAGEM/VÍDEO DE FUNDO — EXEMPLO, SUBSTITUA".
- `assets/avatar-1.webp`, `avatar-2.webp`, `avatar-3.webp` — círculos com iniciais (C, D, L), sem tag (já parecem avatares "genéricos" aceitáveis até trocar).
- `assets/hero-bg.webm` e `assets/hero-bg.mp4` **não foram criados** (não dá pra gerar vídeo real aqui) — sem eles, o `<video>` simplesmente fica parado no `hero-poster.webp`, então o hero funciona normalmente como imagem estática até você subir o vídeo de verdade.
- `assets/audio/*.mp3` também não existem — o Howler.js só vai falhar silenciosamente ao tentar tocar (sem som, sem erro visível).

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
