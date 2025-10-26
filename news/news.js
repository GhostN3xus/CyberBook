(function(){
  const listEl = document.getElementById('newsList');
  const statusEl = document.getElementById('newsStatus');
  const searchInput = document.getElementById('searchNews');
  const sourceSelect = document.getElementById('sourceFilter');
  const refreshBtn = document.getElementById('refreshNews');

  let cache = [];

  function setStatus(message){
    if (statusEl) statusEl.textContent = message || '';
  }

  function formatDate(value){
    if (!value) return 'Data desconhecida';
    try{
      return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    }catch(e){
      return 'Data desconhecida';
    }
  }

  function populateSources(){
    const sources = Array.from(new Set(cache.map((item) => item.source).filter(Boolean))).sort();
    sourceSelect.innerHTML = '';
    const all = document.createElement('option');
    all.value = '';
    all.textContent = 'Todas as fontes';
    sourceSelect.appendChild(all);
    sources.forEach((source) => {
      const opt = document.createElement('option');
      opt.value = source;
      opt.textContent = source;
      sourceSelect.appendChild(opt);
    });
  }

  function render(){
    const query = (searchInput.value || '').trim().toLowerCase();
    const source = sourceSelect.value;
    const filtered = cache.filter((item) => {
      const matchSource = !source || item.source === source;
      const blob = `${item.title || ''} ${item.source || ''}`.toLowerCase();
      const matchText = !query || blob.includes(query);
      return matchSource && matchText;
    });

    if (!filtered.length){
      listEl.innerHTML = '<div class="appEmpty">Nenhuma notícia encontrada.</div>';
      return;
    }

    listEl.innerHTML = '';
    filtered.slice(0, 60).forEach((item) => {
      const card = document.createElement('article');
      card.className = 'newsCard';

      const title = document.createElement('h2');
      const link = document.createElement('a');
      link.href = item.link || '#';
      link.textContent = item.title || 'Sem título';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      title.appendChild(link);
      card.appendChild(title);

      const summary = document.createElement('p');
      const snippet = item.summary || item.contentSnippet || '';
      summary.textContent = snippet ? snippet : 'Sem resumo disponível, clique para ler a matéria completa.';
      card.appendChild(summary);

      const footer = document.createElement('footer');
      const sourceTag = document.createElement('span');
      sourceTag.textContent = item.source || 'Fonte desconhecida';
      footer.appendChild(sourceTag);

      const dateTag = document.createElement('span');
      dateTag.textContent = formatDate(item.pubDate);
      footer.appendChild(dateTag);

      card.appendChild(footer);
      listEl.appendChild(card);
    });
  }

  async function load(){
    setStatus('Carregando notícias...');
    listEl.innerHTML = '';
    try{
      const response = await fetch('/api/news', { cache: 'no-store' });
      if (!response.ok) throw new Error('Erro ao buscar notícias');
      const data = await response.json();
      cache = Array.isArray(data) ? data : [];
      populateSources();
      render();
      setStatus(`Atualizado em ${formatDate(new Date().toISOString())}`);
    }catch(err){
      console.error(err);
      setStatus('Falha ao carregar notícias. Tente novamente.');
      listEl.innerHTML = '<div class="appEmpty">Não foi possível obter dados agora.</div>';
    }
  }

  searchInput.addEventListener('input', () => render());
  sourceSelect.addEventListener('change', () => render());
  refreshBtn.addEventListener('click', () => load());

  window.addEventListener('DOMContentLoaded', () => load());
})();
