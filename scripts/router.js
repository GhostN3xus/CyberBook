
(function(){
  if (window.trustedTypes && !trustedTypes.getPolicy('cb')) trustedTypes.createPolicy('cb', { createHTML: s=>s });
  const content = document.getElementById('content');
  async function get(path){ const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error('Falha'); return r.text(); }
  function e(s){ return s.replace(/[&<>]/g,c=>({'&':'&','<':'&lt;','>':'&gt;'}[c])); }
  function md(md){
    md = md.replace(/^### (.*$)/gim,'<h3>$1</h3>').replace(/^## (.*$)/gim,'<h2>$1</h2>').replace(/^# (.*$)/gim,'<h1>$1</h1>');
    md = md.replace(/```([\s\S]*?)```/g,(_,g)=>'<pre class="code">'+e(g)+'</pre>');
    md = md.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    md = md.replace(/\n- (.*)/g,'<ul><li>$1</li></ul>').replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    md = md.replace(/\n\n/g,'<br/><br/>');
    return '<div class="markdown">'+md+'</div>';
  }
  async function render(hash){
    if(!hash || hash==='#/' ) return;
    try{
      if(hash.startsWith('#/chapters/')){
        const slug=hash.split('/').pop(); const txt=await get('/chapters/'+slug+'.md');
        content.innerHTML = '<article class="page card">'+ md(txt) +'</article>'; window.bumpStat && window.bumpStat('chapters_read',1);
      } else if(hash.startsWith('#/pages/')){
        const slug=hash.split('/').pop(); const txt=await get('/pages/'+slug+'.md');
        content.innerHTML = '<article class="page card">'+ md(txt) +'</article>';
      } else if(hash.startsWith('#/cadastros')){
        window.CB_Cadastros.render(content);
      } else if(hash.startsWith('#/admin')){
        window.CB_Admin.render(content);
      } else if(hash.startsWith('#/notes')){
        const txt=await get('/notes/README.md');
        content.innerHTML = '<article class="page card">'+ md(txt) + '<hr/><h3>Minhas notas</h3><textarea id="localNotes" style="width:100%;min-height:220px"></textarea><div style="margin-top:8px"><button id="saveLocal" class="btn">Salvar</button> <button id="exportMd" class="btn ghost">Exportar .md</button></div></article>';
        const area=document.getElementById('localNotes'); area.value = localStorage.getItem('cb.notes')||'';
        document.getElementById('saveLocal').onclick = ()=>{ localStorage.setItem('cb.notes', area.value); alert('Notas salvas.'); };
        document.getElementById('exportMd').onclick = ()=>{ const b=new Blob([area.value],{type:'text/markdown'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='cyberbook-notes.md'; a.click(); };
        window.bumpStat && window.bumpStat('notes_sessions',1);
      } else if (hash.startsWith('#/search')){
        const q = decodeURIComponent((hash.split('?q=')[1]||'').replace(/\+/g,' '));
        const res = await window.CB_Search.search(q);
        content.innerHTML = '<article class="page card"><h1>Resultado</h1><div id="hits"></div></article>';
        const hits = document.getElementById('hits');
        hits.innerHTML = res.map(h=> '<div style="margin:8px 0"><a class="nav-link" href="#/chapters/'+h.slug+'"><strong>'+h.title+'</strong></a><div class="alert">'+e(h.snippet)+'</div></div>').join('');
      } else {
        content.innerHTML = '<div class="card">Rota não encontrada.</div>';
      }
    }catch(e){ content.innerHTML = '<div class="card">Erro ao carregar página.</div>'; }
  }
  window.addEventListener('hashchange', ()=> render(location.hash));
  window.addEventListener('DOMContentLoaded', ()=>{
    render(location.hash);
    const box = document.getElementById('searchInput');
    box.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ location.hash = '#/search?q='+encodeURIComponent(box.value.trim()); } });
  });
})();