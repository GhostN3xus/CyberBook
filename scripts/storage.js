/**
 * StorageManager - IndexedDB abstraction layer for CyberBook
 * Provides CRUD, querying, bulk operations, caching and sync helpers.
 * Falls back to localStorage when IndexedDB is unavailable.
 */
(function (global) {
  'use strict';

  const DEFAULT_DB_NAME = 'CyberBookDB';
  const DEFAULT_VERSION = 2;
  const FALLBACK_PREFIX = 'cyberbook__fallback__';
  const SYNC_STORE = '__syncQueue';

  const STORE_DEFINITIONS = {
    notes: {
      keyPath: 'id',
      autoIncrement: true,
      indices: [
        { name: 'byUpdatedAt', keyPath: 'updatedAt', options: { unique: false } },
        { name: 'byTitle', keyPath: 'title', options: { unique: false } },
      ],
    },
    bookmarks: {
      keyPath: 'id',
      autoIncrement: true,
      indices: [
        { name: 'bySlug', keyPath: 'slug', options: { unique: true } },
        { name: 'byCreatedAt', keyPath: 'createdAt', options: { unique: false } },
      ],
    },
    progress: {
      keyPath: 'id',
      autoIncrement: true,
      indices: [
        { name: 'byChapter', keyPath: 'chapter', options: { unique: true } },
        { name: 'byUpdatedAt', keyPath: 'updatedAt', options: { unique: false } },
      ],
    },
    settings: {
      keyPath: 'key',
      autoIncrement: false,
      indices: [{ name: 'byKey', keyPath: 'key', options: { unique: true } }],
    },
    cache: {
      keyPath: 'key',
      autoIncrement: false,
      indices: [
        { name: 'byKey', keyPath: 'key', options: { unique: true } },
        { name: 'byUpdatedAt', keyPath: 'updatedAt', options: { unique: false } },
      ],
    },
    [SYNC_STORE]: {
      keyPath: 'id',
      autoIncrement: true,
      indices: [{ name: 'byStore', keyPath: 'store', options: { unique: false } }],
    },
  };

  /**
   * Wraps IDBRequest into a Promise.
   * @template T
   * @param {IDBRequest<T>} request
   * @returns {Promise<T>}
   */
  function requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
    });
  }

  /**
   * Provides delay.
   * @param {number} ms
   */
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Simple LRU cache implementation.
   */
  class LRUCache {
    constructor(limit = 100) {
      this.limit = limit;
      this.map = new Map();
    }

    get(key) {
      if (!this.map.has(key)) return undefined;
      const value = this.map.get(key);
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }

    set(key, value) {
      if (this.map.has(key)) {
        this.map.delete(key);
      }
      this.map.set(key, value);
      if (this.map.size > this.limit) {
        const oldestKey = this.map.keys().next().value;
        this.map.delete(oldestKey);
      }
    }

    clear() {
      this.map.clear();
    }
  }

  class StorageManager {
    constructor() {
      this.db = null;
      this.dbName = DEFAULT_DB_NAME;
      this.version = DEFAULT_VERSION;
      this.stores = Object.keys(STORE_DEFINITIONS).filter((name) => name !== SYNC_STORE);
      this.cache = new LRUCache(100);
      this.supportsIndexedDB = typeof indexedDB !== 'undefined';
      this.retryAttempts = 3;
      this.retryDelay = 120;
      this.fallback = global.localStorage;
    }

    /**
     * Initializes database, performing migrations as necessary.
     * @returns {Promise<IDBDatabase|null>}
     */
    async init() {
      if (!this.supportsIndexedDB) {
        console.warn('[StorageManager] IndexedDB indisponível, usando localStorage.');
        return null;
      }
      if (this.db) return this.db;
      try {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open(this.dbName, this.version);
          request.onupgradeneeded = (event) => {
            const database = request.result;
            this.handleMigrations(database, event.oldVersion || 0);
          };
          request.onerror = () => reject(request.error || new Error('Não foi possível abrir IndexedDB.'));
          request.onsuccess = () => resolve(request.result);
        });
        this.db = db;
        this.db.onversionchange = () => {
          console.warn('[StorageManager] versão alterada externamente, fechando conexão.');
          this.db?.close();
          this.db = null;
        };
        return this.db;
      } catch (error) {
        console.error('[StorageManager] Falha ao inicializar IndexedDB', error);
        this.supportsIndexedDB = false;
        return null;
      }
    }

    /**
     * Handles database migrations per version.
     * @param {IDBDatabase} db
     * @param {number} oldVersion
     */
    handleMigrations(db, oldVersion) {
      const storeNames = Object.keys(STORE_DEFINITIONS);
      storeNames.forEach((storeName) => {
        const definition = STORE_DEFINITIONS[storeName];
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
            keyPath: definition.keyPath,
            autoIncrement: definition.autoIncrement,
          });
          definition.indices?.forEach((index) => {
            store.createIndex(index.name, index.keyPath, index.options || {});
          });
        } else if (oldVersion < this.version) {
          const store = db.transaction(storeName, 'versionchange').objectStore(storeName);
          definition.indices?.forEach((index) => {
            if (!store.indexNames.contains(index.name)) {
              store.createIndex(index.name, index.keyPath, index.options || {});
            }
          });
        }
      });
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, {
          keyPath: STORE_DEFINITIONS[SYNC_STORE].keyPath,
          autoIncrement: STORE_DEFINITIONS[SYNC_STORE].autoIncrement,
        });
      }
    }

    /**
     * Runs function with retry strategy.
     * @template T
     * @param {() => Promise<T>} fn
     * @returns {Promise<T>}
     */
    async withRetry(fn) {
      let attempt = 0;
      let lastError;
      while (attempt < this.retryAttempts) {
        try {
          return await fn();
        } catch (error) {
          lastError = error;
          attempt += 1;
          if (attempt >= this.retryAttempts) {
            break;
          }
          await wait(this.retryDelay * attempt);
        }
      }
      throw lastError;
    }

    /**
     * Returns object store in requested mode.
     * @param {string|string[]} storeNames
     * @param {'readonly'|'readwrite'} [mode='readonly']
     * @returns {IDBTransaction|null}
     */
    getTransaction(storeNames, mode = 'readonly') {
      if (!this.db) {
        throw new Error('IndexedDB não inicializado.');
      }
      const stores = Array.isArray(storeNames) ? storeNames : [storeNames];
      return this.db.transaction(stores, mode);
    }

    /**
     * Adds item to store.
     * @param {string} store
     * @param {Record<string, any>} data
     */
    async add(store, data) {
      if (!this.supportsIndexedDB) {
        return this.fallbackAdd(store, data);
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const request = tx.objectStore(store).add({ ...data, createdAt: data.createdAt || Date.now(), updatedAt: Date.now() });
        return requestToPromise(request);
      });
    }

    /**
     * Retrieves record by key.
     * @param {string} store
     * @param {IDBValidKey} key
     */
    async get(store, key) {
      if (!this.supportsIndexedDB) {
        return this.fallbackGet(store, key);
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readonly');
        const request = tx.objectStore(store).get(key);
        return requestToPromise(request);
      });
    }

    /**
     * Returns all records with optional options.
     * @param {string} store
     * @param {{ direction?: IDBCursorDirection, limit?: number }} [options]
     */
    async getAll(store, options = {}) {
      if (!this.supportsIndexedDB) {
        return this.fallbackGetAll(store);
      }
      await this.init();
      return this.withRetry(async () => {
        const { direction = 'next', limit } = options;
        const tx = this.getTransaction(store, 'readonly');
        const objectStore = tx.objectStore(store);
        if (!limit) {
          return requestToPromise(objectStore.getAll());
        }
        const results = [];
        await new Promise((resolve, reject) => {
          const request = objectStore.openCursor(null, direction);
          request.onerror = () => reject(request.error);
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && results.length < limit) {
              results.push(cursor.value);
              cursor.continue();
            } else {
              resolve();
            }
          };
        });
        return results;
      });
    }

    /**
     * Updates record (put).
     * @param {string} store
     * @param {Record<string, any>} data
     */
    async update(store, data) {
      if (!this.supportsIndexedDB) {
        return this.fallbackAdd(store, data);
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const payload = { ...data, updatedAt: Date.now() };
        const request = tx.objectStore(store).put(payload);
        return requestToPromise(request);
      });
    }

    /**
     * Deletes record.
     * @param {string} store
     * @param {IDBValidKey} key
     */
    async delete(store, key) {
      if (!this.supportsIndexedDB) {
        return this.fallbackDelete(store, key);
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const request = tx.objectStore(store).delete(key);
        return requestToPromise(request);
      });
    }

    /**
     * Clears store.
     * @param {string} store
     */
    async clear(store) {
      if (!this.supportsIndexedDB) {
        return this.fallbackClear(store);
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const request = tx.objectStore(store).clear();
        return requestToPromise(request);
      });
    }

    /**
     * Query by index value.
     * @param {string} store
     * @param {string} indexName
     * @param {IDBValidKey|IDBKeyRange} value
     */
    async query(store, indexName, value) {
      if (!this.supportsIndexedDB) {
        return this.fallbackQuery(store, indexName, value);
      }
      await this.init();
      return this.withRetry(async () => {
        const cacheKey = `${store}|${indexName}|${JSON.stringify(value)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
          return cached;
        }
        const tx = this.getTransaction(store, 'readonly');
        const index = tx.objectStore(store).index(indexName);
        const request = index.getAll(value);
        const results = await requestToPromise(request);
        this.cache.set(cacheKey, results);
        return results;
      });
    }

    /**
     * Query range.
     * @param {string} store
     * @param {string} indexName
     * @param {IDBValidKey} lower
     * @param {IDBValidKey} upper
     */
    async queryRange(store, indexName, lower, upper) {
      if (!this.supportsIndexedDB) {
        return this.fallbackQuery(store, indexName, { lower, upper });
      }
      await this.init();
      return this.withRetry(async () => {
        const cacheKey = `${store}|${indexName}|${lower}|${upper}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;
        const range = IDBKeyRange.bound(lower, upper);
        const tx = this.getTransaction(store, 'readonly');
        const request = tx.objectStore(store).index(indexName).getAll(range);
        const result = await requestToPromise(request);
        this.cache.set(cacheKey, result);
        return result;
      });
    }

    /**
     * Filters store using predicate.
     * @param {string} store
     * @param {(record: any) => boolean} predicateFn
     */
    async filter(store, predicateFn) {
      const records = await this.getAll(store);
      return records.filter(predicateFn);
    }

    /**
     * Paginates results from store.
     * @param {string} store
     * @param {number} page
     * @param {number} limit
     */
    async paginate(store, page = 1, limit = 10) {
      const records = await this.getAll(store);
      const offset = Math.max(page - 1, 0) * limit;
      return records.slice(offset, offset + limit);
    }

    /**
     * Bulk add.
     * @param {string} store
     * @param {Array<Record<string, any>>} items
     */
    async bulkAdd(store, items) {
      if (!Array.isArray(items) || items.length === 0) return [];
      if (!this.supportsIndexedDB) {
        return Promise.all(items.map((item) => this.fallbackAdd(store, item)));
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const objectStore = tx.objectStore(store);
        const results = await Promise.all(
          items.map((item) => requestToPromise(objectStore.add({ ...item, createdAt: Date.now(), updatedAt: Date.now() })))
        );
        return results;
      });
    }

    /**
     * Bulk update.
     */
    async bulkUpdate(store, items) {
      if (!Array.isArray(items) || items.length === 0) return [];
      if (!this.supportsIndexedDB) {
        return Promise.all(items.map((item) => this.fallbackAdd(store, item)));
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const objectStore = tx.objectStore(store);
        const results = await Promise.all(
          items.map((item) => requestToPromise(objectStore.put({ ...item, updatedAt: Date.now() })))
        );
        return results;
      });
    }

    /**
     * Bulk delete.
     */
    async bulkDelete(store, keys) {
      if (!Array.isArray(keys) || keys.length === 0) return [];
      if (!this.supportsIndexedDB) {
        return Promise.all(keys.map((key) => this.fallbackDelete(store, key)));
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(store, 'readwrite');
        const objectStore = tx.objectStore(store);
        const results = await Promise.all(keys.map((key) => requestToPromise(objectStore.delete(key))));
        return results;
      });
    }

    /**
     * Runs atomic transaction across stores.
     * @param {string[]} stores
     * @param {'readonly'|'readwrite'} mode
     * @param {(tx: IDBTransaction) => Promise<any>} callback
     */
    async transaction(stores, mode, callback) {
      if (!this.supportsIndexedDB) {
        throw new Error('Transações não suportadas em fallback.');
      }
      await this.init();
      return this.withRetry(async () => {
        const tx = this.getTransaction(stores, mode);
        try {
          const result = await callback(tx);
          await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Falha na transação.'));
            tx.onabort = () => reject(tx.error || new Error('Transação abortada.'));
          });
          return result;
        } catch (error) {
          tx.abort();
          throw error;
        }
      });
    }

    /**
     * Exports data from stores to JSON structure.
     * @param {string[]} stores
     */
    async exportData(stores = this.stores) {
      const exportObject = {};
      for (const store of stores) {
        exportObject[store] = await this.getAll(store);
      }
      return exportObject;
    }

    /**
     * Imports JSON data into stores (clears before insert).
     * @param {Record<string, any[]>} data
     */
    async importData(data) {
      if (!data || typeof data !== 'object') return;
      const storeNames = Object.keys(data);
      for (const store of storeNames) {
        await this.clear(store);
        const items = Array.isArray(data[store]) ? data[store] : [];
        await this.bulkAdd(store, items);
      }
    }

    /**
     * Returns quota information when supported.
     */
    async getQuotaInfo() {
      if (!navigator.storage || !navigator.storage.estimate) {
        return null;
      }
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        usageDetails: estimate.usageDetails || {},
      };
    }

    /**
     * Removes records older than X days based on updatedAt property.
     * @param {string} store
     * @param {number} days
     */
    async cleanOldData(store, days = 30) {
      const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
      const records = await this.getAll(store);
      const stale = records.filter((item) => (item.updatedAt || item.createdAt || 0) < threshold);
      const keys = stale.map((item) => item.id ?? item.key);
      await this.bulkDelete(store, keys);
      return keys.length;
    }

    /**
     * Compacts database by clearing caches and reopening connection.
     */
    async compactDatabase() {
      if (!this.supportsIndexedDB) return;
      this.cache.clear();
      if (this.db) {
        this.db.close();
        this.db = null;
      }
      await this.init();
    }

    /**
     * Adds entry to sync queue for future synchronization.
     * @param {string} store
     * @param {IDBValidKey|undefined} key
     */
    async markForSync(store, key) {
      if (!this.supportsIndexedDB) return;
      await this.init();
      await this.withRetry(async () => {
        const tx = this.getTransaction(SYNC_STORE, 'readwrite');
        await requestToPromise(
          tx.objectStore(SYNC_STORE).add({
            store,
            key,
            timestamp: Date.now(),
          })
        );
      });
    }

    /**
     * Returns sync queue items.
     */
    async getSyncQueue() {
      if (!this.supportsIndexedDB) return [];
      await this.init();
      const tx = this.getTransaction(SYNC_STORE, 'readonly');
      return requestToPromise(tx.objectStore(SYNC_STORE).getAll());
    }

    /**
     * Clears sync queue.
     */
    async clearSyncQueue() {
      if (!this.supportsIndexedDB) return;
      await this.init();
      const tx = this.getTransaction(SYNC_STORE, 'readwrite');
      await requestToPromise(tx.objectStore(SYNC_STORE).clear());
    }

    /**
     * Retrieves cached query result.
     * @param {string} key
     */
    getCachedQuery(key) {
      return this.cache.get(key);
    }

    /**
     * Invalidates cache entries by prefix.
     * @param {string} prefix
     */
    invalidateCache(prefix) {
      const entries = Array.from(this.cache.map?.entries?.() || []);
      entries.forEach(([key]) => {
        if (String(key).startsWith(prefix)) {
          this.cache.map.delete(key);
        }
      });
    }

    /**
     * Fallback operations using localStorage.
     */
    fallbackAdd(store, data) {
      const key = data.id || data.key || (global.crypto?.randomUUID ? global.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
      const payload = { ...data, id: key, updatedAt: Date.now() };
      this.fallback.setItem(`${FALLBACK_PREFIX}${store}__${key}`, JSON.stringify(payload));
      return key;
    }

    fallbackGet(store, key) {
      const item = this.fallback.getItem(`${FALLBACK_PREFIX}${store}__${key}`);
      return item ? JSON.parse(item) : null;
    }

    fallbackGetAll(store) {
      const prefix = `${FALLBACK_PREFIX}${store}__`;
      const results = [];
      for (let i = 0; i < this.fallback.length; i += 1) {
        const storageKey = this.fallback.key(i);
        if (storageKey && storageKey.startsWith(prefix)) {
          try {
            results.push(JSON.parse(this.fallback.getItem(storageKey)));
          } catch (error) {
            console.warn('Falha ao ler fallback', storageKey, error);
          }
        }
      }
      return results;
    }

    fallbackDelete(store, key) {
      this.fallback.removeItem(`${FALLBACK_PREFIX}${store}__${key}`);
    }

    fallbackClear(store) {
      const prefix = `${FALLBACK_PREFIX}${store}__`;
      const toDelete = [];
      for (let i = 0; i < this.fallback.length; i += 1) {
        const storageKey = this.fallback.key(i);
        if (storageKey && storageKey.startsWith(prefix)) {
          toDelete.push(storageKey);
        }
      }
      toDelete.forEach((storageKey) => this.fallback.removeItem(storageKey));
    }

    fallbackQuery(store, indexName, value) {
      const records = this.fallbackGetAll(store);
      if (typeof value === 'object' && value !== null && 'lower' in value && 'upper' in value) {
        return records.filter((item) => item[indexName] >= value.lower && item[indexName] <= value.upper);
      }
      return records.filter((item) => item[indexName] === value);
    }
  }

  global.StorageManager = StorageManager;
})(window);
