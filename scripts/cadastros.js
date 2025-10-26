
window.CB_Cadastros = (function(){
  const DB='cb.data.v1', STORE='kv';
  let db;
  const keys={ users:'users', apps:'apps', owners:'owners', projects:'projects' };

  function open(){ return new Promise((res,rej)=>{ const r=indexedDB.open(DB,1); r.onupgradeneeded=()=> r.result.createObjectStore(STORE); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
  async function get(key){ db=db||await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE).objectStore(STORE).get(key); tx.onsuccess=()=>res(tx.result||[]); tx.onerror=()=>rej(tx.error); }); }
  async function set(key,val){ db=db||await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite').objectStore(STORE).put(val,key); tx.onsuccess=()=>res(true); tx.onerror=()=>rej(tx.error); }); }

  function table(rows, cols){
    return '<table><thead><tr>'+cols.map(c=>'<th>'+c.label+'</th>').join('')+'<th>Ações</th></tr></thead><tbody>'+
      rows.map((r,i)=>'<tr>'+cols.map(c=>'<td>'+ (r[c.key]||'') +'</td>').join('')+`<td><button data-i="${i}" data-act="edit">Editar</button> <button data-i="${i}" data-act="del">Excluir</button></td></tr>`).join('')+
      '</tbody></table>';
  }

  function form(cols, data={}){
    return '<form id="f">'+ cols.map(c=>`<div style="margin-bottom:8px"><label>${c.label}<br/><input name="${c.key}" value="${(data[c.key]||'').toString().replace(/"/g,'&quot;')}" ${c.required?'required':''}></label></div>`).join('') + '<button class="btn">Salvar</button></form>';
  }

  function renderSection(mount, title, key, cols){
    const area = document.createElement('section'); area.className='card'; area.style.marginTop='12px';
    area.innerHTML = '<h3>'+title+'</h3><div class="wrap"></div><div class="actions" style="margin-top:8px"><button class="btn ghost" data-act="add">Adicionar</button> <button class="btn ghost" data-act="export">Exportar JSON</button> <input type="file" id="imp_'+key+'" style="display:none" accept="application/json"><button class="btn ghost" data-act="import">Importar JSON</button></div>';
    mount.appendChild(area);
    const wrap = area.querySelector('.wrap');

    async function refresh(){
      const rows = await get(key);
      wrap.innerHTML = table(rows, cols);
      wrap.querySelectorAll('button').forEach(btn=> btn.addEventListener('click', async (ev)=>{
        const act=btn.dataset.act; const idx=parseInt(btn.dataset.i,10);
        const rows = await get(key);
        if(act==='del'){ rows.splice(idx,1); await set(key,rows); refresh(); }
        if(act==='edit'){ drawForm(rows[idx], idx); }
      }));
    }

    function drawForm(data={}, idx=null){
      const div = document.createElement('div'); div.className='card'; div.style.marginTop='8px';
      div.innerHTML = form(cols, data);
      area.appendChild(div);
      div.querySelector('#f').addEventListener('submit', async (e)=>{
        e.preventDefault();
        const fd = new FormData(e.target);
        const rec = {}; cols.forEach(c=> rec[c.key] = (fd.get(c.key)||'').toString().trim());
        const rows = await get(key);
        if(idx===null){ rows.push(rec); } else { rows[idx]=rec; }
        await set(key, rows); div.remove(); refresh();
      });
    }

    area.querySelector('[data-act=add]').addEventListener('click', ()=> drawForm());
    area.querySelector('[data-act=export]').addEventListener('click', async ()=>{
      const data = await get(key); const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=key+'.json'; a.click();
    });
    area.querySelector('[data-act=import]').addEventListener('click', ()=> area.querySelector('#imp_'+key).click());
    area.querySelector('#imp_'+key).addEventListener('change', async (ev)=>{
      const file=ev.target.files[0]; if(!file) return;
      const text = await file.text();
      try{ const json = JSON.parse(text); await set(key, Array.isArray(json)?json:[]); refresh(); }catch(e){ alert('JSON inválido'); }
    });

    refresh();
  }

  function render(mount){
    mount.innerHTML = '<article class="page card"><h1>Cadastros</h1><p class="alert">Dados ficam no seu navegador (IndexedDB). Exporte JSON para backup/versionamento.</p><div id="areas"></div></article>';
    const container = mount.querySelector('#areas');
    renderSection(container, 'Usuários', keys.users, [
      { key:'nome', label:'Nome', required:true },
      { key:'email', label:'Email', required:true },
      { key:'papel', label:'Papel (dev, PO, gestor)', required:false }
    ]);
    renderSection(container, 'Aplicações', keys.apps, [
      { key:'nome', label:'Aplicação', required:true },
      { key:'stack', label:'Stack (ex.: Node/React)', required:false },
      { key:'ambiente', label:'Ambiente (prod, dev, stage)', required:false }
    ]);
    renderSection(container, 'Responsáveis', keys.owners, [
      { key:'aplicacao', label:'Aplicação', required:true },
      { key:'responsavel', label:'Responsável', required:true },
      { key:'contato', label:'Contato', required:false }
    ]);
    renderSection(container, 'Projetos', keys.projects, [
      { key:'titulo', label:'Título do projeto', required:true },
      { key:'descricao', label:'Descrição', required:false },
      { key:'status', label:'Status (planejado/em curso/feito)', required:false }
    ]);
  }

  return { render };
})();