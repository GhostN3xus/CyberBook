(function(){
  const root = document.documentElement;
  const key='cb.theme';
  function apply(v){ root.setAttribute('data-theme', v); localStorage.setItem(key,v); }
  window.addEventListener('DOMContentLoaded', ()=>{
    const saved = localStorage.getItem(key) || (window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
    apply(saved);
    const toggle = document.getElementById('themeToggle');
    if (toggle){
      toggle.addEventListener('click', ()=> apply(root.getAttribute('data-theme')==='dark'?'light':'dark'));
    }
  });
})();
