(function(){
  if (window.trustedTypes && !trustedTypes.getPolicy('cb')) {
    trustedTypes.createPolicy('cb', { createHTML: (s) => s });
  }

  const content = document.getElementById('content');
  const crumbs = document.getElementById('breadcrumbs');
  const progress = document.getElementById('readProgress');
  const main = document.querySelector('.main');
  let detachProgress = null;

  async function get(path){
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao carregar recurso: '+path);
    return res.text();
  }

  function esc(str){
    return str.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  }

  function escAttr(str){
    return str.replace(/[&<>\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function inlineMarkdown(line){
    let safe = esc(line);
    safe = safe.replace(/`([^`]+)`/g, '<code class="inlineCode">$1</code>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => '<a href="'+escAttr(href)+'" target="_blank" rel="noopener noreferrer">'+label+'</a>');
    return safe;
  }

  function mdToHtml(text){
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const parts = [];
    let listType = null;
    let listItems = [];
    let inCode = false;
    let codeBuffer = [];
    let paragraph = [];

    function flushParagraph(){
      if (paragraph.length){
        parts.push('<p>'+inlineMarkdown(paragraph.join(' '))+'</p>');
        paragraph = [];
      }
    }

    function flushList(){
      if (listType){
        const tag = listType === 'ol' ? 'ol' : 'ul';
        parts.push('<'+tag+'>'+listItems.join('')+'</'+tag+'>');
        listType = null;
        listItems = [];
      }
    }

    function flushCode(){
      if (inCode){
        parts.push('<pre class="code">'+esc(codeBuffer.join('\n'))+'</pre>');
        inCode = false;
        codeBuffer = [];
      }
    }

    for (const raw of lines){
      const line = raw.trimEnd();

      if (line.startsWith('```')){
        if (inCode){
          flushCode();
        } else {
          flushParagraph();
          flushList();
          inCode = true;
          codeBuffer = [];
        }
        continue;
      }

      if (inCode){
        codeBuffer.push(raw);
        continue;
      }

      if (!line.trim()){
        flushParagraph();
        flushList();
        continue;
      }

      if (/^###\s+/.test(line)){
        flushParagraph();
        flushList();
        parts.push('<h3>'+inlineMarkdown(line.replace(/^###\s+/, ''))+'</h3>');
        continue;
      }

      if (/^##\s+/.test(line)){
        flushParagraph();
        flushList();
        parts.push('<h2>'+inlineMarkdown(line.replace(/^##\s+/, ''))+'</h2>');
        continue;
      }

      if (/^#\s+/.test(line)){
        flushParagraph();
        flushList();
        parts.push('<h1>'+inlineMarkdown(line.replace(/^#\s+/, ''))+'</h1>');
        continue;
      }

      if (/^[-*]\s+/.test(line)){
        flushParagraph();
        if (listType !== 'ul'){
          flushList();
          listType = 'ul';
          listItems = [];
        }
        listItems.push('<li>'+inlineMarkdown(line.replace(/^[-*]\s+/, ''))+'</li>');
        continue;
      }

      if (/^\d+\.\s+/.test(line)){
        flushParagraph();
        if (listType !== 'ol'){
          flushList();
          listType = 'ol';
          listItems = [];
        }
        listItems.push('<li>'+inlineMarkdown(line.replace(/^\d+\.\s+/, ''))+'</li>');
        continue;
      }

      paragraph.push(line.trim());
    }

    flushCode();
    flushParagraph();
    flushList();

    return '<div class="markdown">'+parts.join('')+'</div>';
  }

  function setCrumbs(path){
    crumbs.textContent = path;
  }

  function resetScroll(){
    if (main) main.scrollTop = 0;
    if (progress) progress.style.width = '0';
  }

  function ensureProgress(){
    if (!main || !progress) return;
    if (detachProgress) detachProgress();
    const onScroll = () => {
      const max = main.scrollHeight - main.clientHeight;
      const current = main.scrollTop;
      const pct = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
      progress.style.width = (pct * 100) + '%';
    };
    main.addEventListener('scroll', onScroll, { passive: true });
    detachProgress = () => main.removeEventListener('scroll', onScroll);
    onScroll();
  }

  async function renderHome(){
    const txt = await get('/pages/home.md');
    content.innerHTML = '<article class="page">'+mdToHtml(txt)+'</article>';
    setCrumbs('/ home');
  }

  async function render(hash){
    try {
      if (!hash || hash === '#/' || hash === '#'){
        await renderHome();
        resetScroll();
        return;
      }

      if (hash.startsWith('#/chapters/')){
        const slug = hash.split('/').pop();
        const txt = await get('/chapters/'+slug+'.md');
        content.innerHTML = '<article class="page">'+mdToHtml(txt)+'</article>';
        setCrumbs('/ chapters / '+slug);
        window.bumpStat && window.bumpStat('chapters_read', 1);
      } else if (hash.startsWith('#/pages/')){
        const slug = hash.split('/').pop();
        const txt = await get('/pages/'+slug+'.md');
        content.innerHTML = '<article class="page">'+mdToHtml(txt)+'</article>';
        setCrumbs('/ pages / '+slug);
      } else if (hash.startsWith('#/notes')){
        const txt = await get('/notes/README.md');
        content.innerHTML = '<article class="page">'+mdToHtml(txt)+'<hr/><h3>Minhas notas</h3><textarea id="localNotes" class="searchBox" style="min-height:220px"></textarea><div class="grid"><button id="saveLocal" class="btn">Salvar</button><button id="exportMd" class="btn btnGhost">Exportar .md</button></div></article>';
        const area = document.getElementById('localNotes');
        area.value = localStorage.getItem('cb.notes') || '';
        document.getElementById('saveLocal').addEventListener('click', () => {
          localStorage.setItem('cb.notes', area.value);
          alert('Notas salvas.');
        });
        document.getElementById('exportMd').addEventListener('click', () => {
          const blob = new Blob([area.value], { type: 'text/markdown' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'cyberbook-notes.md';
          link.click();
        });
        setCrumbs('/ notes');
        window.bumpStat && window.bumpStat('notes_sessions', 1);
      } else if (hash.startsWith('#/search')){
        const q = decodeURIComponent((hash.split('?q=')[1] || '').replace(/\+/g, ' '));
        const res = await window.CB_Search.search(q);
        const header = q ? 'Resultado para “'+esc(q)+'”' : 'Digite algo para buscar';
        content.innerHTML = '<article class="page"><h1>'+header+'</h1><div id="hits" class="stack"></div></article>';
        const hits = document.getElementById('hits');
        if (!res.length){
          hits.innerHTML = '<div class="tile">Nenhum conteúdo encontrado.</div>';
        } else {
          hits.innerHTML = res.map((h) => '<div class="tile"><a class="navLink" href="#/chapters/'+h.slug+'"><strong>'+h.title+'</strong></a><div class="newsMeta">'+esc(h.snippet)+'</div></div>').join('');
        }
        setCrumbs('/ search');
      } else {
        content.innerHTML = '<div class="tile">Rota não encontrada.</div>';
        setCrumbs('/');
      }
      resetScroll();
    } catch (e) {
      content.innerHTML = '<div class="tile">Erro ao carregar página.</div>';
    }
  }

  window.addEventListener('hashchange', () => render(location.hash));
  window.addEventListener('DOMContentLoaded', () => {
    ensureProgress();
    render(location.hash);
    const box = document.getElementById('searchInput');
    if (box){
      box.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter'){
          const q = box.value.trim();
          if (q){
            location.hash = '#/search?q='+encodeURIComponent(q);
          }
        }
      });
    }
  });
})();
