(function(){
  const DB_NAME = 'cyberbook-admin';
  const DB_VERSION = 1;
  const STORES = {
    usuarios: {
      label: 'Usuários',
      singular: 'usuário',
      fields: [
        { name: 'nome', label: 'Nome completo', type: 'text', required: true, placeholder: 'Fulano da Silva' },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'perfil', label: 'Perfil de acesso', type: 'select', options: ['Administrador', 'Desenvolvedor', 'Analista', 'Convidado'] }
      ]
    },
    aplicacoes: {
      label: 'Aplicações',
      singular: 'aplicação',
      fields: [
        { name: 'nome', label: 'Nome da aplicação', type: 'text', required: true },
        { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Escopo, integrações e detalhes relevantes' },
        { name: 'classificacao', label: 'Criticidade', type: 'select', options: ['Alta', 'Média', 'Baixa'], required: true },
        { name: 'repositorio', label: 'Repositório / Git', type: 'text', placeholder: 'https://github.com/org/app' }
      ]
    },
    responsaveis: {
      label: 'Responsáveis',
      singular: 'responsável',
      fields: [
        { name: 'nome', label: 'Nome', type: 'text', required: true },
        { name: 'area', label: 'Área / Tribo', type: 'text', placeholder: 'Ex.: Plataforma, Produto, Governança' },
        { name: 'contato', label: 'Contato principal', type: 'text', placeholder: 'E-mail ou canal de chat' }
      ]
    },
    projetos: {
      label: 'Projetos',
      singular: 'projeto',
      fields: [
        { name: 'nome', label: 'Projeto', type: 'text', required: true },
        { name: 'objetivo', label: 'Objetivo', type: 'textarea', placeholder: 'Resultado esperado e métricas de sucesso' },
        { name: 'status', label: 'Status', type: 'select', options: ['Descoberta', 'Em desenvolvimento', 'Em produção', 'Encerrado'] },
        { name: 'owner', label: 'Owner principal', type: 'text' }
      ]
    }
  };

  let db;
  let currentStore = 'usuarios';
  let editingRecord = null;
  let statusTimer = null;

  const typeNav = document.getElementById('entityTypes');
  const listEl = document.getElementById('list');
  const form = document.getElementById('entityForm');
  const fieldsContainer = document.getElementById('dynamicFields');
  const statusEl = document.getElementById('status');
  const newBtn = document.getElementById('newEntry');
  const cancelBtn = document.getElementById('cancelEdit');
  const exportBtn = document.getElementById('exportData');
  const importInput = document.getElementById('importFile');
  const formTitle = document.getElementById('formTitle');

  function setStatus(message){
    if (!statusEl) return;
    statusEl.textContent = message || '';
    if (statusTimer) clearTimeout(statusTimer);
    if (message){
      statusTimer = setTimeout(() => {
        if (statusEl.textContent === message) statusEl.textContent = '';
      }, 4000);
    }
  }

  function openDb(){
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        Object.keys(STORES).forEach((key) => {
          if (!database.objectStoreNames.contains(key)){
            database.createObjectStore(key, { keyPath: 'id', autoIncrement: true });
          }
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function getAll(store){
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const request = tx.objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function addItem(store, value){
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const request = tx.objectStore(store).add(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function putItem(store, value){
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const request = tx.objectStore(store).put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function deleteItem(store, id){
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const request = tx.objectStore(store).delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function clearStore(store){
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const request = tx.objectStore(store).clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function sanitize(meta, data){
    const result = {};
    meta.fields.forEach((field) => {
      const value = data[field.name];
      if (value !== undefined && value !== null && value !== ''){
        result[field.name] = typeof value === 'string' ? value : String(value);
      } else if (field.required){
        result[field.name] = '';
      }
    });
    if (typeof data.id !== 'undefined') result.id = data.id;
    const now = Date.now();
    result.createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
    result.updatedAt = typeof data.updatedAt === 'number' ? data.updatedAt : now;
    return result;
  }

  function formatDate(ts){
    if (!ts) return '';
    try{
      return new Date(ts).toLocaleString('pt-BR');
    }catch(e){
      return '';
    }
  }

  function buildNav(){
    typeNav.innerHTML = '';
    Object.entries(STORES).forEach(([key, meta]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = meta.label;
      button.dataset.type = key;
      if (key === currentStore) button.classList.add('is-active');
      button.addEventListener('click', () => {
        if (currentStore !== key){
          currentStore = key;
          updateActiveType();
          startNew();
          refreshList();
        }
      });
      typeNav.appendChild(button);
    });
  }

  function updateActiveType(){
    typeNav.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.type === currentStore);
    });
  }

  function renderForm(meta, values){
    fieldsContainer.innerHTML = '';
    meta.fields.forEach((field) => {
      const wrapper = document.createElement('label');
      wrapper.htmlFor = `field-${field.name}`;
      wrapper.textContent = field.label;

      let input;
      if (field.type === 'textarea'){
        input = document.createElement('textarea');
      } else if (field.type === 'select'){
        input = document.createElement('select');
        (field.options || []).forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }

      input.id = `field-${field.name}`;
      input.name = field.name;
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.required) input.required = true;
      input.value = values[field.name] || '';
      wrapper.appendChild(input);
      fieldsContainer.appendChild(wrapper);
    });
  }

  function renderEmpty(meta){
    listEl.innerHTML = `<div class="appEmpty">Nenhum ${meta.singular} cadastrado ainda.</div>`;
  }

  function renderList(meta, items){
    if (!items.length){
      renderEmpty(meta);
      return;
    }
    listEl.innerHTML = '';
    items
      .sort((a, b) => (a.updatedAt || 0) < (b.updatedAt || 0) ? 1 : -1)
      .forEach((item) => {
        const card = document.createElement('article');
        card.className = 'appListItem';

        const titleField = meta.fields[0]?.name;
        const title = titleField ? (item[titleField] || `${meta.label} #${item.id}`) : `${meta.label} #${item.id}`;
        const heading = document.createElement('h3');
        heading.textContent = title;
        card.appendChild(heading);

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = `ID ${item.id}`;
        card.appendChild(badge);

        const details = document.createElement('p');
        const extraFields = meta.fields.slice(1)
          .map((field) => item[field.name] ? `${field.label}: ${item[field.name]}` : '')
          .filter(Boolean)
          .join(' • ');
        details.textContent = extraFields || 'Nenhum detalhe adicional';
        card.appendChild(details);

        const metaInfo = document.createElement('div');
        metaInfo.className = 'meta';
        metaInfo.textContent = `Atualizado em ${formatDate(item.updatedAt)}`;
        card.appendChild(metaInfo);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => startEdit(meta, item));

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', async () => {
          if (confirm('Remover este registro?')){
            await deleteItem(currentStore, item.id);
            setStatus('Registro removido.');
            refreshList();
          }
        });

        actions.appendChild(editBtn);
        actions.appendChild(removeBtn);
        card.appendChild(actions);

        listEl.appendChild(card);
      });
  }

  async function refreshList(){
    const meta = STORES[currentStore];
    const data = await getAll(currentStore);
    renderList(meta, data);
  }

  function startNew(){
    editingRecord = null;
    const meta = STORES[currentStore];
    form.reset();
    renderForm(meta, {});
    formTitle.textContent = `Novo ${meta.singular}`;
  }

  function startEdit(meta, record){
    editingRecord = { ...record };
    renderForm(meta, record);
    formTitle.textContent = `Editar ${meta.singular}`;
  }

  async function handleSubmit(ev){
    ev.preventDefault();
    const meta = STORES[currentStore];
    const formData = new FormData(form);
    const payload = {};
    let hasErrors = false;

    meta.fields.forEach((field) => {
      const value = (formData.get(field.name) || '').toString().trim();
      if (field.required && !value){
        hasErrors = true;
        const input = form.querySelector(`[name="${field.name}"]`);
        if (input) input.classList.add('has-error');
      } else {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (input) input.classList.remove('has-error');
      }
      if (value) payload[field.name] = value;
    });

    if (hasErrors){
      setStatus('Preencha os campos obrigatórios.');
      return;
    }

    try{
      if (editingRecord){
        const updated = sanitize(meta, { ...editingRecord, ...payload, id: editingRecord.id, createdAt: editingRecord.createdAt });
        await putItem(currentStore, updated);
        setStatus('Registro atualizado com sucesso.');
      } else {
        const record = sanitize(meta, payload);
        await addItem(currentStore, record);
        setStatus('Registro criado.');
      }
      startNew();
      refreshList();
    }catch(err){
      console.error(err);
      setStatus('Não foi possível salvar o registro.');
    }
  }

  async function handleExport(){
    try{
      const payload = {};
      for (const key of Object.keys(STORES)){
        payload[key] = await getAll(key);
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'cyberbook-cadastros.json';
      link.click();
      setStatus('Exportação concluída.');
    }catch(err){
      console.error(err);
      setStatus('Falha ao exportar dados.');
    }
  }

  async function handleImport(event){
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try{
      const text = await file.text();
      const data = JSON.parse(text);
      for (const key of Object.keys(STORES)){
        const meta = STORES[key];
        const list = Array.isArray(data[key]) ? data[key] : [];
        await clearStore(key);
        for (const item of list){
          const sanitized = sanitize(meta, item);
          if (typeof item.id !== 'undefined') sanitized.id = item.id;
          await putItem(key, sanitized);
        }
      }
      setStatus('Importação concluída.');
      refreshList();
    }catch(err){
      console.error(err);
      setStatus('Não foi possível importar o arquivo. Verifique o formato.');
    }finally{
      event.target.value = '';
    }
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try{
      db = await openDb();
      buildNav();
      startNew();
      refreshList();
    }catch(err){
      console.error(err);
      setStatus('Não foi possível abrir o banco local. Verifique permissões do navegador.');
    }

    form.addEventListener('submit', handleSubmit);
    newBtn.addEventListener('click', () => startNew());
    cancelBtn.addEventListener('click', () => startNew());
    exportBtn.addEventListener('click', handleExport);
    importInput.addEventListener('change', handleImport);
  });
})();
