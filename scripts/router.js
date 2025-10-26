
(function(){
  if (window.trustedTypes && !trustedTypes.getPolicy('cb')) trustedTypes.createPolicy('cb', { createHTML: s=>s });
  const content = document.getElementById('content');
  const crumbs = document.getElementById('breadcrumbs');
  const progress = document.getElementById('readProgress');

  async function get(path){ const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error('Falha'); return r.text(); }
  function esc(s){ return s.replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  function md(md){
    md = md.replace(/^### (.*$)/gim,'<h3>$1</h3>').replace(/^## (.*$)/gim,'<h2>$1</h2>').replace(/^# (.*$)/gim,'<h1>$1</h1>');
    md = md.replace(/```([\s\S]*?)```/g,(_,g)=>'<pre class="code">'+esc(g)+'</pre>');
    md = md.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    md = md.replace(/\n- (.*)/g,'<ul><li>$1</li></ul>').replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    md = md.replace(/\n\n/g,'<br/><br/>');
    return '<div class="markdown">'+md+'</div>';
  }

  function setCrumbs(path){ crumbs.textContent = path; }

  function attachProgress(el){
    function onScroll(){ const h = el.scrollHeight - el.clientHeight; const y = el.scrollTop; const p = Math.max(0, Math.min(1, y/h)); progress.style.width = (p*100)+'%'; }
    el.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  async function render(hash){
    if(!hash || hash==='#/') return;
    try{
      if(hash.startsWith('#/chapters/')){
        const slug=hash.split('/').pop(); const txt=await get('/chapters/'+slug+'.md');
        content.innerHTML = '<article class="page">'+ md(txt) +'</article>'; setCrumbs('/ chapters / '+slug);
        attachProgress(document.querySelector('.content'));
        window.bumpStat && window.bumpStat('chapters_read',1);
      } else if(hash.startsWith('#/pages/')){
        const slug=hash.split('/').pop(); const txt=await get('/pages/'+slug+'.md');
        content.innerHTML = '<article class="page">'+ md(txt) +'</article>'; setCrumbs('/ pages / '+slug);
      } else if(hash.startsWith('#/notes')){
        const txt=await get('/notes/README.md');
        content.innerHTML = '<article class="page">'+ md(txt) + '<hr/><h3>Minhas notas</h3><textarea id="localNotes" class="searchBox" style="min-height:220px"></textarea><div class="grid"><button id="saveLocal" class="btn">Salvar</button><button id="exportMd" class="btn btnGhost">Exportar .md</button></div></article>';
        const area=document.getElementById('localNotes'); area.value = localStorage.getItem('cb.notes')||'';
        document.getElementById('saveLocal').addEventListener('click', ()=>{ localStorage.setItem('cb.notes', area.value); alert('Notas salvas.'); });
        document.getElementById('exportMd').addEventListener('click', ()=>{ const b=new Blob([area.value],{type:'text/markdown'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='cyberbook-notes.md'; a.click(); });
        setCrumbs('/ notes');
        window.bumpStat && window.bumpStat('notes_sessions',1);
      } else if (hash.startsWith('#/search')){
        const q = decodeURIComponent((hash.split('?q=')[1]||'').replace(/\+/g,' '));
        const res = await window.CB_Search.search(q);
        content.innerHTML = '<article class="page"><h1>Resultado</h1><div id="hits"></div></article>';
        const hits = document.getElementById('hits');
        hits.innerHTML = res.map(h=> '<div class="tile"><a class="navLink" href="#/chapters/'+h.slug+'"><strong>'+h.title+'</strong></a><div class="newsMeta">'+esc(h.snippet)+'</div></div>').join('');
        setCrumbs('/ search');
      } else {
        content.innerHTML = '<div class="tile">Rota não encontrada.</div>'; setCrumbs('/');
      }
    }catch(e){ content.innerHTML = '<div class="tile">Erro ao carregar página.</div>'; }
  }

  window.addEventListener('hashchange', ()=> render(location.hash));
  window.addEventListener('DOMContentLoaded', ()=>{
    render(location.hash);
    const box = document.getElementById('searchInput');
    box.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ location.hash = '#/search?q='+encodeURIComponent(box.value.trim()); } });
  });
})();