# Router Module

## Features
- Navegação SPA compatível com hash (`#/`) ou History API
- Pipeline de middlewares com suporte assíncrono (auth/logging)
- Lazy loading via `import()` com cache opcional por rota
- Estados de carregamento, transições fade e controle de scroll
- Manipulação de histórico com back/forward/reload
- Helpers para parâmetros, querystring e construção de URLs
- Tratamento robusto de erros com fallback UI e 404 customizável

## Uso
```javascript
const router = new Router({
  mode: 'hash',
  view: '[data-router-view]',
  loadingElement: document.getElementById('loadingOverlay'),
});

router
  .enableLogging()
  .useAuthGuard(() => window.isAuthenticated === true, '/login')
  .route('/home', () => '<section class="page">Home</section>', { title: 'CyberBook | Home' })
  .route('/chapters/:slug', async ({ params }) => {
    const html = await fetch(`/chapters/${params.slug}.md`).then((res) => res.text());
    return `<article class="page">${html}</article>`;
  }, { auth: true, meta: { section: 'chapters' } });

router.setNotFound(() => '<section class="page"><h1>404</h1></section>');
router.navigate('/home');
```

## API
- `register(path, handler, options)` / `route(path, handler, options)`
- `navigate(path, data?, pushState?)`
- `back()`, `forward()`, `reload()`
- `use(middleware)`
- `enableLogging(logger?)`
- `useAuthGuard(checkFn, redirectPath?)`
- `setNotFound(handler)`
- `getCurrentRoute()`, `getParams()`, `getQuery()`
- `buildUrl(path, params, query)`
- `clearCache()`, `destroy()`

## Troubleshooting
- Verifique se existe um elemento com `data-router-view` para renderização
- Garanta que `loadingOverlay` esteja presente caso utilize estados de carregamento
- Ao usar modo `history`, configure servidor para redirecionar todas as rotas para `index.html`
