
(function(){
  const KEY='cb.stats'; const ZERO={chapters_read:0, notes_sessions:0, last_visit:Date.now()};
  function r(){ try{return JSON.parse(localStorage.getItem(KEY))||ZERO}catch(e){return ZERO} }
  function w(v){ localStorage.setItem(KEY, JSON.stringify(v)); }
  window.bumpStat=(f,i=1)=>{ const s=r(); s[f]=(s[f]||0)+i; s.last_visit=Date.now(); w(s); const el=document.getElementById('stats'); if(el) window.renderStats(el); };
  window.renderStats=(el)=>{ const s=r(); el.innerHTML = '<div><strong>Estudo</strong></div><div>Capítulos: '+s.chapters_read+'</div><div>Notas: '+s.notes_sessions+'</div>'; };
  window.addEventListener('DOMContentLoaded', ()=>{ const el=document.getElementById('stats'); if(el) window.renderStats(el); });
})();