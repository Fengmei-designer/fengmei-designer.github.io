/* Shared category-style entrance: 32px rise, 800ms, 85ms stagger. */
(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const seen=new WeakSet(),registered=new WeakSet(),running=new Set();
 const selectors=[
  '.categories > a','.shop-section > header','.shop-section > .rail > *',
  '.accessory-grid > *','.fd-hero',
  '.figma-detail-story > section > h2','.figma-detail-story > section > p',
  '.fd-highlights > p','.fd-features > *','.fd-scene > img',
  '.fd-views > *','.fd-home > *','#pSideR > h1','#pSideR > .exo-block',
  '#luna-reviews > h2','.review-summary','.review-filters','#review-list > *',
  '.services > div','.columns > section','.legal'
 ].join(',');
 function enter(el,delay){
  if(seen.has(el)||preference.matches)return;seen.add(el);
  const animation=el.animate([{opacity:0,translate:'0 32px'},{opacity:1,translate:'0 0'}],{duration:800,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
  running.add(animation);animation.onfinish=animation.oncancel=()=>running.delete(animation);
  el.addEventListener('focusin',()=>{if(animation.playState!=='finished')animation.finish()},{once:true});
 }
 const observer=new IntersectionObserver(entries=>{
  const groups=new Map();
  entries.filter(e=>e.isIntersecting).forEach(e=>{observer.unobserve(e.target);const key=e.target.parentElement;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(e.target)});
  for(const els of groups.values())els.sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1).forEach((el,i)=>enter(el,Math.min(i*85,340)));
 },{threshold:.06,rootMargin:'0px 0px -32px 0px'});
 function register(){document.querySelectorAll(selectors).forEach(el=>{if(!registered.has(el)){registered.add(el);observer.observe(el)}})}
 register();const mutations=new MutationObserver(register);mutations.observe(document.body,{childList:true,subtree:true});
 preference.addEventListener('change',event=>{if(event.matches){observer.disconnect();mutations.disconnect();running.forEach(a=>a.cancel());running.clear()}});
})();
