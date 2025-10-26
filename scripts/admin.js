
window.CB_Admin = (function(){
  function requireAuth(){
    const u = window.__me;
    if(!u){ alert('Área restrita. Faça login.'); location.hash='#/'; return false; }
    return true;
  }
  function render(mount){
    if(!requireAuth()) return;
    mount.innerHTML = '<article class="page card"><h1>Admin</h1><div id="info"></div><div class="section"><h3>CSP Reports (beta)</h3><p class="alert">Endpoint: <code>/api/csp-report</code> (Report-Only). Configure via cabeçalho ou meta tag. A Function logs os relatórios no console (sem persistir).</p></div><div class="section"><h3>Exportar tudo</h3><button id="expAll" class="btn">Exportar JSON (Cadastros)</button></div></article>';
    const info = mount.querySelector('#info');
    info.innerHTML = '<div class="tile"><div class="badge">Auth</div> ' + (window.__me ? 'Logado' : 'Anônimo') + '</div>'
      + '<div class="tile" style="margin-top:8px"><div class="badge">Headers</div> Verifique no DevTools → Network (CSP, HSTS, COOP/COEP/CORP)</div>';
    mount.querySelector('#expAll').addEventListener('click', async ()=>{
      // exporta todas as coleções do IndexedDB 'cb.data.v1'
      const dbName='cb.data.v1', store='kv';
      const out={};
      await new Promise((resolve, reject)=>{
        const r=indexedDB.open(dbName,1);
        r.onupgradeneeded=()=> r.result.createObjectStore(store);
        r.onsuccess=()=>{
          const db=r.result;
          const tx=db.transaction(store,'readonly').objectStore(store).getAll();
          const txk=db.transaction(store,'readonly').objectStore(store).getAllKeys();
          let vals=null, keys=null;
          tx.onsuccess=()=>{ vals=tx.result; if(keys) done(); };
          txk.onsuccess=()=>{ keys=txk.result; if(vals) done(); };
          function done(){ keys.forEach((k,i)=> out[k]=vals[i]); resolve(); }
        };
        r.onerror=()=> reject(r.error);
      });
      const blob = new Blob([JSON.stringify(out,null,2)],{type:'application/json'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='cyberbook-backup.json'; a.click();
    });
  }
  return { render };
})();