const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-mood-orbit]').forEach(root=>{
  const nodes=[...root.querySelectorAll('[data-mood-node]')];
  const photo=root.querySelector('[data-mood-photo]'),name=root.querySelector('[data-mood-name]'),price=root.querySelector('[data-mood-price]'),link=root.querySelector('[data-mood-link]');
  const choose=node=>{nodes.forEach(n=>n.setAttribute('aria-pressed',String(n===node)));if(photo)photo.src=node.dataset.image||'';if(name)name.textContent=node.dataset.name||'';if(price)price.textContent=node.dataset.price||'';if(link)link.href=node.dataset.url||'#'};
  nodes.forEach(node=>node.addEventListener('click',()=>choose(node)));
  root.querySelector('[data-surprise]')?.addEventListener('click',()=>{let i=0;const timer=setInterval(()=>{choose(nodes[i%nodes.length]);i++;if(i>(reduce?1:10))clearInterval(timer)},reduce?1:90)});
 });
 const menu=document.querySelector('[data-menu]');document.querySelector('[data-menu-open]')?.addEventListener('click',()=>{menu?.classList.add('is-open');document.body.classList.add('locked')});document.querySelectorAll('[data-menu-close]').forEach(el=>el.addEventListener('click',()=>{menu?.classList.remove('is-open');document.body.classList.remove('locked')}));
});
