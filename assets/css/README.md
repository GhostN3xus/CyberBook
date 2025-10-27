# CyberBook Design System

## Features
- Tokens de design completos (cores, espaçamento, tipografia, sombras e raios)
- Layout responsivo com grid de 12 colunas e utilitários flex
- Componentes reutilizáveis (botões, cards, formulários, toasts, modais, badges)
- Animações padronizadas (fade, slide, scale, rotate, skeleton)
- Suporte a temas claro/escuro via `data-theme`
- Utilitários extensos para espaçamento, tipografia, cores, display e posicionamento

## Uso
Inclua `assets/css/style.css` na página raiz:

```html
<link rel="stylesheet" href="/assets/css/style.css" />
```

Estruture o conteúdo principal dentro de um container:

```html
<div class="main-layout">
  <aside class="sidebar">...</aside>
  <main class="main-content" data-router-view>...</main>
</div>
```

## Convenções
- Classes utilitárias seguem padrão `.{propriedade}-{valor}`
- Componentes usam prefixo `.btn`, `.card`, `.toast` etc.
- Variáveis CSS devem ser reutilizadas para manter consistência

## Troubleshooting
- Certifique-se de definir `data-theme="dark"` ou `data-theme="light"` no elemento `html`
- Para evitar flashes entre temas, adicione classe `theme-transition` aos elementos dinâmicos
- Em caso de conflitos, carregue este CSS por último para priorizar o design system
