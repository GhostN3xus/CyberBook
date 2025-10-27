/**
 * CyberBook Advanced SPA Router
 * Provides history/hash routing, middleware pipeline, lazy loading,
 * transitions, loading states and robust error handling.
 *
 * @class Router
 */
(function (global) {
  'use strict';

  const DEFAULT_TRANSITION_DURATION = 220;
  const ROUTER_DATA_ATTR = '[data-router-view]';

  /**
   * Safely resolves a DOM element by selector or returns the element directly.
   * @param {string|Element|null} target - Selector string or element reference.
   * @param {string} fallbackSelector - Selector to use when no explicit target is passed.
   * @returns {Element|null}
   */
  function resolveElement(target, fallbackSelector) {
    if (target instanceof Element) {
      return target;
    }
    if (typeof target === 'string') {
      return document.querySelector(target);
    }
    return document.querySelector(fallbackSelector) || null;
  }

  /**
   * Normalizes a path ensuring leading slash and removing redundant slashes.
   * @param {string} path
   * @returns {string}
   */
  function normalizePath(path) {
    if (!path) return '/';
    const cleaned = path.replace(/[#?].*$/, '').trim();
    const withSlash = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    return withSlash.replace(/\/+/, '/');
  }

  /**
   * Parses query string into object representation.
   * @param {string} queryString
   * @returns {Record<string, string | string[]>}
   */
  function parseQueryString(queryString) {
    const query = {};
    if (!queryString) return query;
    const params = new URLSearchParams(queryString.startsWith('?') ? queryString : `?${queryString}`);
    params.forEach((value, key) => {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const current = query[key];
        query[key] = Array.isArray(current) ? [...current, value] : [current, value];
      } else {
        query[key] = value;
      }
    });
    return query;
  }

  /**
   * Serializes params and query to construct a URL path.
   * @param {string} pattern - Route pattern e.g. `/chapters/:slug`.
   * @param {Record<string, string|number>} params - Params map.
   * @param {Record<string, string|number|string[]>} [query]
   * @returns {string}
   */
  function buildUrlFromPattern(pattern, params = {}, query = {}) {
    let url = pattern;
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(new RegExp(`:${key}(?=/|$)`), encodeURIComponent(String(value)));
    });
    const finalQuery = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => finalQuery.append(key, String(item)));
      } else if (value !== undefined && value !== null) {
        finalQuery.append(key, String(value));
      }
    });
    const queryString = finalQuery.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * @typedef {Object} RouteOptions
   * @property {boolean} [auth=false] - Whether the route requires authentication.
   * @property {string} [title] - Document title to use when route becomes active.
   * @property {Record<string, any>} [meta] - Custom metadata.
   * @property {boolean} [cache=false] - Whether the lazy chunk should be cached.
   */

  /**
   * @typedef {Object} RouteRecord
   * @property {string} path
   * @property {(ctx: RouteContext) => Promise<any>|any|{load: Function}} handler
   * @property {RouteOptions} options
   * @property {string[]} segments
   */

  /**
   * @typedef {Object} RouteContext
   * @property {string} path
   * @property {Record<string,string>} params
   * @property {Record<string, any>} data
   * @property {Router} router
   * @property {Record<string, any>} meta
   * @property {RouteOptions} options
   * @property {Record<string, string|string[]>} query
   */

  class Router {
    /**
     * @param {Object} [config]
     * @param {'hash'|'history'} [config.mode='hash']
     * @param {string|Element|null} [config.view]
     * @param {Element|null} [config.loadingElement]
     * @param {number} [config.transitionDuration=220]
     * @param {(error: Error, ctx: RouteContext|null) => void} [config.onError]
     */
    constructor(config = {}) {
      this.routes = new Map();
      this.currentRoute = null;
      this.history = [];
      this.middlewares = [];
      this.notFoundHandler = null;
      this.mode = config.mode === 'history' && 'pushState' in window.history ? 'history' : 'hash';
      this.view = resolveElement(config.view, ROUTER_DATA_ATTR) || document.getElementById('content') || null;
      this.loadingElement = config.loadingElement || document.getElementById('loadingOverlay') || null;
      this.transitionDuration = config.transitionDuration || DEFAULT_TRANSITION_DURATION;
      this.onErrorCallback = typeof config.onError === 'function' ? config.onError : null;
      this.middlewareTimeout = config.middlewareTimeout || 8000;
      this.pageTransitionClass = config.transitionClass || 'router__transition';
      this.isNavigating = false;
      this.silentNavigation = false;
      this.cache = new Map();
      this.fallbackView = config.fallbackView || '<section class="page"><h2>Algo deu errado</h2><p>Tente novamente em instantes.</p></section>';
      this.loadingTimeoutId = null;
      this.default404 = '<section class="page"><h1>404</h1><p>Conteúdo não encontrado.</p></section>';
      this.authGuard = null;
      this.logger = null;
      this.boundPopState = this.handlePopState.bind(this);
      this.boundHashChange = this.handleHashChange.bind(this);
      window.addEventListener('popstate', this.boundPopState);
      window.addEventListener('hashchange', this.boundHashChange);
    }

    /**
     * Registers a new route handler.
     * @param {string} path
     * @param {(ctx: RouteContext) => any | { load: Function }} handler
     * @param {RouteOptions} [options]
     */
    register(path, handler, options = {}) {
      const normalized = normalizePath(path);
      const record = {
        path: normalized,
        handler,
        options: { auth: false, meta: {}, cache: false, ...options },
        segments: normalized.split('/').filter(Boolean),
      };
      this.routes.set(normalized, record);
      return this;
    }

    /**
     * Alias for register to comply with API spec.
     * @param {string} path
     * @param {(ctx: RouteContext) => any} handler
     * @param {RouteOptions} [options]
     */
    route(path, handler, options = {}) {
      return this.register(path, handler, options);
    }

    /**
     * Sets middleware.
     * @param {(ctx: RouteContext, next: () => Promise<void>) => Promise<void>|void} middleware
     */
    use(middleware) {
      if (typeof middleware !== 'function') {
        throw new TypeError('Middleware must be a function');
      }
      this.middlewares.push(middleware);
      return this;
    }

    /**
     * Enables built-in logging middleware.
     * @param {(message: string, payload?: any) => void} [logger]
     */
    enableLogging(logger = console.debug) {
      this.logger = logger;
      this.use(async (ctx, next) => {
        try {
          this.logger?.('Router navigate', { path: ctx.path, params: ctx.params, query: ctx.query, meta: ctx.meta });
        } catch (error) {
          console.warn('Router logging middleware error', error);
        }
        await next();
      });
      return this;
    }

    /**
     * Registers auth guard middleware.
     * @param {() => Promise<boolean>|boolean} isAuthenticated
     * @param {string} [redirectPath='/']
     */
    useAuthGuard(isAuthenticated, redirectPath = '/') {
      this.authGuard = { isAuthenticated, redirectPath };
      this.use(async (ctx, next) => {
        if (!ctx.options?.auth) {
          await next();
          return;
        }
        try {
          const ok = await Promise.resolve(isAuthenticated());
          if (!ok) {
            await this.navigate(redirectPath, { reason: 'auth' }, true);
            return;
          }
          await next();
        } catch (error) {
          throw new Error('Falha ao validar autenticação: ' + error.message);
        }
      });
      return this;
    }

    /**
     * Defines custom 404 handler.
     * @param {(ctx: RouteContext) => any} handler
     */
    setNotFound(handler) {
      this.notFoundHandler = handler;
      return this;
    }

    /**
     * Shows loading overlay with timeout fallback.
     */
    showLoading() {
      if (!this.loadingElement) return;
      clearTimeout(this.loadingTimeoutId);
      this.loadingTimeoutId = window.setTimeout(() => {
        this.loadingElement.classList.add('is-visible');
      }, 90);
    }

    /**
     * Hides loading overlay.
     */
    hideLoading() {
      if (!this.loadingElement) return;
      clearTimeout(this.loadingTimeoutId);
      this.loadingElement.classList.remove('is-visible');
    }

    /**
     * Scrolls view container to top.
     */
    scrollToTop() {
      if (!this.view) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if ('scrollTo' in this.view) {
        this.view.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.view.scrollTop = 0;
      }
    }

    /**
     * Executes middleware pipeline sequentially supporting async functions.
     * @param {RouteContext} context
     */
    async runMiddlewares(context) {
      let index = -1;
      const execute = async (i) => {
        if (i <= index) {
          throw new Error('next() called multiple times');
        }
        index = i;
        const middleware = this.middlewares[i];
        if (!middleware) return;
        let finished = false;
        const timer = window.setTimeout(() => {
          if (!finished) {
            console.warn('Middleware taking too long', middleware.name || 'anonymous');
          }
        }, this.middlewareTimeout);
        try {
          await Promise.resolve(middleware(context, () => execute(i + 1)));
        } finally {
          finished = true;
          clearTimeout(timer);
        }
      };
      await execute(0);
    }

    /**
     * Matches a path against registered routes.
     * @param {string} path
     * @returns {{ route: RouteRecord|null, params: Record<string,string> }}
     */
    matchRoute(path) {
      const normalized = normalizePath(path);
      const requestSegments = normalized.split('/').filter(Boolean);
      for (const record of this.routes.values()) {
        const { segments } = record;
        if (segments.length !== requestSegments.length) continue;
        const params = {};
        let matches = true;
        for (let i = 0; i < segments.length; i += 1) {
          const currentSegment = segments[i];
          const requestSegment = requestSegments[i];
          if (currentSegment.startsWith(':')) {
            params[currentSegment.slice(1)] = decodeURIComponent(requestSegment);
            continue;
          }
          if (currentSegment !== requestSegment) {
            matches = false;
            break;
          }
        }
        if (matches) {
          return { route: record, params };
        }
      }
      return { route: null, params: {} };
    }

    /**
     * Resolves handler output supporting lazy imports.
     * @param {RouteRecord} record
     * @param {RouteContext} context
     */
    async resolveHandler(record, context) {
      const { handler, options } = record;
      try {
        if (typeof handler === 'function') {
          return await handler(context);
        }
        if (handler && typeof handler === 'object') {
          if (handler.load) {
            if (options.cache && this.cache.has(record.path)) {
              const cached = this.cache.get(record.path);
              return typeof cached === 'function' ? cached(context) : cached;
            }
            const moduleResult = await handler.load();
            const exportName = handler.exportName || 'default';
            const resolved = moduleResult?.[exportName] ?? moduleResult?.default ?? moduleResult;
            if (options.cache) {
              this.cache.set(record.path, resolved);
            }
            return typeof resolved === 'function' ? resolved(context) : resolved;
          }
          if (handler.render) {
            return handler.render(context);
          }
          if (handler.html) {
            return handler.html;
          }
        }
      } catch (error) {
        throw new Error(`Erro ao resolver handler da rota ${record.path}: ${error.message}`);
      }
      throw new Error(`Handler inválido para a rota ${record.path}`);
    }

    /**
     * Applies transition classes to the view element.
     * @param {'out'|'in'} direction
     */
    async applyTransition(direction) {
      if (!this.view) return;
      if (!this.pageTransitionClass) return;
      const className = `${this.pageTransitionClass}-${direction}`;
      this.view.classList.remove(`${this.pageTransitionClass}-in`, `${this.pageTransitionClass}-out`);
      this.view.classList.add(className);
      await new Promise((resolve) => {
        window.setTimeout(resolve, this.transitionDuration);
      });
    }

    /**
     * Renders result into the view container.
     * @param {any} result
     */
    async renderResult(result) {
      if (!this.view) return;
      await this.applyTransition('out');
      if (typeof result === 'string') {
        this.view.innerHTML = result;
      } else if (result instanceof Element) {
        this.view.innerHTML = '';
        this.view.appendChild(result);
      } else if (result && typeof result === 'object' && 'content' in result) {
        this.view.innerHTML = '';
        if (typeof result.content === 'string') {
          this.view.innerHTML = result.content;
        } else if (result.content instanceof Element) {
          this.view.appendChild(result.content);
        }
      } else if (result === undefined || result === null) {
        this.view.innerHTML = '';
      } else {
        this.view.textContent = String(result);
      }
      await this.applyTransition('in');
    }

    /**
     * Builds context object for middleware and handlers.
     * @param {string} path
     * @param {Record<string,string>} params
     * @param {RouteRecord|null} record
     * @param {Record<string, any>} data
     * @returns {RouteContext}
     */
    createContext(path, params, record, data) {
      const locationQuery = this.getQuery();
      return {
        path,
        params,
        data,
        router: this,
        meta: record?.options?.meta || {},
        options: record?.options || {},
        query: locationQuery,
      };
    }

    /**
     * Navigate to desired path.
     * @param {string} path
     * @param {Record<string, any>} [data]
     * @param {boolean} [pushState=true]
     */
    async navigate(path, data = {}, pushState = true) {
      if (!path) return;
      const normalized = normalizePath(path);
      if (this.isNavigating) return;
      this.isNavigating = true;
      this.showLoading();
      try {
        const { route, params } = this.matchRoute(normalized);
        const context = this.createContext(normalized, params, route, data);
        await this.runMiddlewares(context);

        if (!route) {
          if (this.notFoundHandler) {
            const result = await Promise.resolve(this.notFoundHandler(context));
            await this.renderResult(result);
          } else {
            await this.renderResult(this.default404);
          }
          this.updateHistory(normalized, data, pushState);
          this.currentRoute = { path: normalized, params: {}, data, meta: {}, options: {} };
          this.scrollToTop();
          return;
        }

        const output = await this.resolveHandler(route, context);
        await this.renderResult(output ?? this.fallbackView);
        if (route.options?.title) {
          document.title = route.options.title;
        }
        this.updateHistory(normalized, data, pushState);
        this.currentRoute = { path: normalized, params, data, meta: route.options.meta, options: route.options };
        this.scrollToTop();
      } catch (error) {
        this.handleError(error, path);
      } finally {
        this.hideLoading();
        window.requestAnimationFrame(() => {
          this.isNavigating = false;
        });
      }
    }

    /**
     * Update browser history according to router mode.
     * @param {string} path
     * @param {Record<string, any>} data
     * @param {boolean} pushState
     */
    updateHistory(path, data, pushState) {
      const entry = { path, data, timestamp: Date.now() };
      if (!this.history.length || this.history[this.history.length - 1].path !== path) {
        this.history.push(entry);
      } else {
        this.history[this.history.length - 1] = entry;
      }
      if (pushState === false) return;
      if (this.mode === 'history') {
        const fullPath = path + this.serializeQuery(this.getQuery());
        window.history.pushState({ path, data }, '', fullPath);
      } else {
        const targetHash = `#${path}`;
        if (window.location.hash === targetHash) return;
        this.silentNavigation = true;
        window.location.hash = targetHash;
        window.setTimeout(() => { this.silentNavigation = false; }, 50);
      }
    }

    /**
     * Serializes current query to string with leading ?
     * @param {Record<string,string|string[]>} query
     * @returns {string}
     */
    serializeQuery(query) {
      const params = new URLSearchParams();
      Object.entries(query || {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const str = params.toString();
      return str ? `?${str}` : '';
    }

    /**
     * Handles history back navigation.
     */
    back() {
      window.history.back();
    }

    /**
     * Handles history forward navigation.
     */
    forward() {
      window.history.forward();
    }

    /**
     * Reloads current route.
     */
    async reload() {
      if (!this.currentRoute) return;
      await this.navigate(this.currentRoute.path, this.currentRoute.data || {}, false);
    }

    /**
     * Returns current route state.
     * @returns {{path: string, params: Record<string,string>, data: any, meta: any, options: RouteOptions}|null}
     */
    getCurrentRoute() {
      return this.currentRoute;
    }

    /**
     * Returns current params or empty object.
     * @returns {Record<string,string>}
     */
    getParams() {
      return this.currentRoute?.params || {};
    }

    /**
     * Returns current query parameters.
     * @returns {Record<string,string|string[]>}
     */
    getQuery() {
      if (this.mode === 'history') {
        return parseQueryString(window.location.search);
      }
      const hash = window.location.hash.replace(/^#/, '');
      const queryIndex = hash.indexOf('?');
      return queryIndex >= 0 ? parseQueryString(hash.slice(queryIndex + 1)) : {};
    }

    /**
     * Constructs URL with params and query.
     * @param {string} path
     * @param {Record<string,string|number>} params
     * @param {Record<string,string|number|string[]>} [query]
     */
    buildUrl(path, params, query) {
      return buildUrlFromPattern(path, params, query);
    }

    /**
     * Handles popstate navigation for history mode.
     * @param {PopStateEvent} event
     */
    async handlePopState(event) {
      if (this.mode !== 'history') return;
      const statePath = event.state?.path || this.getLocationPath();
      await this.navigate(statePath, event.state?.data || {}, false);
    }

    /**
     * Handles hash change when using hash mode.
     */
    async handleHashChange() {
      if (this.mode !== 'hash') return;
      if (this.silentNavigation) return;
      const path = this.getLocationPath();
      await this.navigate(path, {}, false);
    }

    /**
     * Derives path from location according to router mode.
     * @returns {string}
     */
    getLocationPath() {
      if (this.mode === 'history') {
        return normalizePath(window.location.pathname);
      }
      const hash = window.location.hash.replace(/^#/, '');
      const queryIndex = hash.indexOf('?');
      return normalizePath(queryIndex >= 0 ? hash.slice(0, queryIndex) : hash);
    }

    /**
     * Handles errors by rendering fallback and logging.
     * @param {Error} error
     * @param {string} path
     */
    handleError(error, path) {
      console.error('[Router] erro ao navegar para', path, error);
      if (this.onErrorCallback) {
        try {
          this.onErrorCallback(error, this.currentRoute);
        } catch (callbackError) {
          console.error('Erro ao executar onError callback', callbackError);
        }
      }
      if (this.view) {
        this.view.innerHTML = this.fallbackView;
      }
    }

    /**
     * Clears cached lazy modules.
     */
    clearCache() {
      this.cache.clear();
    }

    /**
     * Destroys router listeners.
     */
    destroy() {
      window.removeEventListener('popstate', this.boundPopState);
      window.removeEventListener('hashchange', this.boundHashChange);
      this.history = [];
      this.routes.clear();
      this.middlewares = [];
      this.cache.clear();
    }
  }

  Router.prototype.buildUrl = Router.prototype.buildUrl;

  global.Router = Router;
})(window);
