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
      var thumb = e.target.closest && e.target.closest('[data-zn-thumb]');
      if (thumb){
        var image = document.querySelector('#znProductMainImage');
        if (image){ image.src = thumb.dataset.src; image.alt = thumb.dataset.alt || ''; }
        document.querySelectorAll('[data-zn-thumb]').forEach(function(item){ item.classList.toggle('is-active', item === thumb); });
      }
    });

    document.querySelectorAll('[data-mood-orbit]').forEach(function(root){
      var nodes = Array.prototype.slice.call(root.querySelectorAll('[data-mood-node]'));
      if (!nodes.length) return;
      var q = function(s){ return root.querySelector(s); };
      var photo = q('[data-mood-photo]'), name = q('[data-mood-name]'), price = q('[data-mood-price]'), link = q('[data-mood-link]'), small = q('[data-mood-small]'), add = q('[data-mood-add]'), focus = q('.orbit-focus');
      var count = nodes.length, active = 0;
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
      var previous = q('[data-mood-prev]'), next = q('[data-mood-next]'), surprise = q('[data-mood-surprise]');
      if (previous) previous.addEventListener('click', function(){ choose(active - 1); });
      if (next) next.addEventListener('click', function(){ choose(active + 1); });
      if (surprise) surprise.addEventListener('click', function(){ var pick = active; if (count > 1) while (pick === active) pick = Math.floor(Math.random() * count); choose(pick); });
      var stage = q('[data-orbit-stage]'), start = null;
      if (stage){
        stage.addEventListener('touchstart', function(e){ start = e.changedTouches[0] ? e.changedTouches[0].clientX : null; }, {passive:true});
        stage.addEventListener('touchend', function(e){ var end = e.changedTouches[0] && e.changedTouches[0].clientX; if (start === null || end == null) return; var d = end - start; if (Math.abs(d) > 42 && !e.target.closest('[data-orbit-track]')) choose(active + (d > 0 ? -1 : 1)); start = null; }, {passive:true});
      }
      var track = q('[data-orbit-track]'); if (!track || reduce) return;
      if ('IntersectionObserver' in window) new IntersectionObserver(function(en){ root.classList.toggle('is-paused', !en[0].isIntersecting); root.classList.toggle('is-visible', en[0].isIntersecting); }, {threshold:.15}).observe(root);
    });

    if (window.salla){
      try { salla.onReady && salla.onReady(function(){ try { var c = salla.config.get('cart'); if (c && c.count) setBadge(c.count); } catch(e){} }); } catch(e){}
      try { salla.cart.event.onUpdated(function(r){ var n = (r && (r.count != null ? r.count : r.data && r.data.cart && r.data.cart.count)) || 0; setBadge(n); }); } catch(e){}
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
