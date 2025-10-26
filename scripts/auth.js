
(function(){
  async function me(){ try{ const r=await fetch('/.auth/me',{credentials:'include'}); if(!r.ok) return null; const j=await r.json(); return j.clientPrincipal||null; }catch(e){ return null; } }
  function set(u){ document.getElementById('authStatus').textContent = u ? ('Logado: '+(u.userDetails||u.identityProvider)) : 'Não autenticado'; window.__me = u; }
  window.addEventListener('DOMContentLoaded', async ()=>{
    set(await me());
    document.getElementById('loginGithub').addEventListener('click', ()=> location.href='/.auth/login/github');
    document.getElementById('logout').addEventListener('click', ()=> location.href='/.auth/logout');
  });
})();