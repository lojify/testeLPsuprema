# Template "Barbearia Thug Life" — Urbano/Imersivo

Template standalone, sem build step, pronto para zipar e entregar ao cliente.

## Como usar
Abra `index.html` em um navegador, ou suba os arquivos para qualquer hospedagem estática (Netlify, etc). Todas as bibliotecas (GSAP, ScrollTrigger, Lenis, Howler, Three.js) vêm via CDN — não há instalação nem build.

## Estrutura de arquivos
```
index.html
style.css
js/
  config.js       → detecção de mobile e prefers-reduced-motion (roda primeiro, sempre)
  cursor.js       → cursor de navalha que vira spray sobre botões
  scroll.js       → Lenis Scroll integrado ao GSAP
  animations.js   → neon flicker do logo, reveals, stagger, revelação de grafite nas fotos
  audio.js        → Howler.js (hip-hop lo-fi + sons de tesoura/navalha no hover dos cards)
  particles.js    → Three.js (poeira urbana no hero, desativado em mobile/reduced-motion)
  main.js         → orquestra a ordem de inicialização de tudo acima
```

## O que customizar para cada cliente
1. **Nome e textos**: trocar "Navalha de Aço" e toda a copy nas seções do `index.html`.
2. **Fotos**: substituir as URLs do Unsplash por fotos reais da barbearia/equipe, idealmente já em WebP/AVIF e hospedadas no domínio final.
3. **Preço de entrada**: `R$ 99,90` já fixo na seção `#oferta`, classe `.plano-card--entrada`. Demais pacotes ficam como "Solicitar orçamento" propositalmente.
4. **WhatsApp**: o botão `.btn-whatsapp` tem `href="#"` — trocar pelo link real `https://wa.me/55XXXXXXXXXXX`.
5. **Trilha e efeitos sonoros**: os áudios em `audio.js` são placeholders livres do Pixabay — trocar por trilhas licenciadas antes da entrega final.
6. **Cores**: tudo controlado pelas variáveis CSS no `:root` do `style.css`, incluindo os tons de neon (verde/azul/rosa).
7. **Endereço/horário**: seção `#contato`, e o mapa atual é um placeholder estilizado (grid + pin), não um mapa real — substitua por embed do Google Maps se desejar.

## Garantias de performance já implementadas
- Todas as animações usam exclusivamente `transform`/`opacity` (regra de ouro GPU)
- `will-change` nos elementos animados
- Detecção de `isMobile` e `prefers-reduced-motion` desativando/simplificando: partículas Three.js, cursor customizado, neon flicker, parallax
- `ScrollTrigger` com `invalidateOnRefresh: true` em todas as instâncias
- `loading="lazy"` em imagens fora do viewport inicial
- Fontes com preload + `font-display: swap`
- Textura de "concreto" do hero é 100% CSS (gradientes), sem imagem pesada

## Antes de entregar ao cliente final
- Comprimir/converter as imagens reais para WebP ou AVIF
- Minificar `style.css` e os módulos `.js`
- Confirmar licenciamento de qualquer áudio definitivo usado
- Trocar o placeholder de mapa por embed real, se o cliente quiser
