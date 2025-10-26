
window.CB_Search = (function(){
  const docs=[
    {slug:'owasp-top-10', title:'OWASP Top 10', path:'/chapters/owasp-top-10.md'},
    {slug:'apis', title:'APIs & Microserviços', path:'/chapters/apis.md'},
    {slug:'secure-coding', title:'Secure Coding', path:'/chapters/secure-coding.md'},
    {slug:'tools', title:'Ferramentas', path:'/chapters/tools.md'},
    {slug:'configlab', title:'ConfigLab', path:'/chapters/configlab.md'}
  ];
  let cache=[];
  async function load(){
    if(cache.length) return cache;
    const arr=[];
    for(const d of docs){
      try{ const t=await fetch(d.path,{cache:'no-store'}).then(r=>r.text()); arr.push({...d, text:t}); }catch(e){}
    }
    cache=arr; return arr;
  }
  function snippet(text, q){
    const i=text.toLowerCase().indexOf(q.toLowerCase()); if(i<0) return text.slice(0,140)+'...';
    const start=Math.max(0,i-60); return text.slice(start,start+160)+'...';
  }
  return {
    async search(q){
      if(!q||q.length<2) return [];
      const list = await load();
      const res = list.map(d=>({d, score: (d.text.toLowerCase().includes(q.toLowerCase())?1:0)}))
        .filter(x=>x.score>0)
        .map(x=>({ slug:x.d.slug, title:x.d.title, snippet: snippet(x.d.text, q) }));
      return res;
    }
  };
})();