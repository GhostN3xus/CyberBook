# Storage Module

## Features
- IndexedDB wrapper com criação de stores, índices e migrações automáticas
- CRUD completo com suporte a operações em lote e transações atômicas
- Consultas avançadas (`query`, `queryRange`, `filter`, `paginate`)
- Importação/exportação de dados e limpeza baseada em tempo
- Fallback para `localStorage` com namespace seguro
- Cache LRU de resultados frequentes e invalidação seletiva
- Fila de sincronização preparada para integrações futuras
- Métricas de uso com `navigator.storage.estimate()`

## Uso
```javascript
const storage = new StorageManager();
await storage.init();

const noteId = await storage.add('notes', { title: 'Checklist AppSec', body: '...' });
const note = await storage.get('notes', noteId);
await storage.update('notes', { ...note, body: 'conteúdo atualizado' });
const recent = await storage.query('notes', 'byUpdatedAt', IDBKeyRange.lowerBound(Date.now() - 86400000));
```

## API Destacada
- `init()`
- `add(store, data)`, `get(store, key)`, `getAll(store, options)`
- `update(store, data)`, `delete(store, key)`, `clear(store)`
- `query(store, index, value)`, `queryRange(store, index, lower, upper)`
- `filter(store, predicateFn)`, `paginate(store, page, limit)`
- `bulkAdd(store, items)`, `bulkUpdate(store, items)`, `bulkDelete(store, keys)`
- `transaction(stores, mode, callback)`
- `exportData(stores)`, `importData(json)`
- `getQuotaInfo()`, `cleanOldData(store, days)`
- `markForSync(store, key)`, `getSyncQueue()`, `clearSyncQueue()`

## Troubleshooting
- Chame `await storage.init()` antes de qualquer operação IndexedDB
- Ao usar `queryRange`, utilize `IDBKeyRange` conforme especificação
- Em ambientes sem IndexedDB (modo privado agressivo), as operações usam fallback `localStorage`
