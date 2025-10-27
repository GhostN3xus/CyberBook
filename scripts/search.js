/**
 * SearchEngine - client-side full-text search for CyberBook.
 * Provides TF-IDF ranking, autocomplete, fuzzy search, filters and analytics.
 */
(function (global) {
  'use strict';

  const DEFAULT_SUGGESTION_LIMIT = 8;
  const CACHE_LIMIT = 100;
  const TOKEN_REGEX = /[A-Za-zÀ-ÿ0-9]+/g;

  /**
   * Basic LRU cache to memoize expensive operations.
   */
  class LRUCache {
    constructor(limit = CACHE_LIMIT) {
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
        const oldest = this.map.keys().next().value;
        this.map.delete(oldest);
      }
    }

    clear() {
      this.map.clear();
    }
  }

  /**
   * Calculates Levenshtein distance (iterative).
   * @param {string} a
   * @param {string} b
   */
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  }

  /**
   * Light stemming by removing plural and gerund endings.
   * @param {string} token
   */
  function stem(token) {
    return token.replace(/(ções|coes|idades|mento|mente|s|es|ing)$/i, '');
  }

  /**
   * Highlights occurrences of tokens in given text.
   * @param {string} text
   * @param {string[]} tokens
   */
  function highlight(text, tokens) {
    if (!text || !tokens.length) return text;
    const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    return text.replace(pattern, '<mark>$1</mark>');
  }

  class SearchEngine {
    constructor() {
      this.index = new Map(); // term -> Map(docId -> tf)
      this.documents = new Map();
      this.documentFrequency = new Map();
      this.stopWords = new Set(['a', 'o', 'de', 'da', 'em', 'para', 'e', 'do', 'um', 'uma']);
      this.cache = new LRUCache(CACHE_LIMIT);
      this.suggestions = new Map(); // term -> frequency
      this.analytics = {
        queries: new Map(),
        popular: new Map(),
        noResults: new Map(),
      };
      this.debounceTimer = null;
      this.debounceDelay = 160;
    }

    /**
     * Tokenizes string with normalization, stopwords removal and stemming.
     * @param {string} text
     */
    tokenize(text) {
      if (!text) return [];
      const matches = text.normalize('NFD').toLowerCase().match(TOKEN_REGEX) || [];
      const tokens = matches
        .map((token) => stem(token.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
        .filter((token) => token && !this.stopWords.has(token) && token.length > 1);
      return tokens;
    }

    /**
     * Adds document to index.
     * @param {string} id
     * @param {string} content
     * @param {Record<string, any>} metadata
     */
    indexDocument(id, content, metadata = {}) {
      if (!id || !content) return;
      const tokens = this.tokenize(content);
      const termFrequency = new Map();
      tokens.forEach((token) => {
        termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
      });
      termFrequency.forEach((count, token) => {
        if (!this.index.has(token)) {
          this.index.set(token, new Map());
        }
        const docsForToken = this.index.get(token);
        docsForToken.set(id, count);
        this.documentFrequency.set(token, (this.documentFrequency.get(token) || 0) + 1);
        this.suggestions.set(token, (this.suggestions.get(token) || 0) + 1);
      });
      const normalizedContent = content.slice(0, 5000); // limit memory usage
      this.documents.set(id, {
        id,
        content: normalizedContent,
        metadata,
        tokenCount: tokens.length,
      });
      this.cache.clear();
    }

    /**
     * Fetches and indexes all chapters using manifest file.
     * @param {string} [manifest='/chapters/manifest.json']
     */
    async indexAllChapters(manifest = '/chapters/manifest.json') {
      try {
        const response = await fetch(manifest, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Manifesto não encontrado: ${manifest}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Manifesto inválido');
        const jobs = data.map(async (chapter) => {
          const url = chapter.path || `/chapters/${chapter.slug}.md`;
          const text = await fetch(url, { cache: 'no-store' }).then((res) => res.text());
          const metadata = {
            title: chapter.title || chapter.slug,
            category: chapter.category || 'general',
            tags: chapter.tags || [],
            author: chapter.author || 'CyberBook',
            updatedAt: chapter.updatedAt || Date.now(),
          };
          this.indexDocument(chapter.slug || url, `${chapter.title}\n${text}`, metadata);
        });
        await Promise.allSettled(jobs);
      } catch (error) {
        console.error('[SearchEngine] Falha ao indexar capítulos', error);
        throw error;
      }
    }

    /**
     * Performs full-text search.
     * @param {string} query
     * @param {{ limit?: number, offset?: number, fuzzy?: boolean, filters?: Record<string, any> }} [options]
     */
    async search(query, options = {}) {
      const { limit = 10, offset = 0, fuzzy = true, filters = {} } = options;
      if (!query || query.trim().length < 2) {
        return [];
      }
      const normalizedQuery = query.trim().toLowerCase();
      const cacheKey = `${normalizedQuery}|${JSON.stringify(options)}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const tokens = this.tokenize(normalizedQuery);
      const docScores = new Map();
      const docHighlights = new Map();

      tokens.forEach((token) => {
        const docsForToken = this.index.get(token);
        if (!docsForToken) return;
        const idf = Math.log((this.documents.size + 1) / (1 + (this.documentFrequency.get(token) || 0))) + 1;
        docsForToken.forEach((tf, docId) => {
          const doc = this.documents.get(docId);
          if (!doc) return;
          const score = (tf / doc.tokenCount) * idf;
          docScores.set(docId, (docScores.get(docId) || 0) + score);
          const snippet = this.createSnippet(doc.content, tokens);
          docHighlights.set(docId, snippet);
        });
      });

      if (fuzzy && tokens.length) {
        const fuzzyResults = this.applyFuzzy(tokens);
        fuzzyResults.forEach((value, docId) => {
          docScores.set(docId, (docScores.get(docId) || 0) + value);
        });
      }

      const ranked = Array.from(docScores.entries())
        .map(([docId, score]) => {
          const doc = this.documents.get(docId);
          return {
            id: docId,
            score,
            title: doc?.metadata?.title || docId,
            snippet: docHighlights.get(docId) || this.createSnippet(doc?.content || '', tokens),
            metadata: doc?.metadata || {},
          };
        })
        .filter((item) => this.applyFilters(item.metadata, filters))
        .sort((a, b) => b.score - a.score);

      const paginated = ranked.slice(offset, offset + limit);
      this.cache.set(cacheKey, paginated);
      this.trackQuery(normalizedQuery, paginated.length);
      return paginated;
    }

    /**
     * Creates snippet for highlight.
     * @param {string} content
     * @param {string[]} tokens
     */
    createSnippet(content, tokens) {
      if (!content) return '';
      const lowerContent = content.toLowerCase();
      let index = -1;
      tokens.some((token) => {
        index = lowerContent.indexOf(token.toLowerCase());
        return index >= 0;
      });
      const start = Math.max(0, index - 60);
      const end = Math.min(content.length, start + 160);
      const snippet = content.slice(start, end);
      return highlight(snippet, tokens);
    }

    /**
     * Applies metadata filters.
     * @param {Record<string, any>} metadata
     * @param {Record<string, any>} filters
     */
    applyFilters(metadata = {}, filters = {}) {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true;
        const metaValue = metadata[key];
        if (Array.isArray(value)) {
          if (Array.isArray(metaValue)) {
            return value.every((item) => metaValue.includes(item));
          }
          return value.includes(metaValue);
        }
        if (Array.isArray(metaValue)) {
          return metaValue.includes(value);
        }
        if (value instanceof Date) {
          const metaDate = new Date(metaValue);
          return metaDate.toDateString() === value.toDateString();
        }
        return String(metaValue).toLowerCase() === String(value).toLowerCase();
      });
    }

    /**
     * Fuzzy scoring for tokens.
     * @param {string[]} tokens
     */
    applyFuzzy(tokens) {
      const scores = new Map();
      const threshold = 2; // allow small typos
      this.documents.forEach((doc, docId) => {
        const docTokens = new Set(this.tokenize(doc.content));
        tokens.forEach((token) => {
          docTokens.forEach((candidate) => {
            const distance = levenshtein(token, candidate);
            if (distance <= threshold) {
              const contribution = 1 / (distance + 1);
              scores.set(docId, (scores.get(docId) || 0) + contribution * 0.1);
            }
          });
        });
      });
      return scores;
    }

    /**
     * Returns suggestions based on prefix matching and frequency.
     * @param {string} query
     * @param {number} [limit=DEFAULT_SUGGESTION_LIMIT]
     */
    getSuggestions(query, limit = DEFAULT_SUGGESTION_LIMIT) {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return [];
      const matches = [];
      this.suggestions.forEach((frequency, term) => {
        if (term.startsWith(normalized) || levenshtein(term, normalized) <= 1) {
          matches.push({ term, frequency });
        }
      });
      return matches
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, limit)
        .map((item) => item.term);
    }

    /**
     * Tracks analytics for query usage.
     * @param {string} query
     * @param {number} resultCount
     */
    trackQuery(query, resultCount) {
      const current = this.analytics.queries.get(query) || { count: 0, last: null };
      current.count += 1;
      current.last = Date.now();
      this.analytics.queries.set(query, current);
      if (resultCount === 0) {
        this.analytics.noResults.set(query, (this.analytics.noResults.get(query) || 0) + 1);
      } else {
        this.analytics.popular.set(query, (this.analytics.popular.get(query) || 0) + 1);
      }
    }

    /**
     * Returns analytics summary.
     */
    getAnalytics() {
      return {
        queries: Array.from(this.analytics.queries.entries()),
        popular: Array.from(this.analytics.popular.entries()),
        noResults: Array.from(this.analytics.noResults.entries()),
      };
    }

    /**
     * Debounces search execution for UI integration.
     * @param {Function} fn
     */
    debounce(fn) {
      return (...args) => {
        window.clearTimeout(this.debounceTimer);
        this.debounceTimer = window.setTimeout(() => {
          fn.apply(this, args);
        }, this.debounceDelay);
      };
    }

    /**
     * Handles keyboard navigation in search results.
     * @param {HTMLElement} container
     */
    enableKeyboardNavigation(container) {
      if (!container) return;
      container.setAttribute('role', 'listbox');
      container.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) return;
        const items = Array.from(container.querySelectorAll('[data-search-item]'));
        if (!items.length) return;
        const currentIndex = items.findIndex((item) => item === document.activeElement);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex].focus();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          document.activeElement?.click();
        } else if (event.key === 'Escape') {
          container.dispatchEvent(new CustomEvent('search:cancel'));
        }
      });
    }

    /**
     * Exports index to JSON.
     */
    exportIndex() {
      const index = {};
      this.index.forEach((value, key) => {
        index[key] = Array.from(value.entries());
      });
      return {
        index,
        documents: Array.from(this.documents.entries()),
        documentFrequency: Array.from(this.documentFrequency.entries()),
        suggestions: Array.from(this.suggestions.entries()),
      };
    }

    /**
     * Imports index from JSON.
     * @param {any} data
     */
    importIndex(data) {
      if (!data) return;
      this.index = new Map(Object.entries(data.index || {}).map(([term, entries]) => [term, new Map(entries)]));
      this.documents = new Map((data.documents || []).map(([id, doc]) => [id, doc]));
      this.documentFrequency = new Map(data.documentFrequency || []);
      this.suggestions = new Map(data.suggestions || []);
      this.cache.clear();
    }
  }

  global.SearchEngine = SearchEngine;
})(window);
