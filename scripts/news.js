
(function(){
  async function load(){
    const wrap=document.getElementById('newsWrap'); wrap.innerHTML='Carregando...';
    try{
      const res=await fetch('/api/news',{cache:'no-store'});
      if(!res.ok) throw new Error('feed');
      const items=await res.json();
      wrap.innerHTML = items.slice(0,60).map(it=>`<article><a href="${it.link}" target="_blank" rel="noopener noreferrer"><strong>${it.title}</strong></a><div class="news-source">${it.source} • ${new Date(it.pubDate).toLocaleString()}</div></article>`).join('');
    }catch(e){ wrap.innerHTML='Não foi possível carregar o feed.'; }
  }
  function links(){
    const q=encodeURIComponent(document.getElementById('q').value.trim());
    const targets=[
      {name:'Google',url:'https://www.google.com/search?q='+q},
      {name:'Bing',url:'https://www.bing.com/search?q='+q},
      {name:'DuckDuckGo',url:'https://duckduckgo.com/?q='+q},
      {name:'OWASP',url:'https://www.google.com/search?q=site%3Aowasp.org+'+q},
      {name:'NIST',url:'https://www.google.com/search?q=site%3Anist.gov+'+q},
      {name:'MITRE',url:'https://www.google.com/search?q=site%3Aattack.mitre.org+'+q},
      {name:'PortSwigger',url:'https://www.google.com/search?q=site%3Aportswigger.net+'+q}
    ];
    document.getElementById('links').innerHTML = '<ul>'+targets.map(t=>`<li><a target="_blank" rel="noopener noreferrer" href="${t.url}">${t.name}</a></li>`).join('')+'</ul>';
  }
  window.addEventListener('DOMContentLoaded', ()=>{ load(); document.getElementById('go').addEventListener('click', links); });
})();
