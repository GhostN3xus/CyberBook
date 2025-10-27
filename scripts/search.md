# Search Module

## Features
- Indexação full-text com TF-IDF, remoção de stopwords e stemming leve
- Sugestões com LRU cache, frequência de termos e tolerância a typos
- Busca fuzzy via distância de Levenshtein com tolerância configurada
- Filtros por metadados (categoria, tags, autor, data)
- Snippets com highlight automático das palavras-chave
- Analytics interno (consultas populares, sem resultados, histórico)
- Debounce para integrações em tempo real e navegação por teclado
- Exportação/importação do índice em formato JSON

## Uso
```javascript
const search = new SearchEngine();
await search.indexAllChapters();

const results = await search.search('OWASP', { limit: 5, filters: { category: 'top-10' } });
const suggestions = search.getSuggestions('sql');
const analytics = search.getAnalytics();
```

## API
- `indexDocument(id, content, metadata)`
- `indexAllChapters(manifestPath?)`
- `search(query, options)`
- `getSuggestions(query, limit?)`
- `getAnalytics()`
- `debounce(fn)`
- `enableKeyboardNavigation(container)`
- `exportIndex()` / `importIndex(json)`

## Troubleshooting
- Certifique-se de disponibilizar `/chapters/manifest.json` com `{ slug, title, path }`
- Para buscas fuzzy mais rápidas, reduza o número de documentos indexados ou desative `fuzzy`
- Reinvoque `indexDocument` após atualizações de conteúdo para invalidar cache
