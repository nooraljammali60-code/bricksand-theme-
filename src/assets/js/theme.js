(function(){
  if (window.__chocolateTheme) return; window.__chocolateTheme = true;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function addToCart(id, btn){
    if (!id) return;
    if (window.salla && salla.cart && salla.cart.addItem){ if(btn) btn.disabled = true; Promise.resolve(salla.cart.addItem(id)).finally(function(){ if(btn) btn.disabled = false; }); }
    else location.href = '/cart';
  }
  function setBadge(n){ document.querySelectorAll('[data-cart-badge]').forEach(function(b){ b.textContent = n; b.hidden = !n; }); }
  function init(){
    var header = document.querySelector('[data-site-header]');
    var hasCinema = !!document.querySelector('.cinema');
    if (!hasCinema){ document.body.classList.add('no-cinema'); }
    function onScroll(){ if (header) header.classList.toggle('is-solid', !hasCinema || window.scrollY > 40); }
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

    document.querySelectorAll('[data-overlay-open]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var o = document.querySelector('[data-overlay="'+btn.dataset.overlayOpen+'"]'); if(!o) return;
        o.hidden = false; document.body.classList.add('locked');
        var input = o.querySelector('input'); if (input) setTimeout(function(){ input.focus(); }, 50);
      });
    });
    function closeAll(){ document.querySelectorAll('[data-overlay]').forEach(function(o){ o.hidden = true; }); document.body.classList.remove('locked'); }
    document.querySelectorAll('[data-overlay-close]').forEach(function(el){ el.addEventListener('click', closeAll); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(); });

    document.addEventListener('click', function(e){
      var btn = e.target.closest && e.target.closest('[data-add-to-cart]');
      if (btn){ e.preventDefault(); addToCart(btn.getAttribute('data-add-to-cart'), btn); }
    });

    document.querySelectorAll('[data-mood-orbit]').forEach(function(root){
      var nodes = Array.prototype.slice.call(root.querySelectorAll('[data-mood-node]'));
      if (!nodes.length) return;
      var q = function(s){ return root.querySelector(s); };
      var photo = q('[data-mood-photo]'), name = q('[data-mood-name]'), price = q('[data-mood-price]'), link = q('[data-mood-link]'), small = q('[data-mood-small]'), add = q('[data-mood-add]'), focus = q('.orbit-focus');
      var count = nodes.length / 2, active = 0;
      function choose(i){
        active = (i + count) % count; var node = nodes[active];
        nodes.forEach(function(n){ var on = Number(n.dataset.moodNode) === active; n.classList.toggle('is-active', on); n.setAttribute('aria-pressed', String(on)); });
        if (photo){ photo.src = node.dataset.image; photo.alt = node.dataset.name; }
        if (name) name.textContent = node.dataset.name;
        if (price) price.textContent = node.dataset.price;
        if (small) small.textContent = node.dataset.small;
        if (link) link.href = node.dataset.url;
        if (add) add.setAttribute('data-add-to-cart', node.dataset.id);
        if (focus){ focus.style.animation = 'none'; void focus.offsetWidth; focus.style.animation = ''; }
      }
      nodes.forEach(function(n){ n.addEventListener('click', function(){ choose(Number(n.dataset.moodNode)); }); });
      var stage = q('[data-orbit-stage]'), start = null;
      if (stage){
        stage.addEventListener('touchstart', function(e){ start = e.changedTouches[0] ? e.changedTouches[0].clientX : null; }, {passive:true});
        stage.addEventListener('touchend', function(e){ var end = e.changedTouches[0] && e.changedTouches[0].clientX; if (start === null || end == null) return; var d = end - start; if (Math.abs(d) > 42 && !e.target.closest('[data-orbit-track]')) choose(active + (d > 0 ? -1 : 1)); start = null; }, {passive:true});
      }
      var track = q('[data-orbit-track]'); if (!track || reduce) return;
      var visible = true, resume = 0, last = performance.now();
      if ('IntersectionObserver' in window) new IntersectionObserver(function(en){ visible = en[0].isIntersecting; root.classList.toggle('is-paused', !visible); root.classList.toggle('is-visible', visible); }, {threshold:.15}).observe(root);
      var pause = function(){ resume = performance.now() + 2500; };
      track.addEventListener('pointerdown', pause); track.addEventListener('wheel', pause, {passive:true}); track.addEventListener('touchstart', pause, {passive:true});
      (function step(now){
        var dt = now - last; last = now;
        if (visible && now > resume && track.scrollWidth > track.clientWidth + 2){
          track.scrollLeft -= dt * .035;
          var half = (track.scrollWidth - track.clientWidth) / 2;
          if (track.scrollLeft <= -half) track.scrollLeft += half;
          if (track.scrollLeft >= 0) track.scrollLeft -= half;
        }
        requestAnimationFrame(step);
      })(last);
    });

    if (window.salla){
      try { salla.onReady && salla.onReady(function(){ try { var c = salla.config.get('cart'); if (c && c.count) setBadge(c.count); } catch(e){} }); } catch(e){}
      try { salla.cart.event.onUpdated(function(r){ var n = (r && (r.count != null ? r.count : r.data && r.data.cart && r.data.cart.count)) || 0; setBadge(n); }); } catch(e){}
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
