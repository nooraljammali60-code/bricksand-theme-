(function(){
  if (window.__chocolateTheme) return; window.__chocolateTheme = true;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init(){
    document.querySelectorAll('[data-mood-orbit]').forEach(function(root){
      var nodes = Array.prototype.slice.call(root.querySelectorAll('[data-mood-node]'));
      if (!nodes.length) return;
      var photo = root.querySelector('[data-mood-photo]'), name = root.querySelector('[data-mood-name]'), price = root.querySelector('[data-mood-price]'), link = root.querySelector('[data-mood-link]');
      function choose(node){
        nodes.forEach(function(n){ n.setAttribute('aria-pressed', String(n === node)); });
        if (photo){ photo.src = node.dataset.image || ''; photo.alt = node.dataset.name || ''; }
        if (name) name.textContent = node.dataset.name || '';
        if (price) price.textContent = node.dataset.price || '';
        if (link) link.href = node.dataset.url || '#';
      }
      nodes.forEach(function(node){ node.addEventListener('click', function(){ choose(node); }); });
      var surprise = root.querySelector('[data-surprise]');
      if (surprise) surprise.addEventListener('click', function(){
        var steps = reduce ? 1 : 10 + Math.floor(Math.random() * nodes.length), i = 0;
        var t = setInterval(function(){ choose(nodes[i % nodes.length]); i++; if (i >= steps) clearInterval(t); }, reduce ? 1 : 90);
      });
    });
    var menu = document.querySelector('[data-menu]'), backdrop = document.querySelector('.drawer-backdrop');
    var open = document.querySelector('[data-menu-open]');
    if (open) open.addEventListener('click', function(){ if (menu) menu.classList.add('is-open'); if (backdrop) backdrop.classList.add('is-open'); document.body.classList.add('locked'); });
    document.querySelectorAll('[data-menu-close]').forEach(function(el){ el.addEventListener('click', function(){ if (menu) menu.classList.remove('is-open'); if (backdrop) backdrop.classList.remove('is-open'); document.body.classList.remove('locked'); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
